import mongoose from 'mongoose';

const credentialSchema = new mongoose.Schema({
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

const Credential = mongoose.model('Credential', credentialSchema);
export default Credential;
