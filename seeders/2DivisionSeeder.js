import mongoose from 'mongoose';
import Division from '../models/Division.js';
import Ou from '../models/Ou.js';
import dotenv from 'dotenv'; // Import dotenv

// Load environment variables from .env file
dotenv.config();

// Sample data to be inserted into the Division collection
const sampleDivisions = [
    {
        name: 'IT',
        ouName: 'News management',
        description: 'Information Technology Division for News Management',
    },
    {
        name: 'Editorial',
        ouName: 'News management',
        description: 'Editorial Division focusing on content creation and editing',
    },
    {
        name: 'Publishing',
        ouName: 'News management',
        description: 'Publishing Division for releasing content to the public',
    },
    {
        name: 'SEO',
        ouName: 'News management',
        description: 'SEO Division working on optimizing content visibility',
    },
    {
        name: 'Community Management',
        ouName: 'News management',
        description: 'Community Management Division engaging with readers',
    },

    {
        name: 'Software QA',
        ouName: 'Software reviews',
        description: 'Software Quality Assurance Division for testing software',
    },
    {
        name: 'Review Team',
        ouName: 'Software reviews',
        description: 'Software Review Division for in-depth software analysis',
    },
    {
        name: 'Technical Analysis',
        ouName: 'Software reviews',
        description: 'Technical Analysis Division focusing on software performance metrics',
    },
    {
        name: 'UI/UX',
        ouName: 'Software reviews',
        description: 'User Interface and User Experience Division reviewing software design',
    },
    {
        name: 'Marketing',
        ouName: 'Software reviews',
        description: 'Marketing Division responsible for promoting reviewed software',
    },

    {
        name: 'Hardware Testing',
        ouName: 'Hardware reviews',
        description: 'Hardware Testing Division for testing various hardware products',
    },
    {
        name: 'Unboxing',
        ouName: 'Hardware reviews',
        description: 'Unboxing Division for detailed hardware reviews and analysis',
    },
    {
        name: 'Accessories',
        ouName: 'Hardware reviews',
        description: 'Accessories Division focusing on reviews of hardware accessories',
    },
    {
        name: 'Comparison',
        ouName: 'Hardware reviews',
        description: 'Comparison Division comparing hardware products',
    },
    {
        name: 'Benchmarking',
        ouName: 'Hardware reviews',
        description: 'Benchmarking Division focused on testing and comparing hardware performance',
    },

    {
        name: 'Content Strategy',
        ouName: 'Opinion publishing',
        description: 'Strategy Division for planning opinion content direction',
    },
    {
        name: 'Columnists',
        ouName: 'Opinion publishing',
        description: 'Columnist Division writing opinion pieces',
    },
    {
        name: 'Guest Writers',
        ouName: 'Opinion publishing',
        description: 'Guest Writers Division for publishing guest op-eds',
    },
    {
        name: 'Social Media',
        ouName: 'Opinion publishing',
        description: 'Social Media Division for promoting opinion content',
    },
    {
        name: 'Editorial Board',
        ouName: 'Opinion publishing',
        description: 'Editorial Board Division overseeing the quality of opinion pieces',
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
                ou: ou._id,  // Ensure division is associated with its respective OU
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
