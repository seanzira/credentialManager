import mongoose from 'mongoose';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv'; // Import dotenv

// Load environment variables from .env file
dotenv.config();

// Sample data to be inserted into the collection
const sampleUsers = [
    {
        username: 'admin_user',
        password: 'adminPassword123',
        role: 'admin',
        ou: '6736f7871c116aace7d0dddb', 
        divisions: ['6731a9a5e64a2811b2e4245f'], 
        divisionPasswords: [
            { division: '6731a9a5e64a2811b2e4245f', password: 'adminPassword123' }
        ]
    },
    {
        username: 'management_user',
        password: 'managementPassword456',
        role: 'management',
        ou: '6736f7871c116aace7d0dddb', 
        divisions: ['6731a9a5e64a2811b2e42461'],
        divisionPasswords: [
            { division: '6731a9a5e64a2811b2e42461', password: 'managementPassword456' }
        ]
    },
    {
        username: 'normal_user1',
        password: 'userPassword789',
        role: 'normal',
        ou: '6736f7871c116aace7d0ddde', 
        divisions: ['6731a9a5e64a2811b2e42462'],
        divisionPasswords: [
            { division: '6731a9a5e64a2811b2e42462', password: 'userPassword789' }
        ]
    },
    {
        username: 'normal_user2',
        password: 'userPassword101',
        role: 'normal',
        ou: '6736f7871c116aace7d0dddd', 
        divisions: ['6731a9a5e64a2811b2e42463'],
        divisionPasswords: [
            { division: '6731a9a5e64a2811b2e42463', password: 'userPassword101' }
        ]
    },
    {
        username: 'normal_user3',
        password: 'userPassword2023',
        role: 'normal',
        ou: '6736f7871c116aace7d0dddc', 
        divisions: ['6734ac8e40394c383ffb57ee'],
        divisionPasswords: [
            { division: '6734ac8e40394c383ffb57ee', password: 'userPassword2023' }
        ]
    },
    {
        username: 'seanzira',
        password: 'seanzira22!',
        role: 'admin',
        ou: '6736f7871c116aace7d0dddb', 
        divisions: ['6736f788f16058dadee74a49'],
        divisionPasswords: [
            { division: '6736f788f16058dadee74a49', password: 'seanzira22!' }
        ]
    },
];

// Establishing a connection with the MongoDB database
const connectDB = async () => {
    try {
        // Use the MONGODB_URI environment variable from the .env file
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in the .env file');
        }

        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Function to insert the data into the collection
const seedDB = async () => {
    try {
        // Clear existing users
        await User.deleteMany();

        // Hash passwords and prepare data for insertion
        const usersWithHashedPasswords = await Promise.all(
            sampleUsers.map(async (user) => {
                // Hash the password
                const hashedPassword = await bcrypt.hash(user.password, 10);

                // Return user data with the hashed password
                return {
                    ...user,
                    password: hashedPassword, // Add the hashed password to the user object
                };
            })
        );

        // Insert the users into the collection
        const insertedData = await User.insertMany(usersWithHashedPasswords);
        console.log('Sample users inserted:', insertedData);
    } catch (error) {
        console.error('Error inserting data:', error);
    } finally {
        mongoose.connection.close();
    }
};

// Function to run the seeder
const runSeeder = async () => {
    await connectDB();
    await seedDB();
};

// Calling the function to run the seeder
runSeeder();
