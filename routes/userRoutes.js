import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; 
import Ou from '../models/Ou.js';
import Division from '../models/Division.js';
import verifyToken from '../verifyToken/verifyToken.js';
import checkRole from '../verifyToken/checkRole.js';

const router = express.Router();

// Register endpoint
router.post('/register', async (req, res) => {
    const { username, password, ou, division } = req.body;

    // Validate input
    if (!username || !password || !ou || !division) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if the username is already taken
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        // Check if the OU and division are valid
        const organizationalUnit = await Ou.findById(ou); // Check if OU exists
        const divisionRecord = await Division.findById(division); // Check if Division exists

        if (!organizationalUnit) {
            return res.status(400).json({ message: 'Invalid Organizational Unit (OU)' });
        }
        if (!divisionRecord) {
            return res.status(400).json({ message: 'Invalid Division' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            password: hashedPassword,
            ou: organizationalUnit._id,  
            divisions: [divisionRecord._id],  
            role: 'normal',  
        });

        // Save the new user
        await newUser.save();

        // Create a JWT token
        const token = jwt.sign(
            { 
                id: newUser._id, 
                role: newUser.role, 
                ou: newUser.ou, 
                divisions: newUser.divisions, 
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        // Respond with the token and user data
        res.status(201).json({
            message: 'Registration successful!',
            token,
            user: {
                username: newUser.username,
                role: newUser.role,
                ou: newUser.ou,
                divisions: newUser.divisions,  
            }
        });

    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
});

router.post('/add-credentials', verifyToken, checkRole('normal', 'management', 'admin'), async (req, res) => {
    const { username, password, service, division, ou } = req.body;
  
    // Validation
    if (!username || !password || !service || !division || !ou) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    try {
      // Find the user by ID
      const user = await User.findById(req.user.id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Find the division and OU
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
  
      // Create the new credential and associate with division and OU
      const newCredential = new Credential({
        username,
        password: hashedPassword,
        service,
        division: userDivision._id,
        ou: userOu._id,
      });
  
      await newCredential.save();
  
      // Add the new credential to the division's credentials array
      userDivision.credentials.push(newCredential._id);
      await userDivision.save();
  
      // Add the credential to the OU's credentials array
      userOu.credentials.push(newCredential._id);
      await userOu.save();
  
      res.status(201).json({ message: 'Credential added successfully', credential: newCredential });
  
    } catch (error) {
      console.error('Error during credential addition:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });


// Login endpoint
router.post('/login', async (req, res) => {
    const { username, password, divisionId } = req.body;  

    try {
        // Find the user by username and populate divisions and OU
        const user = await User.findOne({ username }).populate('ou divisions'); 

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if the user is part of the requested division 
        if (divisionId && !user.divisions.some(division => division._id.toString() === divisionId)) {
            return res.status(401).json({ message: 'User is not part of this division' });
        }

        // Check if the user has a password set for the division
        if (divisionId) {
            const divisionPassword = user.divisionPasswords.find(dp => dp.division.toString() === divisionId);
            if (divisionPassword) {
                // If there's a division-specific password, check if the provided password matches
                const isMatch = await bcrypt.compare(password, divisionPassword.password);
                if (!isMatch) {
                    return res.status(401).json({ message: 'Invalid password for this division' });
                }
            } else {
                return res.status(401).json({ message: 'No password set for this division' });
            }
        } else {
            // If no divisionId is provided, authenticate based on the main user password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        }

        // Create a JWT token
        const token = jwt.sign(
            { 
                id: user._id, 
                role: user.role, 
                ou: user.ou, 
                divisions: user.divisions, 
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        // Respond with the token and user data
        res.json({
            token,
            user: {
                username: user.username,
                role: user.role,
                ou: user.ou,
                divisions: user.divisions,  
            }
        });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
});

// export the app to be used in other parts of this code
export default router;
