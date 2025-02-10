import express from 'express';
import {Prayer} from '../models/prayer.js';
import authenticateJWT from '../middleware/auth.js';
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


  
function convert24to12(time24) {
  const [hours, minutes] = time24.split(':');
  let hours12 = hours % 12 || 12; // Handle midnight (00:00)
  const ampm = hours < 12 || hours === 24 ? 'AM' : 'PM'; // Determine AM/PM
  hours12 = hours12 % 12 || 12;
  return `${hours12}:${minutes} ${ampm}`;
}
 

function getCurrentDateFormatted() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0'); // Pad with leading zero if needed
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const year = now.getFullYear();

  return `${day}-${month}-${year}`;
}

const fetchData = async () => {
  const lat = '44.676048';
  const lon = '-74.992142';
  const dt = getCurrentDateFormatted();

  const api_url = `https://api.aladhan.com/v1/timings/${dt}?latitude=${lat}&longitude=${lon}&method=2&shafaq=general&timezonestring=America%2FNew_York&calendarMethod=UAQ`;

  console.log(api_url);

  try {
      const response = await fetch(api_url, {
          headers: {
              'Accept': 'application/json'
          }
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      return data;

  } catch (error) {
      console.error('Error fetching data:', error.message);
  }
};

export const prayerRouter=router;

