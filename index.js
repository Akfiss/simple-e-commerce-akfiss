const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Panggil dotenv config

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Impor Router Utama
const mainRouter = require('./src/routes/index');

// Daftarkan Router Utama ke path /api
app.use('/api', mainRouter);

// Halaman default
app.get('/', (req, res) => {
    res.send('Selamat datang di Simple E-Commerce API!');
});

// Jalankan Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});

module.exports = app;