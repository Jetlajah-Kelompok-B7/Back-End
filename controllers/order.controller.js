const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const createOrder = async (req, res, next) => {
    try {
        const ticketId = Number(req.params.id);
        const orders = req.body;

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
        };

        const ticket = await prisma.ticket.findUnique({
            where: {
                id: ticketId
            },
            select: {
                jumlah: true
            }
        });

        const lastOrder = await prisma.order_Items.findFirst({
            where: {
                Order: {
                    ticketId: ticketId
                }
            },
            select: {
                no_kursi: true
            },
            orderBy: {
                no_kursi: "desc"
            }
        });

        const tanggal_waktu = new Date();

        const orderItems = orders.map((order, index) => ({
            nama: order.nama,
            tanggal_lahir: order.tanggal_lahir,
            kewarganegaraan: order.kewarganegaraan,
            ktp_pasport: order.ktp_pasport,
            is_baby: order.is_baby,
            negara_penerbit: order.negara_penerbit,
            berlaku_sampai: order.berlaku_sampai,
            no_kursi: (lastOrder ? lastOrder.no_kursi : 0) + index + 1,
        }));

        if (orderItems.length > ticket.jumlah) {
            return res.status(400).json({
                status: false,
                message: "Order quantity exceeds the available ticket quantity"
            });
        } else {
            await prisma.ticket.update({
                data: {
                    jumlah: ticket.jumlah - orderItems.length
                },
                where: {
                    id: ticketId
                }
            });
        }

        const newOrder = await prisma.order.create({
            data: {
                ticketId: ticketId,
                userId: users.id,
                Orders: {
                    create: orderItems
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
                ticket: {
                    include: {
                        schedule: {
                            include: {
                                flight: {
                                    include: {
                                        bandara_keberangkatan: true,
                                        bandara_kedatangan: true
                                    }
                                }
                            }
                        }
                    }   
                },
                Orders: true
            },
            where: {
                userId: users.id
            }
        });

        const data = orders.map((order) => ({
            id: order.id,
            ticket: {
                id: order.ticket.id,
                harga: order.ticket.harga,
                schedule: {
                    bandara_asal: order.ticket.schedule.flight.bandara_kedatangan.nama_bandara,
                    jam_keberangkatan: order.ticket.schedule.keberangkatan,
                    bandara_tujuan: order.ticket.schedule.flight.bandara_kedatangan.nama_bandara,
                    jam_kedatangan: order.ticket.schedule.kedatangan
                }
            },
            Orders: order.Orders
        }));

        return res.status(200).json({
            status: true,
            message: "Orders retrieved successfully",
            data: data
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

        const order = await prisma.order.findUnique({
            include: {
                ticket: {
                    include: {
                        schedule: {
                            include: {
                                flight: {
                                    include: {
                                        bandara_keberangkatan: true,
                                        bandara_kedatangan: true
                                    }
                                }
                            }
                        }
                    }   
                },
                Orders: true
            },
            where: {
                id: orderId,
                userId: users.id
            }
        });

        const data = {
            id: order.id,
            ticket: {
                id: order.ticket.id,
                harga: order.ticket.harga,
                schedule: {
                    bandara_asal: order.ticket.schedule.flight.bandara_kedatangan.nama_bandara,
                    jam_keberangkatan: order.ticket.schedule.keberangkatan,
                    bandara_tujuan: order.ticket.schedule.flight.bandara_kedatangan.nama_bandara,
                    jam_kedatangan: order.ticket.schedule.kedatangan
                }
            },
            Orders: order.Orders
        };

        if (!order) {
            return res.status(404).json({
                status: false,
                message: "Order not found"
            });
        }

        return res.status(200).json({
            status: true,
            message: "Order retrieved successfully",
            data: data
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
    try {
        const orderId = Number(req.params.id);
        const { orders } = req.body;

        const ordersArr = [];

        if (orders.length > 0 && orderId) {
            orders.forEach((order) => {
                ordersArr.push(order);
            });
        } else {
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

        const ticketId = await prisma.order.findUnique({
            where: {
                id: orderId
            },
            select: {
                ticketId: true
            }
        });

        const updatedOrder = await prisma.order.update({
            data: {
                Orders: {
                    create: ordersArr
                },
                ticket: {
                    connect: {
                        id: ticketId.ticketId
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
