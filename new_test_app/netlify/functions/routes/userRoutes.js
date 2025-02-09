// routes/user.js
const express = require('express');
const router = express.Router();
// const { User } = require('../models/user'); // Import your User model
import User from '../models/user.js';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables from .env file
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key'; // Replace with a strong secret key

// API route
router.get("/test", (req, res) => {
    res.json({ message: "Hello from Express on Netlify!" });
});
  

// User Routes
router.post('/register', async (req, res) => { // No /api/auth prefix here, it's handled in server.js
    try {
        const { username, password } = req.body;
        const newUser = new User({ username, password });
        await newUser.save();
        res.json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    console.log('login',req.body)
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, SECRET_KEY); // Generate JWT
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const userRouter = router;

export default userRouter;