import mongoose from 'mongoose';
import Division from '../models/Division.js';

// Sample data to be inserted into the collection
const sampleDivisions = [
    {
        name: 'IT',
        ou: '60d21b4667d0d8992e610c85',
        description: 'Information Technology Division',
    },
    {
        name: 'Marketing',
        ou: '60d21b4667d0d8992e610c86', 
        description: 'Marketing Division',
    },
    {
        name: 'HR',
        ou: '60d21b4667d0d8992e610c87', 
        description: 'Human Resources Division',
    },
    {
        name: 'Sales',
        ou: '60d21b4667d0d8992e610c88',
        description: 'Sales Division',
    },
    {
        name: 'Finance',
        ou: '60d21b4667d0d8992e610c89', 
        description: 'Finance Division',
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
        await Division.deleteMany();
        const insertedData = await Division.insertMany(sampleDivisions);
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
