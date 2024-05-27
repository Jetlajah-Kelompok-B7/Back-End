const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const createCheckout = async (req, res, next) => {
    let { metode_pembayaran, total } = req.body;
    const orderParams = Number(req.params.id);

    try {
        const order = await prisma.order.findMany({
            include: {
                ticket: {
                    select: {
                        price: true
                    }
                }
            },
            where: {
                ticketId: orderParams
            }
        });

        const total = order.reduce((acc, curr) => acc + curr.ticket.price, 0);

        const newCheckout = await prisma.checkout.create({
            data: {
                metode_pembayaran,
                total: total,
                order: { connect: { id: orderParams } }
            }
        });

        res.status(201).json({
            status: true,
            message: "Checkout and History Transaction created successfully",
            data: newCheckout
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const listCheckouts = async (req, res, next) => {
    try {
        let checkouts = await prisma.checkout.findMany({
            include: {
                order: true,
                History_Transaction: true
            }
        });

        res.status(200).json({
            status: true,
            message: "Checkouts retrieved successfully",
            data: checkouts
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const getCheckout = async (req, res, next) => {
    let checkoutId = Number(req.params.id);

    try {
        const checkout = await prisma.checkout.findUnique({
            where: { id: checkoutId },
            include: {
                order: true,
                History_Transaction: true
            }
        });

        if (!checkout) {
            return res.status(404).json({
                status: false,
                message: "Checkout not found",
                data: null
            });
        }

        res.status(200).json({
            status: true,
            message: "Checkout retrieved successfully",
            data: checkout
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const updateCheckout = async (req, res, next) => {
    const checkoutId = Number(req.params.id);
    let {
        metode_pembayaran,
        is_payment,
        total,
        orderId
    } = req.body;

    try {
        const tanggal_waktu = Date.now();
        const updatedCheckout = await prisma.checkout.update({
            where: { id: checkoutId },
            data: {
                metode_pembayaran,
                is_payment,
                total,
                tanggal_waktu,
                order: { connect: { id: orderId } }
            }
        });

        await prisma.history_Transaction.update({
            where: { checkoutId: checkoutId },
            data: { tanggal_waktu }
        });

        res.status(200).json({
            status: true,
            message: "Checkout and History Transaction updated successfully",
            data: updatedCheckout
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const deleteCheckout = async (req, res, next) => {
    const checkoutId = Number(req.params.id);

    try {
        await prisma.history_Transaction.deleteMany({
            where: { checkoutId: checkoutId }
        });

        await prisma.checkout.delete({
            where: { id: checkoutId }
        });

        res.status(200).json({
            status: true,
            message: "Checkout and corresponding History Transaction deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createCheckout,
    listCheckouts,
    getCheckout,
    updateCheckout,
    deleteCheckout
};
