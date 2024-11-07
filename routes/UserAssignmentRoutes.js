import express from 'express';
import User from '../models/User.js';
import Division from '../models/Division.js';
import Ou from '../models/Ou.js';
import checkRole from '../verifyToken/checkRole.js';  // Import the checkRole middleware
import verifyToken from '../verifyToken/verifyToken.js';

const router = express.Router();

// Assign a user to a division and OU (Admin only)
router.post('/assign-user', verifyToken, checkRole('admin'), async (req, res) => {
    const { username, divisionId, ouId } = req.body;

    // Check for required fields
    if (!username || !divisionId || !ouId) {
        return res.status(400).json({ message: 'Username, Division ID, and OU ID are required.' });
    }

    try {
        // Find the user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Validate the division
        const division = await Division.findById(divisionId);
        if (!division) {
            return res.status(400).json({ message: 'Invalid Division ID.' });
        }

        // Validate the OU
        const ou = await Ou.findById(ouId);
        if (!ou) {
            return res.status(400).json({ message: 'Invalid OU ID.' });
        }

        // Assign division and OU to user
        user.division = divisionId;
        user.ou = ouId;
        await user.save();

        res.status(200).json({ message: 'User assigned successfully.', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Change a user's role (Admin only)
router.put('/change-role', verifyToken, checkRole('admin'), async (req, res) => {
    const { username, newRole } = req.body;

    // Check for required fields
    if (!username || !newRole) {
        return res.status(400).json({ message: 'Username and newRole are required.' });
    }

    // Valid role
    const validRoles = ['admin', 'management', 'normal'];
    if (!validRoles.includes(newRole)) {
        return res.status(400).json({ message: 'Invalid role. Valid roles are admin, management, and normal.' });
    }

    try {
        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Update the role
        user.role = newRole;
        await user.save();

        res.status(200).json({
            message: `User role updated successfully to ${newRole}.`,
            user: {
                username: user.username,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Route to get all divisions (Available to all authenticated users)
router.get('/divisions', async (req, res) => {
    try {
        const divisions = await Division.find(); 
        res.status(200).json({ divisions });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching divisions', error });
    }
});

// Endpoint to get all OUs from the database (Available to all authenticated users)
router.get('/ou-list', async (req, res) => {
    try {
        const ous = await Ou.find(); // Assuming 'Ou' is your model for OUs
        res.status(200).json({ ous });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching OUs', error });
    }
});

// Endpoint to create a new Division (Admin only)
router.post('/create-division', verifyToken, checkRole('admin'), async (req, res) => {
    const { divisionName, ou, description } = req.body;
    
    if (!divisionName || !description) {
        return res.status(400).json({ message: 'Division name and description are required.' });
    }
    
    try {
        // Check if Ou exists in the database before proceeding
        const existingOu = await Ou.findById(ou); // Find the 'OU' by ID from the database
        if (!existingOu) {
            return res.status(400).json({ message: 'Invalid OU ID provided.' });
        }

        // Create the new Division, passing the 'ou' ID
        const newDivision = new Division({
            name: divisionName,
            ou: ou,
            description: description,
        });

        await newDivision.save();
        res.status(201).json({ message: 'Division created successfully.', division: newDivision });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Endpoint to create a new Organizational Unit (OU) (Admin only)
router.post('/create-ou', verifyToken, checkRole('admin'), async (req, res) => {
    const { ouName, divisionId } = req.body;

    if (!ouName || !divisionId) {
        return res.status(400).json({ message: 'OU name and Division ID are required.' });
    }

    try {
        // Check if division exists
        const division = await Division.findById(divisionId);
        if (!division) {
            return res.status(404).json({ message: 'Division not found.' });
        }

        const newOu = new Ou({
            name: ouName,
            division: divisionId, // Assign the OU to a specific division
        });

        await newOu.save();
        res.status(201).json({ message: 'Organizational Unit created successfully.', ou: newOu });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Export router to be used in other parts of the app
export default router;
