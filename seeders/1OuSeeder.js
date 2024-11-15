import mongoose from 'mongoose';
import Ou from '../models/Ou.js';
import dotenv from 'dotenv'; // Import dotenv

// Load environment variables from .env file
dotenv.config();

// Sample data to be inserted into the collection
const sampleOUs = [
    {
        name: 'News management',
        description: 'Unit responsible for managing news content and editorial processes.',
    },
    {
        name: 'Software reviews',
        description: 'Unit dedicated to reviewing and testing software products.',
    },
    {
        name: 'Hardware reviews',
        description: 'Unit responsible for reviewing and testing hardware products.',
    },
    {
        name: 'Opinion publishing',
        description: 'Unit focused on publishing opinions, editorials, and reviews.',
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
        // Clear existing data
        await Ou.deleteMany(); // Make sure to clear the existing OUs before inserting the new ones
        const insertedData = await Ou.insertMany(sampleOUs); // Insert the updated sample data
        console.log('Sample data inserted:', insertedData);
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
