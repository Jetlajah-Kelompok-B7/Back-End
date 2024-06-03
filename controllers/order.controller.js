const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const createOrder = async (req, res, next) => {
    try {
        const { orders } = req.body;

        const ordersArr = [];

        if (orders.length > 0) {
            orders.forEach((order) => {
                ordersArr.push(order);
            });
        } else {
            return res.status(400).json({
                status: false,
                message: "Bad Request"
            });
        }

        const tickets = await prisma.ticket.findMany({
            select: {
                id: true
            }
        });

        const users = await prisma.user.findUnique({
            where: {
                id: req.user.id
            }
        });

        if (!users) {
            return res.status(401).json({
                status: false,
                message: "Users not found"
            });
        }

        const randomIndex = Math.floor(Math.random() * tickets.length);
        const randomTicketId = tickets[randomIndex].id;
        const tanggal_waktu = new Date();

        const newOrder = await prisma.order.create({
            data: {
                Orders: {
                    create: ordersArr
                },
                ticket: {
                    connect: {
                        id: randomTicketId
                    }
                },
                user: {
                    connect: {
                        id: users.id
                    }
                }
            }
        });

        await prisma.notification.create({
            data: {
                judul: "Order Created",
                deskripsi: "Your order has been created successfully. Please confirm the payment to proceed.",
                tanggal_waktu,
                user: {
                    connect: {
                        id: users.id
                    }
                }
            }
        });

        return res.status(201).json({
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
        const users = await prisma.user.findUnique({
            where: {
                id: req.user.id
            }
        });

        if (!users) {
            return res.status(401).json({
                status: false,
                message: "Users not found"
            });
        }

        const orders = await prisma.order.findMany({
            include: {
                ticket: true,
                user: true
            },
            where: {
                userId: users.id
            }
        });

        return res.status(200).json({
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
        if (!orderId) {
            return res.status(400).json({
                status: false,
                message: "Bad Request"
            });
        }

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
                message: "Order not found"
            });
        }

        return res.status(200).json({
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
    const {
        nama,
        tanggal_lahir,
        kewarganegaraan,
        ktp_pasport,
        negara_penerbit,
        berlaku_sampai,
        no_kursi,
        is_baby
    } = req.body;

    if (!orderId) {
        return res.status(400).json({
            status: false,
            message: "Bad Request"
        });
    }

    const tickets = await prisma.ticket.findMany({
        select: {
            id: true
        }
    });

    const users = await prisma.user.findUnique({
        where: {
            id: req.user.id
        }
    });

    if (!users) {
        return res.status(401).json({
            status: false,
            message: "Users not found"
        });
    }

    const randomIndex = Math.floor(Math.random() * tickets.length);
    const randomTicketId = tickets[randomIndex].id;

    try {
        const updatedOrder = await prisma.order.update({
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
                        id: users.id
                    }
                }
            },
            where: {
                id: orderId,
                userId: users.id
            }
        });

        return res.status(200).json({
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
    try {
        const orderId = Number(req.params.id);

        if (!orderId) {
            return res.status(400).json({
                status: false,
                message: "Bad Request"
            });
        }

        const users = await prisma.user.findUnique({
            where: {
                id: req.user.id
            }
        });

        if (!users) {
            return res.status(401).json({
                status: false,
                message: "Users not found"
            });
        }

        const exists = await prisma.order.findUnique({
            where: {
                id: orderId,
                userId: users.id
            }
        });

        if (!exists) {
            return res.status(404).json({
                status: false,
                message: "Order Not Found"
            });
        }

        await prisma.order.delete({
            where: {
                id: orderId,
                userId: users.id
            }
        });

        return res.status(200).json({
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
