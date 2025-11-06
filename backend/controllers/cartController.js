const db = require('../models/db');

// Tambah item ke cart
exports.addToCart = (req, res) => {
  const { user_id, sayur_id, quantity } = req.body;

  if (!user_id || !sayur_id || !quantity) {
    return res.status(400).json({ error: "Data tidak lengkap" });
  }

  // Cek dulu apakah item sudah ada
  const checkSql = "SELECT quantity FROM cart WHERE user_id = ? AND sayur_id = ?";
  db.query(checkSql, [user_id, sayur_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      const newQty = results[0].quantity + quantity;

      if (newQty <= 0) {
        // Kalau quantity hasilnya 0 atau kurang → hapus dari cart
        const deleteSql = "DELETE FROM cart WHERE user_id = ? AND sayur_id = ?";
        db.query(deleteSql, [user_id, sayur_id], (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });
          return res.json({ message: "Item dihapus dari cart" });
        });
      } else {
        // Update quantity
        const updateSql = "UPDATE cart SET quantity = ? WHERE user_id = ? AND sayur_id = ?";
        db.query(updateSql, [newQty, user_id, sayur_id], (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });
          return res.json({ message: "Quantity diperbarui", newQty });
        });
      }
    } else {
      // Item belum ada di cart → tambah baru
      const insertSql = "INSERT INTO cart (user_id, sayur_id, quantity) VALUES (?, ?, ?)";
      db.query(insertSql, [user_id, sayur_id, quantity], (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ message: "Item ditambahkan ke cart" });
      });
    }
  });
};


// Ambil semua item di cart user
exports.getCart = (req, res) => {
  const { userId } = req.params;
  const sql = `
    SELECT c.id, c.sayur_id, s.nama, s.harga, c.quantity, s.gambar
    FROM cart c
    JOIN sayur s ON c.sayur_id = s.id
    WHERE c.user_id = ?
  `;
  db.query(sql, [userId], (err, results) => {
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

// Checkout
exports.checkout = (req, res) => {
  const { user_id } = req.body;

  db.query(
    `SELECT c.sayur_id, c.quantity, s.harga, s.stok
     FROM cart c
     JOIN sayur s ON c.sayur_id = s.id
     WHERE c.user_id = ?`,
    [user_id],
    (err, items) => {
      if (err) return res.status(500).json({ error: err.message });
      if (items.length === 0)
        return res.status(400).json({ error: 'Cart kosong' });

      // Cek stok
      for (const item of items) {
        if (item.stok < item.quantity) {
          return res.status(400).json({ error: `Stok tidak cukup untuk ${item.sayur_id}` });
        }
      }

      const total = items.reduce((sum, item) => sum + item.harga * item.quantity, 0);

      db.query(`INSERT INTO orders (user_id, total) VALUES (?, ?)`, [user_id, total], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        const orderId = result.insertId;

        // Insert ke order_items
        const orderItems = items.map(i => [orderId, i.sayur_id, i.quantity, i.harga]);
        db.query(
          `INSERT INTO order_items (order_id, sayur_id, quantity, price) VALUES ?`,
          [orderItems],
          (err2) => {
            if (err2) return res.status(500).json({ error: err2.message });

            // Kurangi stok sayur
            items.forEach(i => {
              db.query(`UPDATE sayur SET stok = stok - ? WHERE id = ?`, [i.quantity, i.sayur_id]);
            });

            // Kosongkan cart
            db.query(`DELETE FROM cart WHERE user_id = ?`, [user_id]);

            res.json({ message: 'Checkout berhasil', orderId });
          }
        );
      });
    }
  );
};
