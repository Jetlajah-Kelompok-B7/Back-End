const { PrismaClient } = require("@prisma/client");
const { paginationUtils } = require("../utils/pagination");
const prisma = new PrismaClient();

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

            return {
                id: ht.id,
                timestamp: checkout.tanggal_waktu,
                departure_airport_name: departureAirport.nama_bandara,
                arrival_airport_name: arrivalAirport.nama_bandara,
                status: checkout.is_payment ? 'Issued' : 'Unpaid',
                flight_date: schedule.tanggal_berangkat,
                flight_time: schedule.waktu_berangkat
            };
        });

        return res.status(200).json({
            status: true,
            message: "History Transactions retrieved successfully",
            data: data,
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
        const users = await prisma.order.findUnique({
            where: {
                id: req.order.id
            }
        });

        if (!users) {
            return res.status(401).json({
                status: false,
                message: "Users not found"
            });
        }

        const historyTransaction = await prisma.history_Transaction.findUnique({
            include: {
                checkout: {
                    select:{
                        metode_pembayaran: true,
                        status: true,
                        total: true,
                        is_payment: true

                    },
                    include: {
                        order:{
                            select:{
                                nama: true,
                                no_kursi: true,
                                nama_keluarga: true
                            },
                            include: {
                                ticket:{
                                    select:{
                                        kelas: true,
                                        harga : true,
                                        bagasi: true,
                                        jumlah: true,
                                        nama: true,
                                        no_kursi: true,
                                        nama_keluarga: true
                                    },
                                    include:{
                                        schedule:{
                                            select:{
                                                keberangkatan:true,
                                                kedatangan: true
                                            },
                                            include:{
                                                flight:{
                                                    select:{
                                                        bandara_keberangkatan :true,
                                                        bandara_kedatangan: true,
                                                        terminal_keberangkatan: true,
                                                        terminal_kedatangan: true,
                                                        status: true,
                                                        keberangkatan: true,
                                                        kedatangan: true
                                                    },
                                                    include: {
                                                        Plane:{
                                                            select:{
                                                                kode_pesawat: true,
                                                                model_pesawat: true,
                                                                bagasi_kabin: true,
                                                                bagasi: true,
                                                                jarak_kursi: true,
                                                                jumlah_kursi: true,
                                                                status: true,
                                                            },
                                                            include:{
                                                                Airline:{
                                                                    select:{
                                                                        kode_maskapai: true,
                                                                        nama_maskapai: true
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
                        }
                    }
                }
            },
            where: {
                id: historyTransactionId,
                checkout: {
                    order: {
                        userId: users.id
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

        const checkout = historyTransaction;
        const order = checkout;
        const ticket = order;
        const schedule = ticket;
        const flight = schedule.flight;
        const departureAirport = flight.bandara_keberangkatan;
        const arrivalAirport = flight.bandara_kedatangan;
        const user = order.user;

        const data = {
            total_price: checkout,
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

module.exports = {
    listHistoryTransactions,
    getHistoryTransaction
};
