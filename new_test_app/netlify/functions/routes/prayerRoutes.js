import express from 'express';
import {Prayer} from '../models/prayer.js';
import {Provider} from '../models/provider.js';
import {authenticateJWT} from '../middleware/auth.js';
import { fetchData,convert24to12 } from '../helpers/helper_func.js';
import dotenv from 'dotenv'; // Load environment variables from .env file
dotenv.config(); // Load environment variables from .env file

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key'; // Replace with a strong secret key
router = express.Router();

router.get('/', async (req, res) => {
  try {
    //const prayers = await Prayer.find({ user: req.user.userId }); // Get prayers for logged-in user
    const prayers = await Prayer.find({})
    const api_data = await fetchData();

    let prayer = prayers[0];
    prayer.fajr_api = convert24to12(api_data.data.timings.Fajr)
    prayer.duhr_api = convert24to12(api_data.data.timings.Dhuhr)
    prayer.asr_api = convert24to12(api_data.data.timings.Asr)
    prayer.magrib_api = convert24to12(api_data.data.timings.Maghrib)
    prayer.isha_api = convert24to12(api_data.data.timings.Isha)
    prayer.sunrise = convert24to12(api_data.data.timings.Sunrise)

    res.json([prayer]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/', authenticateJWT, async (req, res) => {
  try {
    const newPrayer = new Prayer({ ...req.body, user: req.user.userId }); // Associate with user
    await newPrayer.save();
    res.status(201).json(newPrayer); // 201 Created
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', authenticateJWT, async (req, res) => {
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

router.get('/:id', authenticateJWT, async (req, res) => {
    try {
      //const prayer = await Prayer.findById(req.params.id)
      const prayer = await Prayer.findById("67a6a7f3910f6b920a5d4254");
      const api_data = await fetchData();

      prayer.fajr_api = convert24to12(api_data.data.timings.Fajr)
      prayer.duhr_api = convert24to12(api_data.data.timings.Dhuhr)
      prayer.asr_api = convert24to12(api_data.data.timings.Asr)
      prayer.magrib_api = convert24to12(api_data.data.timings.Maghrib)
      prayer.isha_api = convert24to12(api_data.data.timings.Isha)
      prayer.sunrise = convert24to12(api_data.data.timings.Sunrise)
    
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


function generateFixedLength() {
  return (Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)).slice(0, 13);
}

// Function to encode a password in Base64
function obfuscatePassword(password) {
  const encodedPassword = Buffer.from(password).toString('base64');
  return encodedPassword;
}

// Define a route to get the prayer times and notices
router.get('/dashboard/data', async (req, res) => {
  try {
    const prayerData = await Prayer.findOne(); // Get the first prayer data document
    const providerData = await Provider.find({}) // Get prayer times from the API
    
    if (!prayerData || !providerData) {
      return res.status(404).json({ message: 'Prayer or Wifi not found data not found' });
    }

    const prayers = {
      fajr: prayerData.fajr,
      sunrise: prayerData.sunrise, // You can adjust this if needed from DB or calculations
      dhuhr: prayerData.duhr,
      jummah: prayerData.jummah, // Adjust if you have a specific value
      asr: prayerData.asr,
      magrib: prayerData.magrib,
      isha: prayerData.isha
    };

    const notice = {
      head_line: prayerData.notice_head_line || "",
      first_line: prayerData.notice_first_line || "Eid Prayer ",
      second_line: prayerData.notice_second_line || "Please arrive 10 minutes early"
    };

    const notice_default = {
      head_line: "Dua for entering the masjid",
      first_line: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
      second_line: "O Allah! open for me the doors of your mercy"
    };

    const hadis = {
      hadis1: prayerData.hadis1,
      hadis2: prayerData.hadis2,
      hadis3: prayerData.hadis3,
      hadis4: prayerData.hadis4,
      hadis5: prayerData.hadis5
    };

    // wifi providers array name,password
    const wifi_providers = providerData.map(provider => {
      return {
        name: provider.name,
        password: obfuscatePassword(provider.password)
      };
    });

    res.json({
      prayers,
      notice,
      notice_default,
      hadis,
      wifi_providers
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


export const prayerRouter=router;

