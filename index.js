import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js'; 
import userAssignmentRoutes from './routes/UserAssignmentRoutes.js';
import CredentialRoutes from './routes/CredentialRoutes.js'; 

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : true }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));

// Use routes
app.use('/api/user', userRoutes);
app.use('/api/credentials', CredentialRoutes);
app.use('/api/user-assignment', userAssignmentRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
