// Endpoint untuk /api/orders

const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth.middleware');
const { createOrder, getUserOrders } = require('../controllers/order.controller');

// Semua rute order butuh otentikasi
router.use(authenticateToken);

router.get('/', getUserOrders);
router.post('/checkout', createOrder);

module.exports = router;