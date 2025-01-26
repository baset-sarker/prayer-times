const express = require('express');
const db = require('../db/database');

const router = express.Router();

// Dashboard Route
router.get('/dashboard', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    db.all('SELECT * FROM items', [], (err, rows) => {
        if (err) return res.status(500).send('Error loading items');
        res.render('index', { items: rows });
    });
});

// CRUD Operations
router.post('/create', (req, res) => {
    const { name } = req.body;
    db.run('INSERT INTO items (name) VALUES (?)', [name], (err) => {
        if (err) return res.status(500).send('Error creating item');
        res.redirect('/dashboard');
    });
});

router.post('/update/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    db.run('UPDATE items SET name = ? WHERE id = ?', [name, id], (err) => {
        if (err) return res.status(500).send('Error updating item');
        res.redirect('/dashboard');
    });
});

router.post('/delete/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM items WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send('Error deleting item');
        res.redirect('/dashboard');
    });
});

module.exports = router;
