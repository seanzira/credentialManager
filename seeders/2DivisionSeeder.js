import mongoose from 'mongoose';
import Division from '../models/Division.js';
import Ou from '../models/Ou.js';

// Sample data to be inserted into the Division collection
const sampleDivisions = [
    {
        name: 'IT',
        ouName: 'Corporate', 
        description: 'Information Technology Division',
    },
    {
        name: 'Marketing',
        ouName: 'Corporate',
        description: 'Marketing Division',
    },
    {
        name: 'HR',
        ouName: 'Human Resources',
        description: 'Human Resources Division',
    },
    {
        name: 'Sales',
        ouName: 'Regional', 
        description: 'Sales Division',
    },
    {
        name: 'Finance',
        ouName: 'Corporate', 
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

// Function to insert the data into the Division collection
const seedDB = async () => {
    try {
        // Loop through each division and find the corresponding OU by its name
        for (const divisionData of sampleDivisions) {
            // Check if the division already exists
            const existingDivision = await Division.findOne({ name: divisionData.name });
            if (existingDivision) {
                console.log(`Division "${divisionData.name}" already exists. Skipping insertion.`);
                continue;  
            }

            // Find the OU by name
            const ou = await Ou.findOne({ name: divisionData.ouName });

            if (!ou) {
                console.log(`Error: OU "${divisionData.ouName}" not found. Skipping division "${divisionData.name}".`);
                continue; 
            }

            // Create the Division document with the corresponding OU reference
            const division = new Division({
                name: divisionData.name,
                ou: ou._id, 
                description: divisionData.description,
            });

            // Save the division
            await division.save();
            console.log(`Division "${divisionData.name}" created under OU "${divisionData.ouName}"`);
        }
    } catch (error) {
        console.error('Error inserting divisions:', error);
    }
};

// Function to run the seeder
const runSeeder = async () => {
    await connectDB();
    await seedDB();
    mongoose.connection.close();
};

// Run the seeder
runSeeder();
