const db = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10;

// Register user
exports.register = (req, res) => {
  const { username, password, role } = req.body;
  const hashedPassword = bcrypt.hashSync(password, saltRounds);
  db.query(
    'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
    [username, hashedPassword, role],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'User berhasil didaftarkan', id: results.insertId });
    }
  );
};

// Login user
exports.login = (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'User tidak ditemukan' });

    const user = results[0];
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Password salah' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'supersecretkey',
      { expiresIn: '1h' }
    );
    res.json({
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });

  });
};

// Get all users
exports.getAllUsers = (req, res) => {
  db.query('SELECT id, username, role FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
