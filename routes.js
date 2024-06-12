const express = require('express');
const bcrypt = require('bcryptjs');
const connection = require('./db');
const { authenticateUser, verifyToken } = require('./auth');
const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const auth = await authenticateUser(username, password);
    if (auth) {
        res.json(auth);
    } else {
        res.status(401).send('Invalid credentials');
    }
});

router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const query = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
    connection.query(query, [username, hashedPassword, role], (err, results) => {
        if (err) return res.status(500).send(err);
        res.send('User registered successfully');
    });
});

router.get('/quizzes', verifyToken, (req, res) => {
    const query = 'SELECT * FROM quizzes';
    connection.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

router.post('/quizzes', verifyToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).send('Unauthorized');
    const { title, description, questions } = req.body;
    const query = 'INSERT INTO quizzes (title, description, questions) VALUES (?, ?, ?)';
    connection.query(query, [title, description, JSON.stringify(questions)], (err, results) => {
        if (err) return res.status(500).send(err);
        res.send('Quiz added successfully');
    });
});

router.post('/results', verifyToken, (req, res) => {
    const { user_id, quiz_id, score, passing_probability } = req.body;
    const query = 'INSERT INTO results (user_id, quiz_id, score, passing_probability) VALUES (?, ?, ?, ?)';
    connection.query(query, [user_id, quiz_id, score, passing_probability], (err, results) => {
        if (err) return res.status(500).send(err);
        res.send('Result added successfully');
    });
});

router.get('/results', verifyToken, (req, res) => {
    const query = `
        SELECT results.*, quizzes.title AS quiz_title, users.username
        FROM results
        JOIN quizzes ON results.quiz_id = quizzes.id
        JOIN users ON results.user_id = users.id
    `;
    connection.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

module.exports = router;
