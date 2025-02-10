import mongoose from 'mongoose';

const providerSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    password_encrypted: { type: String, required: false },
  });
  
export const Provider = mongoose.model('Provider', providerSchema);