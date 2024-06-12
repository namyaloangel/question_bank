const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const connection = require('./db');
require('dotenv').config();

async function authenticateUser(username, password) {
    const query = 'SELECT * FROM users WHERE username = ?';
    return new Promise((resolve, reject) => {
        connection.query(query, [username], (err, results) => {
            if (err) return reject(err);
            if (results.length > 0) {
                const user = results[0];
                if (bcrypt.compareSync(password, user.password)) {
                    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1h' });
                    return resolve({ token, role: user.role });
                }
            }
            resolve(null);
        });
    });
}

function verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(403).send('No token provided.');
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) return res.status(500).send('Failed to authenticate token.');
        req.user = decoded;
        next();
    });
}

module.exports = { authenticateUser, verifyToken };
