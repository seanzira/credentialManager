import mongoose from 'mongoose';
import Ou from '../models/Ou.js';

// Sample data to be inserted into the collection
const sampleOUs = [
    {
        name: 'Corporate',
        description: 'Corporate office for company operations',
    },
    {
        name: 'Regional',
        description: 'Regional offices managing local operations',
    },
    {
        name: 'Research and Development',
        description: 'Department focused on innovation and development',
    },
    {
        name: 'Customer Support',
        description: 'Team dedicated to assisting customers and resolving issues',
    },
    {
        name: 'Human Resources',
        description: 'Department handling employee relations and benefits',
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
        // Clear existing data
        await Ou.deleteMany();
        const insertedData = await Ou.insertMany(sampleOUs);
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
