import express from 'express';
import bcrypt from 'bcryptjs';
import Credential from '../models/Credential.js';
import User from '../models/User.js';   
import Ou from '../models/Ou.js';  
import Division from '../models/Division.js';  
import verifyToken from '../verifyToken/verifyToken.js';
import checkRole from '../verifyToken/checkRole.js';

const router = express.Router();

// Endpoint to fetch list of divisions and OUs
router.get('/division-list', async (req, res) => {
    try {
        const divisions = await Division.find({}).populate('ou');
        res.json({ divisions });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching divisions' });
    }
});

// View credentials for the logged-in user's division
router.get('/division', verifyToken, async (req, res) => {
    const userId = req.user.id; 

    try {
        // Find the user by ID and select their division
        const user = await User.findById(userId).select('division');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user has a division linked
        if (!user.division) {
            return res.status(404).json({ message: 'No division linked to this user' });
        }

        // Retrieve the division details from the Division model
        const division = await Division.findById(user.division).populate('credentials');
        if (!division) {
            return res.status(404).json({ message: 'Division not found' });
        }

        // Return the division details
        res.json({ division });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Endpoint to get the user's divisions and associated credentials
router.get('/user/division-credentials', verifyToken, async (req, res) => {
    const userId = req.user.id;  

    try {
        const user = await User.findById(userId).select('divisions divisionPasswords');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.divisions || user.divisions.length === 0) {
            return res.status(404).json({ message: 'No divisions linked to this user' });
        }

        const divisionData = [];

        for (const divisionId of user.divisions) {
            const division = await Division.findById(divisionId);

            if (!division) {
                return res.status(404).json({ message: `Division with ID ${divisionId} not found` });
            }

            const credentials = await Credential.find({ division: divisionId });

            // Map credentials to return only necessary fields
            const credentialList = credentials.map(credential => ({
                _id: credential._id,
                username: credential.username,
                service: credential.service, 
            }));

            divisionData.push({
                division,
                credentials: credentialList,
            });
        }

        res.json({ user, divisionData });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Endpoint to update a specific credential by ID
router.put('/update-credential/:id', verifyToken, checkRole('management', 'admin'), async (req, res) => {
    try {
        const { id } = req.params;  
        const { username, password, service } = req.body; 

        // Find the credential and update it
        const updatedCredential = await Credential.findByIdAndUpdate(id, {
            username,
            password,
            service,
        }, { new: true }); 

        if (!updatedCredential) {
            return res.status(404).json({ message: 'Credential not found' });
        }

        res.json({ message: 'Credential updated successfully', updatedCredential });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating credential' });
    }
});


// Endpoint to fetch credentials for a division and OU 
router.get('/division/credentials', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('division');
        if (!user || !user.division) {
            return res.status(404).json({ message: 'No division linked to this user' });
        }

        const division = await Division.findById(user.division).populate('credentials');
        if (!division) {
            return res.status(404).json({ message: 'Division not found' });
        }

        const credentials = division.credentials;

        // filter by OU
        const ouId = req.query.ouId;
        if (ouId) {
            const filteredCredentials = credentials.filter(credential => credential.ou.toString() === ouId);
            return res.json({ credentials: filteredCredentials });
        }

        // Return all credentials for the division
        res.json({ credentials });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Endpoint for adding new credentials
router.post('/add-credentials', verifyToken, checkRole('normal', 'management', 'admin'), async (req, res) => {
    const { username, password, service, division, ou } = req.body;

    if (!username || !password || !service || !division || !ou) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Find the user by ID
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the division and organizational unit manually
        const userDivision = await Division.findById(division);
        const userOu = await Ou.findById(ou);

        if (!userDivision) {
            return res.status(404).json({ message: 'Division not found' });
        }

        if (!userOu) {
            return res.status(404).json({ message: 'Organizational Unit (OU) not found' });
        }

        // Check if the user is part of the requested division
        if (!user.divisions.includes(division)) {
            return res.status(404).json({ message: 'User is not part of this division' });
        }

        // Hash the credential password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new credential
        const newCredential = new Credential({
            username,
            password: hashedPassword,
            service,
            division: userDivision._id,  
            ou: userOu._id,             
        });

        await newCredential.save();

        // Update the division and OU documents by adding the new credential ID to their respective arrays
        await Division.findByIdAndUpdate(
            userDivision._id,
            { $addToSet: { credentials: newCredential._id } }, 
            { new: true }
        );

        await Ou.findByIdAndUpdate(
            userOu._id,
            { $addToSet: { credentials: newCredential._id } }, 
            { new: true }
        );

        // Return success response
        res.status(201).json({ message: 'Credential added successfully', credential: newCredential });

    } catch (error) {
        console.error('Error during credential addition:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



// Endpoint to fetch all credentials 
router.get('/credentials', verifyToken, async (req, res) => {
    try {
        // Fetch all credentials
        const credentials = await Credential.find();

        // Fetch associated Divisions and OUs
        const credentialWithDetails = await Promise.all(
            credentials.map(async (credential) => {
                // Fetch the Division by ID
                const division = await Division.findById(credential.division);
                
                // Fetch the OU by ID
                const ou = await Ou.findById(credential.ou);

                // Return the credential along with the populated Division and OU data
                return {
                    ...credential.toObject(), 
                    division: division ? { name: division.name, description: division.description } : null,
                    ou: ou ? { name: ou.name, description: ou.description } : null
                };
            })
        );

        // Respond with the credentials, now containing the division and ou details
        res.json({ credentials: credentialWithDetails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Management and Admin users can update credentials
router.put('/credentials/id', verifyToken, checkRole('management', 'admin'), async (req, res) => {
    const { username, password, service } = req.body;

    try {
        const credential = await Credential.findById(req.params.id);
        if (!credential) {
            return res.status(404).json({ message: 'Credential not found' });
        }

        // Update only the fields provided
        if (username) credential.username = username;
        if (service) credential.service = service;
        if (password) {
            credential.password = await bcrypt.hash(password, 10);
        }

        await credential.save();

        res.json({ message: 'Credential updated successfully', credential });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin endpoint for assigning/unassigning users to divisions
router.put('/assign-division/:userId', verifyToken, checkRole('admin'), async (req, res) => {
    const { divisionId } = req.body;

    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const division = await Division.findById(divisionId);
        if (!division) {
            return res.status(400).json({ message: 'Invalid division ID' });
        }

        user.division = division._id;
        await user.save();

        res.json({ message: 'Division assigned successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// export router to be used in other parts of the code
export default router;
