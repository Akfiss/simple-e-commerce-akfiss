// Logika untuk produk (CRUD)

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET semua produk
const getAllProducts = async (req, res) => {
    const products = await prisma.product.findMany({
        include: {
            author: { select: { name: true } },
            category: { select: { name: true } }
        },
    });
    res.status(200).json(products);
};

// GET satu produk
const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
            include: {
                author: { select: { name: true } },
                category: { select: { name: true } }
            },
        });
        if (!product) {
            return res.status(404).json({ message: 'Produk tidak ditemukan' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// POST produk baru
const createProduct = async (req, res) => {
    const { name, description, price, color, categoryId } = req.body;
    const authorId = req.user.userId;
    try {
        const newProduct = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                color,
                author: { connect: { id: authorId } },
                category: { connect: { id: parseInt(categoryId) } }
            },
        });
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: 'Gagal membuat produk, periksa data Anda.', error: error.message });
    }
};

// PUT produk (Update) - VERSI BARU
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
        // 1. Cek apakah produk ada dan dimiliki oleh user
        const product = await prisma.product.findUnique({ where: { id: parseInt(id) } });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (product.authorId !== userId) {
            return res.status(403).json({ message: 'Forbidden: You are not the owner' });
        }
        
        // 2. Siapkan data yang akan diupdate secara dinamis
        const dataToUpdate = {};
        const { name, description, price, color, categoryId } = req.body;

        if (name) dataToUpdate.name = name;
        if (description) dataToUpdate.description = description;
        if (price) dataToUpdate.price = parseFloat(price);
        if (color) dataToUpdate.color = color;
        if (categoryId) dataToUpdate.categoryId = parseInt(categoryId);

        // 3. Jika tidak ada data yang dikirim, kembalikan error
        if (Object.keys(dataToUpdate).length === 0) {
            return res.status(400).json({ message: 'No fields to update provided' });
        }

        // 4. Lakukan update ke database
        const updatedProduct = await prisma.product.update({
            where: { id: parseInt(id) },
            data: dataToUpdate
        });

        res.status(200).json(updatedProduct);

    } catch (error) {
        // Tambahkan log untuk melihat error yang lebih spesifik saat development
        console.error("UPDATE PRODUCT ERROR:", error);
        res.status(500).json({ message: 'Failed to update product' });
    }
};

// DELETE produk
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    const product = await prisma.product.findUnique({ where: { id: parseInt(id) } });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.authorId !== userId) return res.status(403).json({ message: 'Forbidden: You are not the owner' });

    try {
        await prisma.product.delete({ where: { id: parseInt(id) } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete product' });
    }
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };