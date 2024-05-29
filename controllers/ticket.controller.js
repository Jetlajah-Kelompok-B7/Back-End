const { PrismaClient } = require('@prisma/client')
const { paginationUtils } = require('../utils/pagination')
const prisma = new PrismaClient()

module.exports = {
    getAllTickets: async (req, res, next) => {
        try {

            const { bandara_keberangkatan, bandara_kedatangan, tanggal_pergi, tanggal_pulang, kelas } = req.query;
    
            const ticketsTotal = await prisma.ticket.count({
                where: {
                    schedule: {
                        flight: {
                            status: "Ready"
                        }
                    }
                }
            })

            const pagination = paginationUtils(req.query.page, req.query.page_size, ticketsTotal)

            let tickets = await prisma.ticket.findMany({
                where: {
                    kelas: kelas,
                    schedule: {
                        flight: {
                            status: "Ready",
                            bandara_keberangkatan: {
                                kode_bandara: bandara_keberangkatan
                            },
                            bandara_kedatangan: {
                                kode_bandara: bandara_kedatangan
                            }
                        },
                        keberangkatan: tanggal_pergi,
                        kedatangan: tanggal_pulang
                    }
                },
                select: {
                    kelas: true,
                    price: true,
                    schedule: {
                        select: {
                            keberangkatan: true,
                            kedatangan: true,
                            flight: {
                                select: {
                                    bandara_keberangkatan: true,
                                    bandara_kedatangan: true,
                                    terminal_keberangkatan: true,
                                    status: true,
                                    Transit: {
                                        select: {
                                            airport: {
                                                select: {
                                                    nama_bandara: true,
                                                    kode_bandara: true,
                                                    lokasi: true
                                                }
                                            }
                                        }
                                    },
                                    Plane: { 
                                        select: {
                                            kode_pesawat: true,
                                            model_pesawat: true,
                                            bagasi_kabin: true,
                                            bagasi: true,
                                            jarak_kursi: true,
                                            jumlah_kursi: true,
                                            Airline: {
                                                select: {
                                                    kode_maskapai: true,
                                                    nama_maskapai: true,
                                                    logo_maskapai: true
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
            })

            const data = tickets.map(ticket => {
                return {
                    class: ticket.kelas,
                    price: ticket.price,
                    status: ticket.schedule.flight.status,
                    schedule: {
                        takeoff: {
                            time: ticket.schedule.keberangkatan,
                            airport_code: ticket.schedule.flight.bandara_keberangkatan.kode_bandara,
                            airport_name: ticket.schedule.flight.bandara_keberangkatan.nama_bandara,

                        },
                        landing: {
                            time: ticket.schedule.kedatangan,
                            airport_code: ticket.schedule.flight.bandara_kedatangan.kode_bandara,
                            airport_name: ticket.schedule.flight.bandara_kedatangan.nama_bandara
                        },
                        transit: ticket.schedule.flight.Transit.map(transit => {
                            return {
                                airport_code: transit.airport.kode_bandara,
                                airport_name: transit.airport.nama_bandara,
                                location: transit.airport.lokasi
                            }
                        })
                    },
                    plane: {
                        airline_name: ticket.schedule.flight.Plane.Airline.nama_maskapai,
                        code: ticket.schedule.flight.Plane.kode_pesawat,
                        model: ticket.schedule.flight.Plane.model_pesawat,
                        baggage: ticket.schedule.flight.Plane.bagasi,
                        cabin_baggage: ticket.schedule.flight.Plane.bagasi_kabin,
                    }
                }
            })

            res.status(200).json({
                status: true,
                message: 'Tickets retrieved successfully',
                data: data,
            })
        } catch (error) {
            next(error)
        }
    }
}