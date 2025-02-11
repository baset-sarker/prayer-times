// Import necessary modules
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const dotenv = require('dotenv');
dotenv.config();
const port = process.env.NODE_SERVER_PORT || 3001;

const app = express();
const session = require('express-session');


// Path to prayer_times.json file
const prayerTimesFilePath = path.join(__dirname, 'prayer_times.json');
const hadisFilePath = path.join(__dirname, 'hadis.json');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const { get } = require('http');

app.use(session({ secret: 'TheisIsthesecrets902309203920930', resave: false, saveUninitialized: true }));

// Serve static files (CSS, JS, images, etc.)
app.use('/public', express.static(path.join(__dirname, 'public')));

// Serve the HTML file at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/prayers.html'));
   //res.sendFile(path.join(__dirname, '/views/prayers_side_by_side.html'));
});


const { exec } = require('child_process');

function getSSID() {
  return new Promise((resolve, reject) => {
    exec('iwgetid -r', (error, stdout, stderr) => {
      if (error) {
        return reject(new Error(`Error executing iwgetid: ${error.message}`));
      }
      const ssid = stdout.trim();
      resolve(ssid || null);
    });
  });
}



app.get('/ssid', async (req, res) => {
  try {
    const ssid = await getSSID();
    if (ssid) {
      res.json({ ssid });
    } else {
      res.status(404).json({ message: 'No SSID detected.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message }); // Send only the error message
  }
});

// GET /update - Read prayer times and pass to update.html
app.get('/update', (req, res) => {
    const message = req.session.message || null; // Retrieve the message from the session
    req.session.message = null; // Clear the message after rendering
    

    fs.readFile(prayerTimesFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading prayer_time.json:', err);
            return res.status(500).send('Error reading data');
        }

        const prayerData = JSON.parse(data);
        console.log(prayerData);
        res.render('update', { prayerData,message });
        //res.sendFile(path.join(__dirname, '/public/update.html'));
    });
});

// POST /update - Handle form submission to update prayer times
app.post('/update', (req, res) => {
    const { fajr,sunrise, dhuhr, asr, magrib, isha, jummah, head_line, first_line, second_line,
        hadis1, hadis2, hadis3, hadis4, hadis5
    } = req.body;
    

    
    const updatedData = {
        prayers: { fajr, sunrise, dhuhr, asr, magrib, isha, jummah },
        notice: { head_line, first_line, second_line },
        notice_default: { head_line: 'Dua for entering the masjid', first_line: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ", second_line: 'O Allah! open for me the doors of your mercy' },
        hadis: { hadis1, hadis2, hadis3, hadis4, hadis5 }
    };

    fs.writeFile(prayerTimesFilePath, JSON.stringify(updatedData, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Error saving data to prayer_time.json:', err);
            //return res.status(500).send('Error saving data');
            // Set success message in the session
            req.session.message = {
                type: 'error',
                text: 'Error in updating  record!',
            };
        }

        //res.status(200).json({ message: 'Update successful', updatedData });
    });

    // Set success message in the session
    req.session.message = {
        type: 'success',
        text: 'Prayer times updated successfully!',
    };

    res.redirect('/update');
});

// Route to update prayer_times.json
// app.get('/update-prayer-times', (req, res) => {
//     const prayerTimes = req.query;

//     if (!Object.keys(prayerTimes).length) {
//         return res.status(400).json({ message: 'No data provided in query parameters.' });
//     }

//     fs.writeFile(prayerTimesFilePath, JSON.stringify(prayerTimes, null, 2), 'utf8', (err) => {
//         if (err) {
//             console.error('Error writing to file:', err);
//             return res.status(500).json({ message: 'Failed to update prayer times.' });
//         }

//         res.json({ message: 'Prayer times updated successfully!', data: prayerTimes });
//     });
// });




// Route to get the content of prayer_times.json
app.get('/prayer-times',async (req, res) => {

    let ssid
    try{
        ssid = await getSSID();
        if (!ssid) {
           ssid = 'Connecting...';   
        }
    } catch (parseErr){
        console.error('Error Getting ssid:', parseErr);
        ssid = 'Connecting...';   
    }
    
 
    fs.readFile(prayerTimesFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return res.status(500).json({ message: 'Failed to read prayer times.' });
        }

        try {
            let prayerTimes = JSON.parse(data);
            prayerTimes = { ...prayerTimes, ssid };
            res.json(prayerTimes);
            
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr);
            res.status(500).json({ message: 'Invalid JSON format in prayer times file.' });
        }
    });
});

app.get('/get-hadis', (req, res) => {
    fs.readFile(hadisFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return res.status(500).json({ message: 'Failed to read prayer times.' });
        }

        try {
            const hadis = JSON.parse(data);
            res.json(hadis);
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr);
            res.status(500).json({ message: 'Invalid JSON format in hadis file.' });
        }
    });
});


app.get('/update-hadis', (req, res) => {
    const message = req.session.message || null;
    req.session.message = null;

    fs.readFile(hadisFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading prayer_time.json:', err);
            return res.status(500).send('Error reading data');
        }

        const prayerData = JSON.parse(data);
        res.render('update-hadis', { prayerData, message });
    });
});

app.post('/update-hadis', (req, res) => {
    const { hadis1,hadis2, hadis3, hadis4, hadis5} = req.body;

    const updatedData = {
        hadis: { hadis1, hadis2, hadis3, hadis4, hadis5 },
    };

    fs.writeFile(hadisFilePath, JSON.stringify(updatedData, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Error saving data to hadis.json:', err);
            //return res.status(500).send('Error saving data');
            // Set success message in the session
            req.session.message = {
                type: 'error',
                text: 'Error in updating  record!',
            };
        }

        //res.status(200).json({ message: 'Update successful', updatedData });
    });

    // Set success message in the session
    req.session.message = {
        type: 'success',
        text: 'Hadis updated successfully!',
    };

    res.redirect('/update-hadis');
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

