import mongoose from 'mongoose';

// Schema for the OU model
const OUSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
}, { timestamps: true });

// Export OU model to be used in other parts of the application
export default mongoose.model('Ou', OUSchema);
