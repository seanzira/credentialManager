import mongoose from 'mongoose';
import Division from '../models/Division.js';
import Ou from '../models/Ou.js';
import dotenv from 'dotenv'; // Import dotenv

// Load environment variables from .env file
dotenv.config();

// Sample data to be inserted into the Division collection
const sampleDivisions = [
    { name: 'IT', ouName: 'News management', description: 'Information Technology Division for News Management' },
    { name: 'Editorial', ouName: 'News management', description: 'Editorial Division focusing on content creation and editing' },
    { name: 'Publishing', ouName: 'News management', description: 'Publishing Division for releasing content to the public' },
    { name: 'SEO', ouName: 'News management', description: 'SEO Division working on optimizing content visibility' },
    { name: 'Community Management', ouName: 'News management', description: 'Community Management Division engaging with readers' },
    { name: 'Data Analytics', ouName: 'News management', description: 'Data Analytics Division focused on content performance analysis' },
    { name: 'Video Production', ouName: 'News management', description: 'Video Production Division creating multimedia content for news' },
    { name: 'Investigative Reporting', ouName: 'News management', description: 'Investigative Reporting Division for in-depth journalism' },
    { name: 'Live Broadcast', ouName: 'News management', description: 'Live Broadcast Division managing live news coverage and events' },
    { name: 'Content Moderation', ouName: 'News management', description: 'Content Moderation Division ensuring compliance with publishing guidelines' },
    { name: 'Software QA', ouName: 'Software reviews', description: 'Software Quality Assurance Division for testing software' },
    { name: 'Review Team', ouName: 'Software reviews', description: 'Software Review Division for in-depth software analysis' },
    { name: 'Technical Analysis', ouName: 'Software reviews', description: 'Technical Analysis Division focusing on software performance metrics' },
    { name: 'UI/UX', ouName: 'Software reviews', description: 'User Interface and User Experience Division reviewing software design' },
    { name: 'Marketing', ouName: 'Software reviews', description: 'Marketing Division responsible for promoting reviewed software' },
    { name: 'Performance Testing', ouName: 'Software reviews', description: 'Performance Testing Division focused on software stress and load testing' },
    { name: 'Security Audits', ouName: 'Software reviews', description: 'Security Audits Division conducting vulnerability assessments and security testing' },
    { name: 'User Feedback', ouName: 'Software reviews', description: 'User Feedback Division gathering and analyzing user feedback for software improvements' },
    { name: 'Documentation', ouName: 'Software reviews', description: 'Documentation Division focused on creating user guides, manuals, and other software documentation' },
    { name: 'Feature Comparison', ouName: 'Software reviews', description: 'Feature Comparison Division comparing software features and functionalities across different platforms' },
    { name: 'Hardware Testing', ouName: 'Hardware reviews', description: 'Hardware Testing Division for testing various hardware products' },
    { name: 'Unboxing', ouName: 'Hardware reviews', description: 'Unboxing Division for detailed hardware reviews and analysis' },
    { name: 'Accessories', ouName: 'Hardware reviews', description: 'Accessories Division focusing on reviews of hardware accessories' },
    { name: 'Comparison', ouName: 'Hardware reviews', description: 'Comparison Division comparing hardware products' },
    { name: 'Benchmarking', ouName: 'Hardware reviews', description: 'Benchmarking Division focused on testing and comparing hardware performance' },
    { name: 'Durability Testing', ouName: 'Hardware reviews', description: 'Durability Testing Division focused on testing the longevity and wear resistance of hardware products' },
    { name: 'Power Consumption Analysis', ouName: 'Hardware reviews', description: 'Power Consumption Analysis Division measuring the energy efficiency of hardware products' },
    { name: 'Ergonomics', ouName: 'Hardware reviews', description: 'Ergonomics Division focused on evaluating the comfort and user-friendliness of hardware products' },
    { name: 'Modding and Customization', ouName: 'Hardware reviews', description: 'Modding and Customization Division testing and reviewing hardware customization and modification' },
    { name: 'Repairability', ouName: 'Hardware reviews', description: 'Repairability Division focused on the ease of repairing and replacing parts in hardware products' },
    { name: 'Content Strategy', ouName: 'Opinion publishing', description: 'Strategy Division for planning opinion content direction' },
    { name: 'Columnists', ouName: 'Opinion publishing', description: 'Columnist Division writing opinion pieces' },
    { name: 'Guest Writers', ouName: 'Opinion publishing', description: 'Guest Writers Division for publishing guest op-eds' },
    { name: 'Social Media', ouName: 'Opinion publishing', description: 'Social Media Division for promoting opinion content' },
    { name: 'Editorial Board', ouName: 'Opinion publishing', description: 'Editorial Board Division overseeing the quality of opinion pieces' },
    { name: 'Political Analysis', ouName: 'Opinion publishing', description: 'Political Analysis Division providing in-depth commentary on political issues' },
    { name: 'Cultural Critique', ouName: 'Opinion publishing', description: 'Cultural Critique Division offering insights and critiques on cultural topics' },
    { name: 'Global Affairs', ouName: 'Opinion publishing', description: 'Global Affairs Division analyzing international news and global trends' },
    { name: 'Economic Insight', ouName: 'Opinion publishing', description: 'Economic Insight Division offering commentary on economic developments and trends' },
    { name: 'Social Issues', ouName: 'Opinion publishing', description: 'Social Issues Division addressing current social issues and advocating for change' },
];

// Establishing a connection with the MongoDB database
const connectDB = async () => {
    try {
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
        process.exit(1);  // Exit process on error
    }
};

// Function to clear existing divisions and insert the new data
const seedDB = async () => {
    try {
        // Clear all existing divisions
        console.log('Clearing all existing divisions...');
        await Division.deleteMany();  // This clears the entire Division collection
        
        console.log('Inserting new divisions...');
        
        for (const divisionData of sampleDivisions) {
            console.log(`Processing Division: ${divisionData.name}`);
            
            // Find the OU by name
            const ou = await Ou.findOne({ name: divisionData.ouName });

            if (!ou) {
                console.log(`Error: OU "${divisionData.ouName}" not found. Skipping division "${divisionData.name}".`);
                continue; // Skip if OU doesn't exist
            }

            // Create the Division document with the corresponding OU reference
            const division = new Division({
                name: divisionData.name,
                ou: ou._id,  // Reference the correct OU
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
    try {
        // First, connect to the database
        await connectDB();

        // Seed the divisions
        await seedDB();
    } catch (error) {
        console.error('Error running seeder:', error);
    } finally {
        // Close the connection after seeding is complete
        mongoose.connection.close();
    }
};

// Run the seeder
runSeeder();
