// change seeder to import ""
import mongoose from 'mongoose';
import Credential from '../models/Credential.js';
import Division from '../models/Division.js';
import bcrypt from 'bcryptjs';

// Sample data to be inserted into the Credential collection
const sampleCredentials = [
    { username: 'john_doe', password: 'password123', service: 'Email' },
    { username: 'jane_smith', password: 'secure456', service: 'Cloud Storage' },
    { username: 'alice_jones', password: 'myPassword789', service: 'Project Management' },
    { username: 'bob_brown', password: 'password101', service: 'Internal Chat' },
    { username: 'charlie_white', password: 'topSecret2023', service: 'Finance' },
    { username: 'seanzira', password: 'seanzira22!', service: 'Finance' },
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

// Function to insert the data into the collections
const seedDB = async () => {
    try {
        await Credential.deleteMany();

        // Fetch divisions to get their ObjectIds
        const divisions = await Division.find();
        const divisionIds = divisions.map(division => division._id);

       // Hash passwords and map credentials to include division ObjectIds
       const credentialsWithDivisions = await Promise.all(sampleCredentials.map(async (credential, index) => {
        const hashedPassword = await bcrypt.hash(credential.password, 10); 
        return {
            username: credential.username,
            password: hashedPassword, 
            service: credential.service,
            division: divisionIds[index % divisionIds.length], 
        };
    }));

        const insertedData = await Credential.insertMany(credentialsWithDivisions);
        console.log('Sample credentials inserted:', insertedData);
    } catch (error) {
        console.error('Error inserting credentials:', error);
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
