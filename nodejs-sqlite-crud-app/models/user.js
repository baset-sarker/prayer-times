const db = require('../db/database');

class User {
    static findByEmail(email, callback) {
        db.get('SELECT * FROM users WHERE email = ?', [email], callback);
    }

    static findByUsername(username, callback) {
        db.get('SELECT * FROM users WHERE username = ?', [username], callback);
    }

    static create(username, email, hashedPassword, callback) {
        db.run(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword],
            callback
        );
    }
}

module.exports = User;
