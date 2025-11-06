const db = require('../models/db');
const path = require('path');

// Get all sayur
exports.getAllSayur = (req, res) => {
  db.query('SELECT * FROM sayur', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    const data = results.map(item => ({
      ...item,
      gambar: item.gambar
        ? `${req.protocol}://${req.get('host')}/uploads/${item.gambar}`
        : null
    }));
    res.json(data);
  });
};

// Get sayur by ID
exports.getSayurById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM sayur WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Sayur tidak ditemukan' });
    const sayur = results[0];
    if (sayur.gambar) {
      sayur.gambar = `${req.protocol}://${req.get('host')}/uploads/${sayur.gambar}`;
    }
    res.json(sayur);
  });
};

// Add sayur
exports.addSayur = (req, res) => {
  const { nama, harga, stok } = req.body;
  const gambar = req.file ? req.file.filename : null;
  db.query(
    'INSERT INTO sayur (nama, harga, stok, gambar) VALUES (?, ?, ?, ?)',
    [nama, harga, stok, gambar],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Sayur berhasil ditambahkan', id: results.insertId });
    }
  );
};

// Update sayur
exports.updateSayur = (req, res) => {
  const { id } = req.params;
  const { nama, harga, stok } = req.body;
  const gambar = req.file ? req.file.filename : null;
  const query = gambar
    ? 'UPDATE sayur SET nama=?, harga=?, stok=?, gambar=? WHERE id=?'
    : 'UPDATE sayur SET nama=?, harga=?, stok=? WHERE id=?';

  const values = gambar
    ? [nama, harga, stok, gambar, id]
    : [nama, harga, stok, id];

  db.query(query, values, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Sayur berhasil diupdate' });
  });
};

// Delete sayur
exports.deleteSayur = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM sayur WHERE id=?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Sayur berhasil dihapus' });
  });
};
