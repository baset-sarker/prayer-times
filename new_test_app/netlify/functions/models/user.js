// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      return next(err);
    }
  });

// const User = mongoose.model('User', userSchema);


// export default mongoose.model('User', userSchema);
// export default mongoose.model('User', userSchema);
export const User = mongoose.model('User', userSchema);

// module.exports = { User }; // Export the User model
// export default User; // Export the User model