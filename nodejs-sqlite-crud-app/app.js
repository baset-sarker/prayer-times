const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const crudRoutes = require('./routes/crud');
const path = require('path');
const port = 80;
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
// Serve static files (CSS, JS, images, etc.)
app.use('/public', express.static(path.join(__dirname, 'public')));

// Routes
app.use(authRoutes);
app.use(crudRoutes);

app.route('/').get((req, res) => {
    res.render('site');
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
