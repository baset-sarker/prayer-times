const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const authRoutes = require('../routes/auth');
const crudRoutes = require('../routes/crud');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, '../public')));

// Routes
app.use(authRoutes);
app.use(crudRoutes);

app.get('/', (req, res) => {
    res.render('site');
});

module.exports.handler = serverless(app);
