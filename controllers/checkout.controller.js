const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
    createCheckout: async (req, res, next) => {
        let {
            metode_pembayaran,
            is_payment,
            total,
            tanggal_waktu, } = req.body;

        try {
            const newCheckout = await prisma.checkout.create({
                data: {
                    metode_pembayaran,
                    is_payment,
                    total,
                    tanggal_waktu,
                    order: { connect: { id: orderId } },
                    History_Transaction: {
                        create: {
                            tanggal_waktu,
                        },
                    },
                },
            });

            res.status(201).json({
                status: true,
                message: 'Checkout and History Transaction created successfully',
                data: newCheckout,
            });
        } catch (error) {
            next(error);
        }
    },

    listCheckouts: async (req, res, next) => {
        try {
            let checkouts = await prisma.checkout.findMany({
                include: {
                    order: true,
                    History_Transaction: true,
                },
            });

            res.status(200).json({
                status: true,
                message: 'Checkouts retrieved successfully',
                data: checkouts,
            });
        } catch (error) {
            next(error);
        }
    },

    getCheckout: async (req, res, next) => {
        let checkoutId = Number(req.params.id);

        try {
            const checkout = await prisma.checkout.findUnique({
                where: { id: checkoutId },
                include: {
                    order: true,
                    History_Transaction: true,
                },
            });

            if (!checkout) {
                return res.status(404).json({
                    status: false,
                    message: "Checkout not found",
                    data: null,
                });
            }

            res.status(200).json({
                status: true,
                message: 'Checkout retrieved successfully',
                data: checkout,
            });
        } catch (error) {
            next(error);
        }
    },

    updateCheckout: async (req, res, next) => {
        const checkoutId = Number(req.params.id);
        let {
            metode_pembayaran,
            is_payment,
            total,
            tanggal_waktu,
            orderId } = req.body;

        try {
            const updatedCheckout = await prisma.checkout.update({
                where: { id: checkoutId },
                data: {
                    metode_pembayaran,
                    is_payment,
                    total,
                    tanggal_waktu,
                    order: { connect: { id: orderId } },
                },
            });

            await prisma.history_Transaction.update({
                where: { checkoutId: checkoutId },
                data: { tanggal_waktu },
            });

            res.status(200).json({
                status: true,
                message: 'Checkout and History Transaction updated successfully',
                data: updatedCheckout,
            });
        } catch (error) {
            next(error);
        }
    },

    deleteCheckout: async (req, res, next) => {
        const checkoutId = Number(req.params.id);

        try {
            await prisma.history_Transaction.deleteMany({
                where: { checkoutId: checkoutId },
            });

            await prisma.checkout.delete({
                where: { id: checkoutId },
            });

            res.status(200).json({
                status: true,
                message: 'Checkout and corresponding History Transaction deleted successfully',
            });
        } catch (error) {
            next(error);
        }
    },
};
