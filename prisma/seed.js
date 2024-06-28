const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

(async () => {

    const password = await bcrypt.hash("password123", 10);
    const currentDate = new Date();
    const newDate = new Date(currentDate);
    const tomorrow = new Date(newDate.setDate(currentDate.getDate() + 1));
    const nextWeek = new Date(newDate.setDate(currentDate.getDate() + 7));

    const millisecondsToAdd = (1 * 60 * 60 * 1000) + (25 * 60 * 1000);
    const newTimestamp = newDate.getTime() + millisecondsToAdd;
    newDate.setTime(newTimestamp);

    const newTimestampTomorrow = tomorrow.getTime() + millisecondsToAdd;
    const arriveAt = new Date(newTimestamp);
    const arriveAtTomorrow = new Date(newTimestampTomorrow);

    const admin = await prisma.user.upsert({
        where: {
            email: "admin@gmail.com"
        },
        update: {},
        create: {
            role: "ADMIN",
            email: "admin@gmail.com",
            password: password,
            Profile: {
                create: {
                    nama: "admin",
                    no_telp: "081234567890"
                }
            }
        }
    });

    const user = await prisma.user.upsert({
        where: {
            email: "user1@gmail.com"
        },
        update: {},
        create: {
            role: "USER",
            email: "user1@gmail.com",
            password: password,
            Profile: {
                create: {
                    nama: "user",
                    no_telp: "081234567890"
                }
            },
            Notification: {
                create: {
                    judul: "Berhasil Register",
                    deskripsi: "Selamat datang user",
                    tanggal_waktu: new Date(),
                    kategori: "INFO"
                }
            }
        }
    });

    const tangerang = await prisma.airport.upsert({
        where: {
            kode_bandara: "CGK"
        },
        update: {},
        create: {
            kode_bandara: "CGK",
            nama_bandara: "Soekarno-Hatta International Airport",
            lokasi: "Tangerang, Indonesia"
        }
    });

    const denpasar = await prisma.airport.upsert({
        where: {
            kode_bandara: "DPS"
        },
        update: {},
        create: {
            kode_bandara: "DPS",
            nama_bandara: "Ngurah Rai International Airport",
            lokasi: "Denpasar, Indonesia"
        }
    });

    const surabaya = await prisma.airport.upsert({
        where: {
            kode_bandara: "SUB"
        },
        update: {},
        create: {
            kode_bandara: "SUB",
            nama_bandara: "Juanda International Airport",
            lokasi: "Surabaya, Indonesia"
        }
    });

    const jakarta = await prisma.airport.upsert({
        where: { kode_bandara: "HLP" },
        update: {},
        create: {
            kode_bandara: "HLP",
            nama_bandara: "Halim Perdanakusuma International Airport",
            lokasi: "Jakarta, Indonesia"
        }
    });

    // Additional 10 airports
    const airports = [
        { kode_bandara: "BDO", nama_bandara: "Husein Sastranegara International Airport", lokasi: "Bandung, Indonesia" },
        { kode_bandara: "YIA", nama_bandara: "Yogyakarta International Airport", lokasi: "Kulon Progo, Indonesia" },
        { kode_bandara: "UPG", nama_bandara: "Sultan Hasanuddin International Airport", lokasi: "Makassar, Indonesia" },
        { kode_bandara: "BTH", nama_bandara: "Hang Nadim International Airport", lokasi: "Batam, Indonesia" },
        { kode_bandara: "JOG", nama_bandara: "Adisutjipto International Airport", lokasi: "Yogyakarta, Indonesia" },
        { kode_bandara: "PNK", nama_bandara: "Supadio International Airport", lokasi: "Pontianak, Indonesia" },
        { kode_bandara: "SRG", nama_bandara: "Achmad Yani International Airport", lokasi: "Semarang, Indonesia" },
        { kode_bandara: "MDC", nama_bandara: "Sam Ratulangi International Airport", lokasi: "Manado, Indonesia" },
        { kode_bandara: "BTJ", nama_bandara: "Sultan Iskandar Muda International Airport", lokasi: "Banda Aceh, Indonesia" },
        { kode_bandara: "BPN", nama_bandara: "Sultan Aji Muhammad Sulaiman Airport", lokasi: "Balikpapan, Indonesia" }
    ];

    for (const airport of airports) {
        await prisma.airport.upsert({
            where: { kode_bandara: airport.kode_bandara },
            update: {},
            create: airport
        });
    }

    const airAsia = await prisma.airline.upsert({
        where: {
            kode_maskapai: "AK"
        },
        update: {},
        create: {
            kode_maskapai: "AK",
            nama_maskapai: "Air Asia",
            logo_maskapai: "https://ik.imagekit.io/tvlk/image/imageResource/2022/09/05/1662367239331-9fca504de7049b772dd2386631705024.png?tr=q-75",
            planes: {
                create: [{
                    kode_pesawat: "AK001",
                    model_pesawat: "Airbus A320-200",
                    bagasi_kabin: 7,
                    bagasi: 20,
                    jarak_kursi: 29,
                    jumlah_kursi: 140,
                    status: "Boarding",
                    Flight: {
                        create: {
                            bandara_keberangkatan_id: tangerang.id,
                            bandara_kedatangan_id: denpasar.id,
                            terminal_keberangkatan: "3C",
                            terminal_kedatangan: "2A",
                            status: "Boarding",
                            Transit: {
                                create: {
                                    airportId: surabaya.id
                                }
                            },
                            Schedule: {
                                create: {
                                    keberangkatan: nextWeek,
                                    kedatangan: arriveAt,
                                    Ticket: {
                                        create: [
                                            {
                                                kelas: "Economy",
                                                harga: 1000000,
                                                jumlah: 47,
                                                Order: {
                                                    create: [
                                                        {
                                                            userId: user.id,
                                                            Orders: {
                                                                create: [
                                                                    {
                                                                        nama: "Zabil",
                                                                        tanggal_lahir: "2003-05-10",
                                                                        kewarganegaraan: "Indonesia",
                                                                        ktp_pasport: "1234567890",
                                                                        negara_penerbit: "Indonesia",
                                                                        berlaku_sampai: new Date(currentDate.getTime() + (1 * 60 * 60 * 1000)),
                                                                        no_kursi: 1,
                                                                        is_baby: false
                                                                    },
                                                                    {
                                                                        nama: "Balya",
                                                                        tanggal_lahir: "2003-10-05",
                                                                        kewarganegaraan: "Indonesia",
                                                                        ktp_pasport: "2234567890",
                                                                        negara_penerbit: "Indonesia",
                                                                        berlaku_sampai: new Date(currentDate.getTime() + (1 * 60 * 60 * 1000)),
                                                                        no_kursi: 2,
                                                                        is_baby: false
                                                                    },
                                                                    {
                                                                        nama: "Hanafi",
                                                                        tanggal_lahir: "2004-02-11",
                                                                        kewarganegaraan: "Indonesia",
                                                                        ktp_pasport: "4234567890",
                                                                        negara_penerbit: "Indonesia",
                                                                        berlaku_sampai: new Date(currentDate.getTime() + (1 * 60 * 60 * 1000)),
                                                                        no_kursi: 3,
                                                                        is_baby: false
                                                                    }
                                                                ]
                                                            },
                                                            Checkout: {
                                                                create: {
                                                                    metode_pembayaran: "GOPAY",
                                                                    is_payment: false,
                                                                    total: 1300000,
                                                                    tanggal_waktu: currentDate
                                                                }
                                                            }
                                                        }
                                                    ]
                                                }
                                            },
                                            {
                                                kelas: "Business",
                                                harga: 2000000,
                                                jumlah: 47,
                                                Order: {
                                                    create: [
                                                        {
                                                            userId: user.id,
                                                            Orders: {
                                                                create: [
                                                                    {
                                                                        nama: "Hilzi",
                                                                        tanggal_lahir: "2003-05-10",
                                                                        kewarganegaraan: "Indonesia",
                                                                        ktp_pasport: "1234567890",
                                                                        negara_penerbit: "Indonesia",
                                                                        berlaku_sampai: new Date(currentDate.getTime() + (1 * 60 * 60 * 1000)),
                                                                        no_kursi: 1,
                                                                        is_baby: false
                                                                    },
                                                                    {
                                                                        nama: "Andika",
                                                                        tanggal_lahir: "2003-10-05",
                                                                        kewarganegaraan: "Indonesia",
                                                                        ktp_pasport: "2234567890",
                                                                        negara_penerbit: "Indonesia",
                                                                        berlaku_sampai: new Date(currentDate.getTime() + (1 * 60 * 60 * 1000)),
                                                                        no_kursi: 2,
                                                                        is_baby: false
                                                                    },
                                                                    {
                                                                        nama: "Rizal",
                                                                        tanggal_lahir: "2004-02-11",
                                                                        kewarganegaraan: "Indonesia",
                                                                        ktp_pasport: "4234567890",
                                                                        negara_penerbit: "Indonesia",
                                                                        berlaku_sampai: new Date(currentDate.getTime() + (1 * 60 * 60 * 1000)),
                                                                        no_kursi: 3,
                                                                        is_baby: false
                                                                    }
                                                                ]
                                                            },
                                                            Checkout: {
                                                                create: {
                                                                    metode_pembayaran: "GOPAY",
                                                                    is_payment: true,
                                                                    total: 2300000,
                                                                    tanggal_waktu: currentDate,
                                                                    History_Transaction: {
                                                                        create: {}
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    ]

                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }]
            }
        }
    });

    const pelitaAir = await prisma.airline.upsert({
        where: {
            kode_maskapai: "6D"
        },
        update: {},
        create: {
            kode_maskapai: "6D",
            nama_maskapai: "Pelita Air",
            logo_maskapai: "https://ik.imagekit.io/tvlk/image/imageResource/2022/06/17/1655443880079-cbc17b9b0017fcffca1e294e9165c791.png?tr=q-75",
            planes: {
                create: [{
                    kode_pesawat: "6D001",
                    model_pesawat: "Boeing 737-800",
                    bagasi_kabin: 7,
                    bagasi: 15,
                    jarak_kursi: 31,
                    jumlah_kursi: 215,
                    status: "Ready",
                    Flight: {
                        create: {
                            bandara_keberangkatan_id: tangerang.id,
                            bandara_kedatangan_id: surabaya.id,
                            terminal_keberangkatan: "1B",
                            terminal_kedatangan: "D",
                            status: "Ready",
                            Transit: {
                                create: {
                                    airportId: denpasar.id
                                }
                            },
                            Schedule: {
                                create: {
                                    keberangkatan: tomorrow,
                                    kedatangan: arriveAtTomorrow,
                                    Ticket: {
                                        create: [
                                            {
                                                kelas: "Economy",
                                                harga: 1200000,
                                                jumlah: 100,
                                                Order: {
                                                    create: [
                                                        {
                                                            userId: user.id,
                                                            Orders: {
                                                                create: [
                                                                    {
                                                                        nama: "Alif",
                                                                        tanggal_lahir: "2001-01-15",
                                                                        kewarganegaraan: "Indonesia",
                                                                        ktp_pasport: "5234567890",
                                                                        negara_penerbit: "Indonesia",
                                                                        berlaku_sampai: new Date(tomorrow.getTime() + (1 * 60 * 60 * 1000)),
                                                                        no_kursi: 1,
                                                                        is_baby: false
                                                                    },
                                                                    {
                                                                        nama: "Budi",
                                                                        tanggal_lahir: "2002-05-20",
                                                                        kewarganegaraan: "Indonesia",
                                                                        ktp_pasport: "6234567890",
                                                                        negara_penerbit: "Indonesia",
                                                                        berlaku_sampai: new Date(tomorrow.getTime() + (1 * 60 * 60 * 1000)),
                                                                        no_kursi: 2,
                                                                        is_baby: false
                                                                    },
                                                                    {
                                                                        nama: "Citra",
                                                                        tanggal_lahir: "2003-08-30",
                                                                        kewarganegaraan: "Indonesia",
                                                                        ktp_pasport: "7234567890",
                                                                        negara_penerbit: "Indonesia",
                                                                        berlaku_sampai: new Date(tomorrow.getTime() + (1 * 60 * 60 * 1000)),
                                                                        no_kursi: 3,
                                                                        is_baby: false
                                                                    }
                                                                ]
                                                            },
                                                            Checkout: {
                                                                create: {
                                                                    metode_pembayaran: "OVO",
                                                                    is_payment: false,
                                                                    total: 3600000,
                                                                    tanggal_waktu: currentDate
                                                                }
                                                            }
                                                        }
                                                    ]
                                                }
                                            },
                                            {
                                                kelas: "Business",
                                                harga: 2500000,
                                                jumlah: 25,
                                                Order: {
                                                    create: [
                                                        {
                                                            userId: user.id,
                                                            Orders: {
                                                                create: [
                                                                    {
                                                                        nama: "Diana",
                                                                        tanggal_lahir: "1998-07-25",
                                                                        kewarganegaraan: "Indonesia",
                                                                        ktp_pasport: "8234567890",
                                                                        negara_penerbit: "Indonesia",
                                                                        berlaku_sampai: new Date(tomorrow.getTime() + (1 * 60 * 60 * 1000)),
                                                                        no_kursi: 1,
                                                                        is_baby: false
                                                                    },
                                                                    {
                                                                        nama: "Eka",
                                                                        tanggal_lahir: "2000-12-05",
                                                                        kewarganegaraan: "Indonesia",
                                                                        ktp_pasport: "9234567890",
                                                                        negara_penerbit: "Indonesia",
                                                                        berlaku_sampai: new Date(tomorrow.getTime() + (1 * 60 * 60 * 1000)),
                                                                        no_kursi: 2,
                                                                        is_baby: false
                                                                    },
                                                                    {
                                                                        nama: "Fikri",
                                                                        tanggal_lahir: "1999-03-10",
                                                                        kewarganegaraan: "Indonesia",
                                                                        ktp_pasport: "1034567890",
                                                                        negara_penerbit: "Indonesia",
                                                                        berlaku_sampai: new Date(tomorrow.getTime() + (1 * 60 * 60 * 1000)),
                                                                        no_kursi: 3,
                                                                        is_baby: false
                                                                    }
                                                                ]
                                                            },
                                                            Checkout: {
                                                                create: {
                                                                    metode_pembayaran: "OVO",
                                                                    is_payment: true,
                                                                    total: 7500000,
                                                                    tanggal_waktu: tomorrow,
                                                                    History_Transaction: {
                                                                        create: {}
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }]
            }
        }
    });

})();
