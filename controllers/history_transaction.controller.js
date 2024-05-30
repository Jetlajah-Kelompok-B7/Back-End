const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const createHistoryTransaction = async (req, res, next) => {
    try {
        const { tanggal_waktu, checkoutId } = req.body;

        if (!tanggal_waktu || !checkoutId) {
            return res.status(400).json({
                status: 400,
                message: "Bad Request"
            });
        }

        const newHistoryTransaction = await prisma.history_Transaction.create({
            data: {
                tanggal_waktu,
                checkout: { connect: { id: checkoutId } }
            }
        });

        return res.status(201).json({
            status: true,
            message: "History Transaction created successfully",
            data: newHistoryTransaction
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
const listHistoryTransactions = async (req, res, next) => {
    try {
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
                                                    include: {
                                                        bandara_keberangkatan: true,
                                                        bandara_kedatangan: true
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
            take: pagination.page_size,
            skip: (pagination.current_page - 1) * pagination.page_size
        });

        const data = historyTransactions.map(ht => {
            const checkout = ht.checkout;
            const order = checkout.order;
            const ticket = order.ticket;
            const schedule = ticket.schedule;
            const flight = schedule.flight;
            const departureAirport = flight.bandara_keberangkatan;
            const arrivalAirport = flight.bandara_kedatangan;
            const user = order.user;

            return {
                total_price: checkout.total,
                class: ticket.kelas,
                timestamp: checkout.tanggal_waktu,
                passenger_id: user.id,
                passenger_name: user.Profile ? user.Profile.nama : null,
                departure_airport_name: departureAirport.nama_bandara,
                arrival_airport_name: arrivalAirport.nama_bandara
            };
        });

        res.status(200).json({
            status: true,
            message: 'History Transactions retrieved successfully',
            data: data,
        });
    } catch (error) {
        next(error);
    }
}
/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const getHistoryTransaction = async (req, res, next) => {
    const historyTransactionId = Number(req.params.id);

    try {
        const historyTransaction = await prisma.history_Transaction.findUnique({
            where: { id: historyTransactionId },
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
                                                    include: {
                                                        bandara_keberangkatan: true,
                                                        bandara_kedatangan: true
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
        const order = checkout.order;
        const ticket = order.ticket;
        const schedule = ticket.schedule;
        const flight = schedule.flight;
        const departureAirport = flight.bandara_keberangkatan;
        const arrivalAirport = flight.bandara_kedatangan;
        const user = order.user;

        const data = {
            total_price: checkout.total,
            class: ticket.kelas,
            timestamp: checkout.tanggal_waktu,
            passenger_id: user.id,
            passenger_name: user.Profile ? user.Profile.nama : null,
            departure_airport_name: departureAirport.nama_bandara,
            arrival_airport_name: arrivalAirport.nama_bandara
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


/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const updateHistoryTransaction = async (req, res, next) => {
    const historyTransactionId = Number(req.params.id);
    const { tanggal_waktu, checkoutId } = req.body;

    try {
        const updatedHistoryTransaction = await prisma.history_Transaction.update({
            where: { id: historyTransactionId },
            data: {
                tanggal_waktu,
                checkout: { connect: { id: checkoutId } }
            }
        });

        return res.status(200).json({
            status: true,
            message: "History Transaction updated successfully",
            data: updatedHistoryTransaction
        });
    } catch (error) {
        next(error);
    }
};

const deleteHistoryTransaction = async (req, res, next) => {
    const historyTransactionId = Number(req.params.id);

    try {
        await prisma.history_Transaction.delete({
            where: { id: historyTransactionId }
        });

        return res.status(200).json({
            status: true,
            message: "History Transaction deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createHistoryTransaction,
    listHistoryTransactions,
    getHistoryTransaction,
    updateHistoryTransaction,
    deleteHistoryTransaction
};
