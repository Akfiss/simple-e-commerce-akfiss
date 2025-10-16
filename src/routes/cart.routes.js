// Endpoint untuk /api/cart

const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth.middleware');
const { getCart, addItemToCart, removeItemFromCart } = require('../controllers/cart.controller');

// Semua rute keranjang butuh otentikasi
router.use(authenticateToken);

router.get('/', getCart);
router.post('/add', addItemToCart);
router.delete('/item/:itemId', removeItemFromCart);

module.exports = router;