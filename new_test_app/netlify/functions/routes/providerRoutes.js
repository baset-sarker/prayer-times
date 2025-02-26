import express from 'express';
import {Provider} from '../models/provider.js';
import {authenticateJWT} from '../middleware/auth.js';
import dotenv from 'dotenv'; // Load environment variables from .env file
dotenv.config(); // Load environment variables from .env file

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key'; // Replace with a strong secret key
router = express.Router();


function obfuscatePassword(password) {
  const encodedPassword = Buffer.from(password).toString('base64');
  return encodedPassword;
}


function standardizeApostrophes(text) {
  if (typeof text === 'string') {
    return text.replace(/[’‘]/g, "'");
  }
  return text;
}

// Provider Routes (Protected)
router.get('/',authenticateJWT, async (req, res) => {
  try {
    const providers = await Provider.find({})
    res.json(providers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authenticateJWT, async (req, res) => {
  try {

    let { name, password } = req.body;
    name = standardizeApostrophes(name);
    const password_encrypted = obfuscatePassword(password);
    const newProvider = new Provider({ name, password, password_encrypted }); // Associate with user

    await newProvider.save();
    res.status(201).json(newProvider); // 201 Created
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.put('/:id', authenticateJWT, async (req, res) => {  
  try {

      let { name, password } = req.body;
      name = standardizeApostrophes(name);
      const password_encrypted = obfuscatePassword(password);

      const updatedProvider = await Provider.findByIdAndUpdate(
        req.params.id,
        { name, password, password_encrypted },
        { new: true }
      );
      res.send(updatedProvider)
  } catch (error) {
    console.error("Error updating provider:", error);
    res.status(500).send({ error: "Failed to update provider" });
  }
});

router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const deletedProvider = await Provider.findByIdAndDelete(req.params.id);
    if (!deletedProvider) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    res.status(204).end(); // 204 No Content
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', authenticateJWT, async (req, res) => {
    try {
      const provider = await Provider.findById(req.params.id)
    
      if (!provider) {
        return res.status(404).json({ message: 'Provider not found' });
      }
      // change somve value to int 
      // provider.fajr = "12:00";
      res.json(provider);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

export const providerRouter=router;

