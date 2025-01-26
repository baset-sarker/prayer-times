const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const User = require('../models/user');

const router = express.Router();

// Session Configuration
router.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: false
}));

// Register Route
router.get('/register', (req, res) => res.render('register'));
router.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    User.create(username, email, hashedPassword, (err) => {
        if (err) return res.status(500).send('Error registering user');
        res.redirect('/login');
    });
});

// Login Route
router.get('/login', (req, res) => res.render('login'));
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    User.findByEmail(email, (err, user) => {
        if (err || !user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).send('Invalid email or password');
        }
        req.session.user = user;
        res.redirect('/dashboard');
    });
});

// Forgot Password Route
router.get('/forgot', (req, res) => res.render('forgot'));
router.post('/forgot', (req, res) => {
    const { email } = req.body;
    User.findByEmail(email, (err, user) => {
        if (err || !user) return res.status(404).send('Email not found');
        // Implement reset logic (e.g., send email with reset token)
        res.send('Password reset link sent (mock response)');
    });
});

// Logout Route
router.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;
