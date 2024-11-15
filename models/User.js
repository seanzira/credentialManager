import mongoose from 'mongoose';

// Schema for a User model
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'management', 'normal'], default: 'normal' },
    ou: { type: mongoose.Schema.Types.ObjectId, ref: 'Ou' }, 
    divisions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Division' }],
    divisionPasswords: [
        {
            division: { type: mongoose.Schema.Types.ObjectId, ref: 'Division', required: true },
            password: { type: String, required: true }
        }
    ]
});

// Export the User model to be used in other parts of the application
export default mongoose.model('User', UserSchema);