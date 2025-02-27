import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    jwt: { type: String, required: true },  
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export const SessionModel = mongoose.model('sessions', sessionSchema);