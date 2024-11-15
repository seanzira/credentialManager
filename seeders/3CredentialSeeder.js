import mongoose from 'mongoose';
import Credential from '../models/Credential.js';
import Division from '../models/Division.js';
import Ou from '../models/Ou.js';  
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
        await Credential.deleteMany();  // Clear existing credentials
        await Division.updateMany({}, { $set: { credentials: [] } });  // Clear existing credentials in divisions

        // Fetch divisions and OUs to get their ObjectIds
        const divisions = await Division.find();
        const ous = await Ou.find();

        // Hash passwords and map credentials to include division and OU ObjectIds
        const credentialsWithDivisionsAndOUs = await Promise.all(sampleCredentials.map(async (credential, index) => {
            const hashedPassword = await bcrypt.hash(credential.password, 10); 
            
            // Get division and OU for each credential
            const division = divisions[index % divisions.length];  
            const ou = ous[index % ous.length];  

            return {
                username: credential.username,
                password: hashedPassword,
                service: credential.service,
                division: division._id, 
                ou: ou._id,  
            };
        }));

        // Insert credentials into the database
        const insertedCredentials = await Credential.insertMany(credentialsWithDivisionsAndOUs);
        console.log('Sample credentials inserted:', insertedCredentials);

        // Updating divisions with the inserted credential references
        for (let i = 0; i < insertedCredentials.length; i++) {
            const credential = insertedCredentials[i];
            const division = divisions[i % divisions.length];  
            division.credentials.push(credential._id);  
            await division.save();  // Save the updated division
        }

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
