import express from 'express';
import bcrypt from 'bcryptjs';
import Credential from '../models/Credential.js';
import User from '../models/User.js';       
import Division from '../models/Division.js';  
import verifyToken from '../verifyToken/verifyToken.js';
import checkRole from '../verifyToken/checkRole.js'; // Role checking middleware

const router = express.Router();

// Endpoint to fetch list of divisions
router.get('/division-list', async (req, res) => {
    try {
        const divisions = await Division.find({});
        res.json({ divisions });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching divisions' });
    }
});

// View credentials for the logged-in user's division (Normal, Management, Admin)
router.get('/division', verifyToken, async (req, res) => {
    const userId = req.user.id; // User ID is extracted from the token

    try {
        // Find the user by ID
        const user = await User.findById(userId).select('division');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user has a division linked
        if (!user.division) {
            return res.status(404).json({ message: 'No division linked to this user' });
        }

        // Retrieve the division details from the Division model
        const division = await Division.findById(user.division);

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

// Endpoint for adding a credential (Normal, Management, Admin)
router.post('/add-credentials', verifyToken, async (req, res) => {
    const { username, password, service } = req.body;

    if (!username || !password || !service) {
        return res.status(400).json({ msg: 'All fields are required' });
    }

    try {
        const user = await User.findById(req.user.id).populate('division');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const division = user.division;
        if (!division) {
            return res.status(404).json({ message: 'No division linked to the user' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newCredential = new Credential({
            username,
            password: hashedPassword,
            service,
            division: division._id,
        });

        await newCredential.save();

        res.status(201).json({ message: 'Credential added successfully', credential: newCredential });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Management and Admin users can update credentials
router.put('/update-credential/:id', verifyToken, checkRole('management'), async (req, res) => {
    const { username, password, service } = req.body;

    try {
        const credential = await Credential.findById(req.params.id);
        if (!credential) {
            return res.status(404).json({ message: 'Credential not found' });
        }

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

export default router;
