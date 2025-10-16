// Logika untuk kategori (CRUD)

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Membuat Kategori Baru
const createCategory = async (req, res) => {
    const { name, description } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Nama kategori wajib diisi' });
    }
    try {
        const newCategory = await prisma.category.create({
            data: { name, description },
        });
        res.status(201).json(newCategory);
    } catch (error) {
        // Handle jika nama kategori sudah ada (karena di schema kita set @unique)
        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'Nama kategori sudah ada' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// 2. Mendapatkan Semua Kategori
const getAllCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// 3. Mendapatkan Kategori Berdasarkan ID
const getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await prisma.category.findUnique({
            where: { id: parseInt(id) },
        });
        if (!category) {
            return res.status(404).json({ message: 'Kategori tidak ditemukan' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// 4. Memperbarui Kategori - VERSI BARU
const updateCategory = async (req, res) => {
    const { id } = req.params;
    
    try {
        const dataToUpdate = {};
        const { name, description } = req.body;

        // Hanya tambahkan field ke objek update jika ada di body request
        if (name) dataToUpdate.name = name;
        if (description) dataToUpdate.description = description;

        if (Object.keys(dataToUpdate).length === 0) {
            return res.status(400).json({ message: 'No fields to update provided' });
        }

        const updatedCategory = await prisma.category.update({
            where: { id: parseInt(id) },
            data: dataToUpdate,
        });
        res.status(200).json(updatedCategory);
    } catch (error) {
        // Handle jika kategori yang mau diupdate tidak ada
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Kategori tidak ditemukan' });
        }
        // Handle jika nama kategori duplikat
        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'Nama kategori sudah ada' });
        }
        console.error("UPDATE CATEGORY ERROR:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// 5. Menghapus Kategori
const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.category.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send(); // 204 No Content
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Kategori tidak ditemukan' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Ekspor semua fungsi agar bisa digunakan di file routes
module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};