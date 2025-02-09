const express = require("express");
const serverless = require("serverless-http");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); // For JWT authentication
const bcrypt = require('bcrypt'); // For password hashing
const cors = require('cors'); // Enable Cross-Origin Resource Sharing

require('dotenv').config(); // Load environment variables from .env file

const app = express();

// API route
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Express on Netlify!" });
});


//const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key'; // Replace with a strong secret key
const MONGODB_URI = process.env.MONGODB_URI ; // Replace with your MongoDB URI


app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Essential for parsing JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // For form data (if needed)

// MongoDB Connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.error('MongoDB Connection Error:', err));

// Prayer Schema
const prayerSchema = new mongoose.Schema({
  fajr: String,
  fajr_added_time: Number,
  duhr: String,
  duhr_added_time: Number,
  asr: String,
  asr_added_time: Number,
  magrib: String,
  magrib_added_time: Number,
  isha: String,
  isha_added_time: Number,
  hadis1: String,
  hadis2: String,
  hadis3: String,
  hadis4: String,
  hadis5: String,
  notice_head_line: String,
  notice_first_line: String,
  notice_second_line: String,
  // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Associate prayer with user
});

const Prayer = mongoose.model('Prayer', prayerSchema);

// User Schema
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

const User = mongoose.model('User', userSchema);


// Authentication Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('username',req.body)  
    const newUser = new User({ username, password });
    await newUser.save();
    res.json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, SECRET_KEY); // Generate JWT
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware for JWT authentication
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Bearer <token>

    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Invalid token
      }

      req.user = user; // Add user info to request
      next();
    });
  } else {
    res.sendStatus(401); // No token provided
  }
};


// Prayer Routes (Protected)
app.get('/api/prayer', async (req, res) => {
  try {
    //const prayers = await Prayer.find({ user: req.user.userId }); // Get prayers for logged-in user
    const prayers = await Prayer.find({})
    res.json(prayers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/prayer', authenticateJWT, async (req, res) => {
  try {
    const newPrayer = new Prayer({ ...req.body, user: req.user.userId }); // Associate with user
    await newPrayer.save();
    res.status(201).json(newPrayer); // 201 Created
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/prayer/:id', authenticateJWT, async (req, res) => {
  try {
    const updatedPrayer = await Prayer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPrayer) {
      return res.status(404).json({ message: 'Prayer not found' });
    }
    res.json(updatedPrayer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// app.delete('/api/prayer/:id', authenticateJWT, async (req, res) => {
//   try {
//     const deletedPrayer = await Prayer.findByIdAndDelete(req.params.id);
//     if (!deletedPrayer) {
//       return res.status(404).json({ message: 'Prayer not found' });
//     }
//     res.status(204).end(); // 204 No Content
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

app.get('/api/prayer/:id', authenticateJWT, async (req, res) => {
    try {
      //const prayer = await Prayer.findById(req.params.id)
      const prayer = await Prayer.findById("67a6a7f3910f6b920a5d4254");
    
      if (!prayer) {
        return res.status(404).json({ message: 'Prayer not found' });
      }
      // change somve value to int 
      // prayer.fajr = "12:00";
      res.json(prayer);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });




module.exports.handler = serverless(app);
