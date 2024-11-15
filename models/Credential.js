import mongoose from 'mongoose';

// Schema for Credential model
const CredentialSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  service: { type: String, required: true },
  division: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Division',
    required: true,
  },
  ou: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ou',
    required: true,
  },
});

// export Credential model to be used in other parts of the app
const Credential = mongoose.model('Credential', CredentialSchema);
export default Credential;
