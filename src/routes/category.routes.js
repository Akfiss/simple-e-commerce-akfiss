// Endpoint untuk /api/categories

const express = require('express');
const router = express.Router();
const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require('../controllers/category.controller');
const authenticateToken = require('../middleware/auth.middleware');

// Routes Publik (tidak perlu login)
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Routes Terproteksi (perlu token/login, mungkin hanya untuk admin nanti)
router.post('/', authenticateToken, createCategory);
router.put('/:id', authenticateToken, updateCategory);
router.delete('/:id', authenticateToken, deleteCategory);

module.exports = router;