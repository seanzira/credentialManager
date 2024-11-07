import mongoose from "mongoose";

// Schema for the Division model
const DivisionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, minlength: 1 },
  ou: { type: mongoose.Schema.Types.ObjectId, ref: 'Ou', required: true },
  description: { type: String },
}, { timestamps: true}
);

// Export Division model
const Division = mongoose.model('Division', DivisionSchema);
export default Division;