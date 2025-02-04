const express = require("express");
const serverless = require("serverless-http");
const app = express();
const router = express.Router();

// router.get("/", (req, res) => {
//     res.send("App is running..");
// });

const bodyParser = require('body-parser');
const authRoutes = require('../routes/auth');
const crudRoutes = require('../routes/crud');
const path = require('path');
const port = 80;


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

app.use("/.netlify/functions/app", router);
module.exports.handler = serverless(app);