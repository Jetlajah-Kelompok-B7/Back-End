const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const createOrder = async (req, res, next) => {
    try {
        let {
            nama,
            tanggal_lahir,
            kewarganegaraan,
            ktp_pasport,
            negara_penerbit,
            berlaku_sampai,
            no_kursi,
            is_baby
        } = req.body;

        const tickets = await prisma.ticket.findMany({
            select: {
                id: true
            }
        });

        const randomIndex = Math.floor(Math.random() * tickets.length);
        const randomTicketId = tickets[randomIndex].id;

        const newOrder = await prisma.order.create({
            data: {
                nama,
                tanggal_lahir,
                kewarganegaraan,
                ktp_pasport,
                negara_penerbit,
                berlaku_sampai,
                no_kursi,
                is_baby,
                ticket: {
                    connect: {
                        id: randomTicketId
                    }
                },
                user: {
                    connect: {
                        id: 2
                    }
                }
            }
        });

        res.status(201).json({
            status: true,
            message: "Order created successfully",
            data: newOrder
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
const listOrders = async (req, res, next) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                ticket: true,
                user: true
            }
        });

        res.status(200).json({
            status: true,
            message: "Orders retrieved successfully",
            data: orders
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
const getOrder = async (req, res, next) => {
    const orderId = Number(req.params.id);

    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                ticket: true,
                user: true
            }
        });

        if (!order) {
            return res.status(404).json({
                status: false,
                message: "Order not found",
                data: null
            });
        }

        res.status(200).json({
            status: true,
            message: "Order retrieved successfully",
            data: order
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
const updateOrder = async (req, res, next) => {
    const orderId = Number(req.params.id);
    let { nama,
        tanggal_lahir,
        kewarganegaraan,
        ktp_pasport,
        negara_penerbit,
        berlaku_sampai,
        no_kursi,
        is_baby
    } = req.body;

    const tickets = await prisma.ticket.findMany({
        select: {
            id: true
        }
    });

    const randomIndex = Math.floor(Math.random() * tickets.length);
    const randomTicketId = tickets[randomIndex].id;

    try {
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: {
                nama,
                tanggal_lahir,
                kewarganegaraan,
                ktp_pasport,
                negara_penerbit,
                berlaku_sampai,
                no_kursi,
                is_baby,
                ticket: {
                    connect: {
                        id: randomTicketId
                    }
                },
                user: {
                    connect: {
                        id: 2
                    }
                }
            }
        });

        res.status(200).json({
            status: true,
            message: "Order updated successfully",
            data: updatedOrder
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
const deleteOrder = async (req, res, next) => {
    const orderId = Number(req.params.id);

    try {
        await prisma.order.delete({
            where: { id: orderId }
        });

        res.status(200).json({
            status: true,
            message: "Order deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createOrder,
    listOrders,
    getOrder,
    updateOrder,
    deleteOrder
};
