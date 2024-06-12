require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse URL-encoded bodies and JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SECRET_KEY || 'default_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Route for homepage
app.get('/', (req, res) => {
  res.render('index');
});

// Route for questions
app.get('/questions', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  db.query('SELECT * FROM questions', (err, results) => {
    if (err) {
      return res.status(500).send('Database query error');
    }
    res.render('questions', { questions: results });
  });
});

// Route to show the login form
app.get('/login', (req, res) => {
  res.render('login');
});

// Route to show the registration form
app.get('/register', (req, res) => {
  res.render('register');
});

// Route to handle registration
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
    if (err) {
      console.error('Error registering user:', err);
      return res.status(500).send('Error registering user');
    }
    res.redirect('/login');
  });
});

// Route to handle login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  console.log(`Login attempt: ${username}`);

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Database query error');
    }
    if (results.length === 0) {
      console.log('No user found with that username');
      return res.status(400).send('Invalid username or password');
    }

    const user = results[0];
    console.log(`User found: ${user.username}`);

    try {
      const isMatch = await bcrypt.compare(password, user.password);
      console.log(`Password match: ${isMatch}`);

      if (!isMatch) {
        console.log('Password does not match');
        return res.status(400).send('Invalid username or password');
      }

      req.session.user = user;
      console.log('Login successful');
      res.redirect('/questions');
    } catch (error) {
      console.error('Error comparing passwords:', error);
      res.status(500).send('Internal server error');
    }
  });
});


// Route to handle logout
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error logging out:', err);
      return res.status(500).send('Error logging out');
    }
    res.redirect('/login');
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
