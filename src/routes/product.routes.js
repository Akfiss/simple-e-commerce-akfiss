// Endpoint untuk /api/products

const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth.middleware');
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/product.controller');

// Rute Publik
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Rute Terproteksi
router.post('/', authenticateToken, createProduct);
router.put('/:id', authenticateToken, updateProduct);
router.delete('/:id', authenticateToken, deleteProduct);

module.exports = router;