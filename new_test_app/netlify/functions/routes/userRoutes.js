// routes/user.js
const express = require('express');
const router = express.Router();
// const { User } = require('../models/user'); // Import your User model
import {User} from '../models/user.js';
import { authenticateJWT } from '../middleware/auth.js';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables from .env file
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key'; // Replace with a strong secret key
import {SessionModel} from '../models/session.js';


// User Routes
router.post('/register', authenticateJWT, async (req, res) => { // No /api/auth prefix here, it's handled in server.js
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
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // const token = jwt.sign({ userId: user._id }, SECRET_KEY); // Generate JWT
    // expare 7 days
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '7d' }); // Generate JWT

    // insert in Session
    const session = new SessionModel({ jwt: token, user_id: user._id });
    await session.save();

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Get all users
router.get('/',authenticateJWT, async (req, res) => {
  try {
     // want to exclude password field
    const users = await User.find({}, { password: 0 }) 
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




export const userRouter = router;