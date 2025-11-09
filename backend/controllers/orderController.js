const db = require('../models/db');

exports.getUserOrders = (req, res) => {
  const { userId } = req.params;
  const sql = `
    SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC
  `;
  db.query(sql, [userId], (err, orders) => {
    if (err) return res.status(500).json({ error: err.message });

    const orderIds = orders.map(o => o.id);
    if (orderIds.length === 0) return res.json([]);

    db.query(
      `SELECT oi.*, s.nama, s.gambar
       FROM order_items oi
       JOIN sayur s ON oi.sayur_id = s.id
       WHERE oi.order_id IN (?)`,
      [orderIds],
      (err2, items) => {
        if (err2) return res.status(500).json({ error: err2.message });

        const result = orders.map(order => ({
          ...order,
          items: items
            .filter(i => i.order_id === order.id)
            .map(i => ({
              ...i,
              gambar: i.gambar
                ? `${req.protocol}://${req.get('host')}/uploads/${i.gambar}`
                : null
            }))
        }));
        res.json(result);
      }
    );
  });
};

exports.getAllOrders = (req, res) => {
  const sql = `
    SELECT o.*, u.username
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `;
  db.query(sql, (err, orders) => {
    if (err) return res.status(500).json({ error: err.message });

    db.query(
      `SELECT oi.*, s.nama
       FROM order_items oi
       JOIN sayur s ON oi.sayur_id = s.id`,
      (err2, items) => {
        if (err2) return res.status(500).json({ error: err2.message });

        const result = orders.map(order => ({
          ...order,
          items: items.filter(i => i.order_id === order.id)
        }));
        res.json(result);
      }
    );
  });
};

exports.markOrderDone = (req, res) => {
  const { orderId } = req.params;
  db.query(
    `UPDATE orders SET status = 'done' WHERE id = ?`,
    [orderId],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Order ditandai selesai' });
    }
  );
};
