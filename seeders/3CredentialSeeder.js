import mongoose from 'mongoose';
import Credential from '../models/Credential.js';
import Division from '../models/Division.js';
import Ou from '../models/Ou.js';
import bcrypt from 'bcryptjs';

import dotenv from 'dotenv'; // Import dotenv

// Load environment variables from .env file
dotenv.config();

// Sample data to be inserted into the Credential collection (total 45 credentials)
const sampleCredentials = [
    { username: 'john_doe', password: 'password123', service: 'Email' },
    { username: 'jane_smith', password: 'secure456', service: 'Cloud Storage' },
    { username: 'alice_jones', password: 'myPassword789', service: 'Project Management' },
    { username: 'bob_brown', password: 'password101', service: 'Internal Chat' },
    { username: 'charlie_white', password: 'topSecret2023', service: 'Finance' },
    { username: 'seanzira', password: 'seanzira22!', service: 'Finance' },
    { username: 'mike_taylor', password: 'secure987', service: 'Accounting' },
    { username: 'emily_clark', password: 'cloudAdmin321', service: 'Cloud Storage' },
    { username: 'david_lee', password: 'testPass2024', service: 'Project Management' },
    { username: 'olivia_kim', password: 'digitalMedia123', service: 'Digital Media' },
    { username: 'lucas_wang', password: 'analytics2023', service: 'Data Analytics' },
    { username: 'maria_smith', password: 'editorial2023', service: 'Editorial' },
    { username: 'robert_brown', password: 'br0wnP@ssword!', service: 'Email' },
    { username: 'nancy_davis', password: 'myN@ncy123', service: 'Cloud Storage' },
    { username: 'joseph_martin', password: 'josephM@rt2023', service: 'Project Management' },
    { username: 'susan_thompson', password: 'Th0mps0n!Secure', service: 'Internal Chat' },
    { username: 'andrew_moore', password: 'Mo0reS3curity', service: 'Finance' },
    { username: 'sarah_lee', password: 'S@rahLee456', service: 'Finance' },
    { username: 'patrick_johnson', password: 'P@trick2024', service: 'Accounting' },
    { username: 'lucy_hernandez', password: 'L#cy@Hern@', service: 'Cloud Storage' },
    { username: 'george_white', password: 'G3orgeW!te2023', service: 'Project Management' },
    { username: 'paul_jackson', password: 'p@ul_J@cks0n', service: 'Internal Chat' },
    { username: 'jackie_jones', password: 'J@ckie_Jone$23', service: 'Finance' },
    { username: 'henry_scott', password: 'Henry_Sc0tt#21', service: 'Finance' },
    { username: 'ella_king', password: '3lla_K1ng22!', service: 'Accounting' },
    { username: 'michael_brown', password: 'M1ch@elBr0wn01', service: 'Cloud Storage' },
    { username: 'chris_smith', password: 'Chr!s_Sm1th!22', service: 'Project Management' },
    { username: 'megan_johnson', password: 'MeganJ0hnson@22', service: 'Internal Chat' },
    { username: 'jason_williams', password: 'J@sonW!ll@ms2024', service: 'Finance' },
    { username: 'diana_morris', password: 'D1@naM0rris!!', service: 'Finance' },
    { username: 'jack_russell', password: 'J@ckRuss3ll#01', service: 'Accounting' },
    { username: 'laura_martin', password: 'LauraM@rtin02', service: 'Cloud Storage' },
    { username: 'samuel_white', password: 'S@muelW!te#2024', service: 'Project Management' },
    { username: 'mia_clark', password: 'M1@_Cl@rk!23', service: 'Internal Chat' },
    { username: 'matthew_williams', password: 'M@th3wW!ll!am22', service: 'Finance' },
    { username: 'rachel_jones', password: 'R@chelJ0nes22', service: 'Finance' },
    { username: 'patrick_evans', password: 'P@trickEv@ns2024', service: 'Accounting' },
    { username: 'jessica_anderson', password: 'J3ssic@_And3rs0n', service: 'Cloud Storage' },
    { username: 'elizabeth_smith', password: 'Eliz@bethSm1th!', service: 'Project Management' },
    { username: 'daniel_lee', password: 'D@ni3l_L33#2024', service: 'Internal Chat' },
    { username: 'benjamin_wilson', password: 'BenW!lson#2024', service: 'Finance' },
    { username: 'victoria_davis', password: 'V1ct0ri@_D@vis', service: 'Finance' },
    { username: 'natalie_scott', password: 'N@t@l!eS!c0tt', service: 'Accounting' },
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
