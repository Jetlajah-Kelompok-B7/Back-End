const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const createCheckout = async (req, res, next) => {
    const orderParams = Number(req.params.id);

    try {
        if (!orderParams) {
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

        const exists = await prisma.checkout.findUnique({
            where: {
                orderId: orderParams,
                order: {
                    userId: users.id
                }
            }
        });

        if (exists) {
            return res.status(400).json({
                status: false,
                message: "Bad Request"
            });
        }

        const order = await prisma.order.findMany({
            include: {
                ticket: {
                    select: {
                        harga: true
                    }
                }
            },
            where: {
                id: orderParams,
                userId: users.id
            }
        });

        const total = order.reduce((acc, curr) => acc + curr.ticket.harga, 0);

        const newCheckout = await prisma.checkout.create({
            data: {
                total: total,
                order: {
                    connect: {
                        id: orderParams
                    }
                }
            }
        });

        await prisma.history_Transaction.create({
            data: {
                checkout: {
                    connect: {
                        id: newCheckout.id
                    }
                }
            }
        });

        return res.status(201).json({
            status: true,
            message: "Checkout successfully created",
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

        const checkouts = await prisma.checkout.findMany({
            include: {
                order: true,
                History_Transaction: true
            },
            where: {
                order: {
                    userId: users.id
                }
            }
        });

        return res.status(200).json({
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
    try {
        const checkoutId = Number(req.params.id);

        if (!checkoutId) {
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

        const checkout = await prisma.checkout.findUnique({
            include: {
                order: true,
                History_Transaction: true
            },
            where: {
                id: checkoutId,
                order: {
                    userId: users.id
                }
            }
        });

        if (!checkout) {
            return res.status(404).json({
                status: false,
                message: "Checkout not found"
            });
        }

        return res.status(200).json({
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
const confirmCheckout = async (req, res, next) => {
    const orderId = Number(req.params.id);
    const {
        metode_pembayaran
    } = req.body;

    try {
        if (!metode_pembayaran) {
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

        const tanggal_waktu = new Date();
        const updatedCheckout = await prisma.checkout.update({
            data: {
                metode_pembayaran,
                tanggal_waktu,
                is_payment: true
            },
            where: {
                orderId: orderId
            }
        });

        await prisma.history_Transaction.update({
            where:{
                id: updatedCheckout
            },
            data: {
                checkout: {
                    connect: {
                        id: updatedCheckout.id
                    }
                }
            }
        });

        await prisma.notification.create({
            data: {
                judul: "Order successfully paid",
                deskripsi: "Your ticket order has been successfully paid. Thank you for your purchase!",
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
            message: "Your ticket order has been successfully paid. Thank you for your purchase!",
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

        return res.status(200).json({
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
    confirmCheckout,
    deleteCheckout
};
