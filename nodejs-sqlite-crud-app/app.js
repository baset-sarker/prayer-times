const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const crudRoutes = require('./routes/crud');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

// Routes
app.use(authRoutes);
app.use(crudRoutes);

// Server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
