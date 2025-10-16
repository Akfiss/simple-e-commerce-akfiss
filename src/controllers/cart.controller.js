// Logika untuk keranjang belanja

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Dapatkan atau buat keranjang untuk user
const getOrCreateCart = async (userId) => {
    let cart = await prisma.cart.findUnique({
        where: { userId },
    });
    if (!cart) {
        cart = await prisma.cart.create({
            data: { userId },
        });
    }
    return cart;
};

// GET isi keranjang user
const getCart = async (req, res) => {
    const userId = req.user.userId;
    try {
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        if (!cart) {
            return res.status(200).json({ items: [] }); // Jika user belum punya keranjang, kirim array kosong
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// POST tambah item ke keranjang
const addItemToCart = async (req, res) => {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;

    try {
        const cart = await getOrCreateCart(userId);
        
        const existingItem = await prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId: parseInt(productId),
            }
        });

        if (existingItem) {
            // Jika item sudah ada, update quantity
            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + parseInt(quantity) },
            });
        } else {
            // Jika item belum ada, buat baru
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: parseInt(productId),
                    quantity: parseInt(quantity),
                },
            });
        }
        res.status(200).json({ message: 'Item added to cart' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// DELETE item dari keranjang
const removeItemFromCart = async (req, res) => {
    const { itemId } = req.params; // ID dari CartItem, bukan ProductId
    try {
        await prisma.cartItem.delete({
            where: { id: parseInt(itemId) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Failed to remove item', error: error.message });
    }
};

module.exports = { getCart, addItemToCart, removeItemFromCart };