// Logika untuk checkout/pesanan

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST checkout, membuat order dari keranjang
const createOrder = async (req, res) => {
    const userId = req.user.userId;
    const { shippingAddress } = req.body;

    try {
        // 1. Dapatkan keranjang user
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: { items: { include: { product: true } } },
        });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Keranjang kosong' });
        }

        // 2. Hitung total harga
        const totalAmount = cart.items.reduce((sum, item) => {
            return sum + item.quantity * item.product.price;
        }, 0);

        // 3. Buat order dan order items dalam satu transaksi
        const order = await prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    userId,
                    totalAmount,
                    shippingAddress,
                    status: 'PENDING',
                    items: {
                        create: cart.items.map(item => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.product.price, // Simpan harga saat checkout
                        })),
                    },
                },
            });

            // 4. Kosongkan keranjang
            await tx.cartItem.deleteMany({
                where: { cartId: cart.id },
            });
            
            return newOrder;
        });

        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// GET semua order milik user
const getUserOrders = async (req, res) => {
    const userId = req.user.userId;
    try {
        const orders = await prisma.order.findMany({
            where: { userId },
            include: { items: { include: { product: { select: { name: true } } } } }
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

module.exports = { createOrder, getUserOrders };