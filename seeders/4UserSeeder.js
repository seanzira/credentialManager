import mongoose from 'mongoose';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

// Sample data to be inserted into the collection
const sampleUsers = [
    {
        username: 'admin_user',
        password: 'adminPassword123',
        role: 'admin',
        ou: '672c9a523d84e69021b1706b', 
        divisions: ['672c9a53329391a0e27ebe54'], // Array of divisions
        divisionPasswords: [
            { division: '672c9a53329391a0e27ebe54', password: 'adminPassword123' }
        ]
    },
    {
        username: 'management_user',
        password: 'managementPassword456',
        role: 'management',
        ou: '672c9a523d84e69021b1706c', 
        divisions: ['672c9a53329391a0e27ebe55'],
        divisionPasswords: [
            { division: '672c9a53329391a0e27ebe55', password: 'managementPassword456' }
        ]
    },
    {
        username: 'normal_user1',
        password: 'userPassword789',
        role: 'normal',
        ou: '672c9a523d84e69021b1706d', 
        divisions: ['672c9a53329391a0e27ebe56'],
        divisionPasswords: [
            { division: '672c9a53329391a0e27ebe56', password: 'userPassword789' }
        ]
    },
    {
        username: 'normal_user2',
        password: 'userPassword101',
        role: 'normal',
        ou: '672c9a523d84e69021b1706e', 
        divisions: ['672c9a53329391a0e27ebe57'],
        divisionPasswords: [
            { division: '672c9a53329391a0e27ebe57', password: 'userPassword101' }
        ]
    },
    {
        username: 'normal_user3',
        password: 'userPassword2023',
        role: 'normal',
        ou: '672c9a523d84e69021b1706f', 
        divisions: ['672c9a53329391a0e27ebe58'],
        divisionPasswords: [
            { division: '672c9a53329391a0e27ebe58', password: 'userPassword2023' }
        ]
    },
    {
        username: 'seanzira',
        password: 'seanzira22!',
        role: 'admin',
        ou: '672c9a523d84e69021b1706f', 
        divisions: ['672c9a53329391a0e27ebe58'],
        divisionPasswords: [
            { division: '672c9a53329391a0e27ebe58', password: 'seanzira22!' }
        ]
    },
];

// Establishing a connection with the MongoDB database
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/managing-credentials', {
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
