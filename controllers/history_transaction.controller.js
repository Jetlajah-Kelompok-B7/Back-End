const { PrismaClient } = require("@prisma/client");
const { paginationUtils } = require("../utils/pagination");
const prisma = new PrismaClient();
const crypto = require("node:crypto");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const listHistoryTransactions = async (req, res, next) => {
    try {
        const users = await prisma.user.findUnique({
            where: {
                id: req.user.id
            }
        });

        if (!users) {
            return res.status(404).json({
                status: false,
                message: "Users not found"
            });
        }

        const historyTransactionsTotal = await prisma.history_Transaction.count();

        const pagination = paginationUtils(req.query.page, req.query.page_size, historyTransactionsTotal);

        const historyTransactions = await prisma.history_Transaction.findMany({
            include: {
                checkout: {
                    include: {
                        order: {
                            include: {
                                ticket: {
                                    include: {
                                        schedule: {
                                            include: {
                                                flight: {
                                                    select: {
                                                        bandara_keberangkatan: true,
                                                        bandara_kedatangan: true,
                                                        terminal_kedatangan: true,
                                                        terminal_keberangkatan: true,
                                                        Plane: {
                                                            select: {
                                                                Airline: {
                                                                    select: {
                                                                        nama_maskapai: true,
                                                                        kode_maskapai: true,
                                                                        logo_maskapai: true
                                                                    }
                                                                },
                                                                Flight: {
                                                                    select: {
                                                                        bandara_keberangkatan: {
                                                                            include: true
                                                                        },
                                                                        bandara_kedatangan: {
                                                                            include: true
                                                                        },
                                                                        terminal_keberangkatan: true,
                                                                        terminal_kedatangan: true
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
                                user: {
                                    select: {
                                        id: true,
                                        Profile: {
                                            select: {
                                                nama: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            where: {
                checkout: {
                    order: {
                        userId: users.id
                    }
                }
            },
            take: pagination.page_size,
            skip: (pagination.current_page - 1) * pagination.page_size
        });

        const data = historyTransactions.map(ht => {
            const checkout = ht.checkout;
            const order = checkout.order;
            const ticket = order.ticket;
            const schedule = ticket.schedule;
            const flight = schedule.flight;
            const airline = flight.Plane.Airline;
            const departureAirport = flight.bandara_keberangkatan;
            const arrivalAirport = flight.bandara_kedatangan;
            const departureTerminal = flight.terminal_keberangkatan;

            return {
                id: ht.id,
                timestamp: checkout.tanggal_waktu,
                bandara_keberangkatan: departureAirport,
                bandara_kedatangan: arrivalAirport,
                terminal: departureTerminal,
                status: checkout.is_payment ? "Issued" : "Unpaid",
                nama_maskapai: airline.nama_maskapai,
                kode_maskapai: airline.kode_maskapai,
                flight_date: schedule.tanggal_berangkat,
                flight_time: schedule.waktu_berangkat
            };
        });

        return res.status(200).json({
            status: true,
            message: "History Transactions retrieved successfully",
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
const getHistoryTransaction = async (req, res, next) => {
    const historyTransactionId = Number(req.params.id);

    try {
        const users = await prisma.user.findUnique({
            where: {
                id: req.user.id
            }
        });

        if (!users) {
            return res.status(404).json({
                status: false,
                message: "Users not found"
            });
        }

        const profile = await prisma.profile.findUnique({
            where: {
                id: users.id
            }
        });

        const historyTransaction = await prisma.history_Transaction.findUnique({
            where: {
                id: historyTransactionId,
                checkout: {
                    order: {
                        userId: users.id
                    }
                }
            },
            include: {
                checkout: {
                    select: {
                        metode_pembayaran: true,
                        status: true,
                        total: true,
                        is_payment: true,
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
                                                        Plane: {
                                                            include: {
                                                                Airline: true
                                                            }
                                                        },
                                                        bandara_keberangkatan: true,
                                                        bandara_kedatangan: true
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
            }
        });

        if (!historyTransaction) {
            return res.status(404).json({
                status: false,
                message: "History Transaction not found",
                data: null
            });
        }

        const checkout = historyTransaction.checkout;

        const total = checkout.order.Orders.length * checkout.order.ticket.harga;
        const preTax = total + (total / 100 * 10);

        const net = preTax / (1 + 10 / 100);
        const tax = Math.round((preTax - net) * 100) / 100;

        const order = checkout.order;

        const hashIdOrder = crypto.createHash("sha256").update(order.id.toString()).digest("hex").slice(0, 7);

        const data = {
            price: {
                total: checkout.total,
                tax: tax
            },
            booking_code: hashIdOrder,
            ...historyTransaction
        };

        return res.status(200).json({
            status: true,
            message: "History Transaction retrieved successfully",
            data: data
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    listHistoryTransactions,
    getHistoryTransaction
};
