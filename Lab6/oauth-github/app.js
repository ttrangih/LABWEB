require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

//jwt_auth
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const app = express();

//task1
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/github/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Token required' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin only' });
  }
  next();
}


app.get('/', (req, res) => {
  res.send('<a href="/auth/github">Login with GitHub</a>');
});

app.get(
  '/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/profile');
  }
);

app.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.send(`
    <h1>Profile</h1>
    <pre>${JSON.stringify(req.user, null, 2)}</pre>
  `);
});



//task2
app.use(bodyParser.json());

//connect database (postgre)
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('PostgreSQL connection error:', err);
  } else {
    console.log('PostgreSQL connected at:', res.rows[0].now);
  }
});

//register
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Missing username or password' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2)',
      [username, hashedPassword]
    );

    res.json({ message: 'Register success' });
  } catch (err) {
    res.status(400).json({ message: 'Username already exists' });
  }
});

//login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // login time & address
const loginTime = new Date();
const loginAddress = req.ip;

// create JWT with extra info
const token = jwt.sign(
  {
    id: user.id,
    username: user.username,
    role: user.role,
    loginTime,
    loginAddress
  },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

// save token + login info to DB
await pool.query(
  `INSERT INTO tokens (user_id, token, login_time, login_address)
   VALUES ($1, $2, $3, $4)`,
  [user.id, token, loginTime, loginAddress]
);


    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

//verify
app.get('/verify', async (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      'SELECT * FROM tokens WHERE token = $1',
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Token not found' });
    }

    res.json({
      message: 'Token valid',
      user: decoded
    });
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

//logout
app.post('/logout', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token required' });
  }

  await pool.query(
    'DELETE FROM tokens WHERE token = $1',
    [token]
  );

  res.json({ message: 'Logout success' });
});

//admin
app.get('/admin', verifyToken, isAdmin, (req, res) => {
  res.json({
    message: 'Welcome Admin',
    user: req.user
  });
});



app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
