import mongoose from 'mongoose';

// Schema for an OU model
const OUSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
});

// Export OU model to be used in other parts of the application
export default mongoose.model('Ou', OUSchema);