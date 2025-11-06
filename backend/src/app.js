const express = require('express');
const cors = require('cors');
const path = require('path');

const sayurRoutes = require('../routes/sayurRoutes');
const userRoutes = require('../routes/userRoutes');
const cartRoutes = require('../routes/cartRoutes');
const orderRoutes = require('../routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // tetap boleh untuk request biasa (non-file)

// ✅ Route uploads agar file bisa diakses dari browser
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ✅ Register routes
app.use('/sayur', sayurRoutes);
app.use('/users', userRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);  

app.get('/', (req, res) => {
  res.send(`🚀 Server Backend running on port ${PORT} !`);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
