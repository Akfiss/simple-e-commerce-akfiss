// index.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

// Kunci rahasia untuk JWT. Simpan ini di file .env di aplikasi sungguhan!
const JWT_SECRET = 'your-super-secret-key';

// --- ENDPOINTS AUTENTIKASI ---

// REGISTER: Membuat pengguna baru
app.post('/api/register', async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Hash password sebelum disimpan
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
        });

        res.status(201).json({ message: 'User created successfully', userId: user.id });
    } catch (error) {
        // Cek jika email sudah terdaftar
        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// LOGIN: Mengautentikasi pengguna dan memberikan token
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Buat token JWT
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: '1h', // Token berlaku selama 1 jam
        });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


// --- MIDDLEWARE untuk melindungi route ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user; // Menyimpan data user (dari token) ke object request
        next();
    });
};


// --- ENDPOINTS PRODUK (SEKARANG DENGAN LOGIKA KEPEMILIKAN) ---

// GET semua produk (tetap publik)
app.get('/api/products', async (req, res) => {
    const products = await prisma.product.findMany({
        // Sertakan data pembuatnya di dalam respons
        include: { author: { select: { name: true, email: true } } },
    });
    res.status(200).json(products);
});

// POST produk baru (terhubung dengan user)
app.post('/api/products', authenticateToken, async (req, res) => {
    const { name, description, price } = req.body;
    const authorId = req.user.userId; // Ambil ID user dari token JWT

    try {
        const newProduct = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                author: { connect: { id: authorId } }, // Hubungkan produk dengan user
            },
        });
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: 'Failed to create product', error: error.message });
    }
});

// PUT produk (hanya oleh pemilik)
app.put('/api/products/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    const product = await prisma.product.findUnique({ where: { id: parseInt(id) } });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.authorId !== userId) return res.status(403).json({ message: 'Forbidden: You are not the owner' });
    
    const { name, description, price } = req.body;
    try {
        const updatedProduct = await prisma.product.update({ where: { id: parseInt(id) }, data: { name, description, price: parseFloat(price) }});
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update product' });
    }
});

// DELETE produk (hanya oleh pemilik)
app.delete('/api/products/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    const product = await prisma.product.findUnique({ where: { id: parseInt(id) } });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.authorId !== userId) return res.status(403).json({ message: 'Forbidden: You are not the owner' });

    try {
        await prisma.product.delete({ where: { id: parseInt(id) } });
        res.status(204).send(); // No Content
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete product' });
    }
});

// Jalankan Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});

module.exports = app;