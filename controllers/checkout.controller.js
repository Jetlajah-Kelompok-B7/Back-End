const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
                order: {
                    include: {
                        Orders: {
                            include: true
                        },
                        ticket: {
                            include: {
                                schedule: {
                                    include: {
                                        flight: {
                                            include: {
                                                bandara_keberangkatan: true,
                                                bandara_kedatangan: true,
                                                Plane: {
                                                    include: {
                                                        Airline: {
                                                            include: true
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
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

        const total = checkout.order.Orders.length * checkout.order.ticket.harga;
        const preTax = total + (total / 100 * 10);

        const net = preTax / (1 + 10 / 100);
        const tax = Math.round((preTax - net) * 100) / 100;

        const data = {
            id: checkout.id,
            metode_pembayaran: checkout.metode_pembayaran,
            is_payment: checkout.is_payment,
            total: checkout.total,
            tax: tax,
            tanggal_waktu: checkout.tanggal_waktu,
            status: checkout.status,
            orderId: checkout.orderId,
            bandara_keberangkatan: {
                ...checkout.order.ticket.schedule.flight.bandara_keberangkatan,
                terminal_kedatangan: checkout.order.ticket.schedule.flight.terminal_kedatangan
            },
            bandara_kedatangan: {
                ...checkout.order.ticket.schedule.flight.bandara_kedatangan,
                terminal_kedatangan: checkout.order.ticket.schedule.flight.terminal_keberangkatan
            },
            maskapai: {
                ...checkout.order.ticket.schedule.flight.Plane.Airline
            },
            informasi: {
                bagasi: checkout.order.ticket.schedule.flight.Plane.bagasi,
                bagasi_kabin: checkout.order.ticket.schedule.flight.Plane.bagasi_kabin,
                makanan: checkout.order.ticket.makanan,
                hiburan: checkout.order.ticket.hiburan,
                wifi: checkout.order.ticket.wifi,
                usb: checkout.order.ticket.usb,
                jumlah: checkout.order.ticket.jumlah
            }
        };

        return res.status(200).json({
            status: true,
            message: "Checkout retrieved successfully",
            data
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
    const checkoutId = Number(req.params.id);
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
                is_payment: true,
                status: "Paid"
            },
            include: {
                History_Transaction: true
            },
            where: {
                id: checkoutId
            }
        });

        await prisma.history_Transaction.update({
            data: {
                checkout: {
                    connect: {
                        id: updatedCheckout.id
                    }
                }
            },
            where:{
                id: updatedCheckout.History_Transaction.id
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
    listCheckouts,
    getCheckout,
    confirmCheckout,
    deleteCheckout
};
