// Import necessary modules
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const session = require('express-session');
const port = 3000;

// Path to prayer_times.json file
const prayerTimesFilePath = path.join(__dirname, 'prayer_times.json');
const hadisFilePath = path.join(__dirname, 'hadis.json');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({ secret: 'TheisIsthesecrets902309203920930', resave: false, saveUninitialized: true }));

// Serve static files (CSS, JS, images, etc.)
app.use('/public', express.static(path.join(__dirname, 'public')));

// Serve the HTML file at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/prayers.html'));
   //res.sendFile(path.join(__dirname, '/views/prayers_side_by_side.html'));
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
app.get('/prayer-times', (req, res) => {
    fs.readFile(prayerTimesFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return res.status(500).json({ message: 'Failed to read prayer times.' });
        }

        try {
            const prayerTimes = JSON.parse(data);
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

