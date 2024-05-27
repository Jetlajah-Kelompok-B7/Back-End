const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

(async () => {

    const password = await bcrypt.hash("password123", 10);
    const currentDate = new Date();
    const newDate = new Date(currentDate);
    const nextWeek = new Date(newDate.setDate(currentDate.getDate() + 7));

    const millisecondsToAdd = (1 * 60 * 60 * 1000) + (25 * 60 * 1000);
    const newTimestamp = newDate.getTime() + millisecondsToAdd;
    newDate.setTime(newTimestamp);

    const arriveAt = new Date(newTimestamp);
    
    const admin = await prisma.user.upsert({
        where: {
            email: `admin@gmail.com`
        },
        update: {},
        create: {
            role: "ADMIN",
            email: `admin@gmail.com`,
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
            email: `user1@gmail.com`
        },
        update: {},
        create: {
            role: "USER",
            email: `user1@gmail.com`,
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
                    deskripsi: `Selamat datang user`,
                    tanggal_waktu: new Date(),
                    kategori: "INFO"
                }
            }
        }
    });

    const tangerang = await prisma.airport.upsert({
        where: {
            kode_bandara: `CGK`
        },
        update: {},
        create: {
            kode_bandara: `CGK`,
            nama_bandara: `Soekarno-Hatta International Airport`,
            lokasi: `Tangerang, Indonesia`,
        }
    });

    const denpasar = await prisma.airport.upsert({
        where: {
            kode_bandara: `DPS`
        },
        update: {},
        create: {
            kode_bandara: `DPS`,
            nama_bandara: `Ngurah Rai International Airport`,
            lokasi: `Denpasar, Indonesia`,
        }
    });

    const surabaya = await prisma.airport.upsert({
        where: {
            kode_bandara: `SUB`
        },
        update: {},
        create: {
            kode_bandara: `SUB`,
            nama_bandara: `Juanda International Airport`,
            lokasi: `Surabaya, Indonesia`,
        }
    });

    const airAsia = await prisma.airline.upsert({
        where: {
            kode_maskapai: `AK`
        },
        update: {},
        create: {
            kode_maskapai: `AK`,
            nama_maskapai: `Air Asia`,
            logo_maskapai: "https://ik.imagekit.io/tvlk/image/imageResource/2022/09/05/1662367239331-9fca504de7049b772dd2386631705024.png?tr=q-75",
            planes: {
                create: [{
                    kode_pesawat: `AK001`,
                    model_pesawat: `Airbus A320-200`,
                    bagasi_kabin: 7,
                    bagasi: 20,
                    jarak_kursi: 29,
                    jumlah_kursi: 140,
                    status: `Boarding`,
                    Flight: {
                        create: {
                            bandara_keberangkatan_id: tangerang.id,
                            bandara_kedatangan_id: denpasar.id,
                            terminal_keberangkatan: `3C`,
                            terminal_kedatangan: `2A`,
                            status: `Boarding`,
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
                                        create:[
                                            {
                                                kelas: 'Economy',
                                                price: 1000000,
                                                Order: {
                                                    create:[
                                                        {
                                                            userId: user.id,
                                                            nama: "Zabil",
                                                            tanggal_lahir: "2003-05-10",
                                                            kewarganegaraan: "Indonesia",
                                                            ktp_pasport: "1234567890",
                                                            negara_penerbit: "Indonesia",
                                                            berlaku_sampai: new Date(currentDate.getTime() + (1 * 60 * 60 * 1000)),
                                                            no_kursi: 1,
                                                            is_baby: false,
                                                            Checkout: {
                                                                create: {
                                                                    metode_pembayaran: "GOPAY",
                                                                    is_payment: false,
                                                                    total: 1300000,
                                                                    tanggal_waktu: currentDate,
                                                                }
                                                            }
                                                        },
                                                        {
                                                            userId: user.id,
                                                            nama: "Balya",
                                                            tanggal_lahir: "2003-10-05",
                                                            kewarganegaraan: "Indonesia",
                                                            ktp_pasport: "2234567890",
                                                            negara_penerbit: "Indonesia",
                                                            berlaku_sampai: new Date(currentDate.getTime() + (1 * 60 * 60 * 1000)),
                                                            no_kursi: 2,
                                                            is_baby: false,
                                                            Checkout: {
                                                                create: {
                                                                    metode_pembayaran: "GOPAY",
                                                                    is_payment: false,
                                                                    total: 1300000,
                                                                    tanggal_waktu: currentDate,
                                                                }
                                                            }
                                                        },
                                                        {
                                                            userId: user.id,
                                                            nama: "Hanafi",
                                                            tanggal_lahir: "2004-02-11",
                                                            kewarganegaraan: "Indonesia",
                                                            ktp_pasport: "4234567890",
                                                            negara_penerbit: "Indonesia",
                                                            berlaku_sampai: new Date(currentDate.getTime() + (1 * 60 * 60 * 1000)),
                                                            no_kursi: 3,
                                                            is_baby: false,
                                                            Checkout: {
                                                                create: {
                                                                    metode_pembayaran: "GOPAY",
                                                                    is_payment: false,
                                                                    total: 1300000,
                                                                    tanggal_waktu: currentDate,
                                                                }
                                                            }
                                                        }
                                                    ]
                                                }
                                            },
                                            {
                                                kelas: 'Business',
                                                price: 2000000,
                                                Order: {
                                                    create:[
                                                        {
                                                            userId: user.id,
                                                            nama: "Hilzi",
                                                            tanggal_lahir: "2003-05-10",
                                                            kewarganegaraan: "Indonesia",
                                                            ktp_pasport: "1234567890",
                                                            negara_penerbit: "Indonesia",
                                                            berlaku_sampai: new Date(currentDate.getTime() + (1 * 60 * 60 * 1000)),
                                                            no_kursi: 1,
                                                            is_baby: false,
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
                                                        },
                                                        {
                                                            userId: user.id,
                                                            nama: "Andika",
                                                            tanggal_lahir: "2003-10-05",
                                                            kewarganegaraan: "Indonesia",
                                                            ktp_pasport: "2234567890",
                                                            negara_penerbit: "Indonesia",
                                                            berlaku_sampai: new Date(currentDate.getTime() + (1 * 60 * 60 * 1000)),
                                                            no_kursi: 2,
                                                            is_baby: false,
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
                                                        },
                                                        {
                                                            userId: user.id,
                                                            nama: "Rizal",
                                                            tanggal_lahir: "2004-02-11",
                                                            kewarganegaraan: "Indonesia",
                                                            ktp_pasport: "4234567890",
                                                            negara_penerbit: "Indonesia",
                                                            berlaku_sampai: new Date(currentDate.getTime() + (1 * 60 * 60 * 1000)),
                                                            no_kursi: 3,
                                                            is_baby: false,
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
                },
                {
                    kode_pesawat: `AK002`,
                    model_pesawat: `Airbus A320-200`,
                    bagasi_kabin: 7,
                    bagasi: 20,
                    jarak_kursi: 29,
                    jumlah_kursi: 140,
                    status: `Delayed`,
                    Flight: {
                        create: {
                            bandara_keberangkatan_id: surabaya.id,
                            bandara_kedatangan_id: tangerang.id,
                            terminal_keberangkatan: `6A`,
                            terminal_kedatangan: `1A`,
                            status: `Boarding`,
                            Schedule: {
                                create: {
                                    keberangkatan: nextWeek,
                                    kedatangan: arriveAt,
                                    Ticket: {
                                        create:[
                                            {
                                                kelas: 'Economy',
                                                price: 1000000,
                                                Order: {
                                                    create:[
                                                        {
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                }
                                            },
                                            {
                                                kelas: 'Business',
                                                price: 2000000,
                                                Order: {
                                                    create:[
                                                        {
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    kode_pesawat: `AK003`,
                    model_pesawat: `Airbus A320-200`,
                    bagasi_kabin: 7,
                    bagasi: 20,
                    jarak_kursi: 29,
                    jumlah_kursi: 140,
                    status: `Cancelled`,
                    Flight: {
                        create: {
                            bandara_keberangkatan_id: denpasar.id,
                            bandara_kedatangan_id: surabaya.id,
                            terminal_keberangkatan: `3D`,
                            terminal_kedatangan: `2A`,
                            status: `Boarding`,
                            Schedule: {
                                create: {
                                    keberangkatan: nextWeek,
                                    kedatangan: arriveAt,
                                    Ticket: {
                                        create:[
                                            {
                                                kelas: 'Economy',
                                                price: 1000000,
                                                Order: {
                                                    create:[
                                                        {
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                }
                                            },
                                            {
                                                kelas: 'Business',
                                                price: 2000000,
                                                Order: {
                                                    create:[
                                                        {
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    kode_pesawat: `AK004`,
                    model_pesawat: `Airbus A320-200`,
                    bagasi_kabin: 7,
                    bagasi: 20,
                    jarak_kursi: 29,
                    jumlah_kursi: 140,
                    status: `Arrived`,
                    Flight: {
                        create: {
                            bandara_keberangkatan_id: denpasar.id,
                            bandara_kedatangan_id: tangerang.id,
                            terminal_keberangkatan: `2A`,
                            terminal_kedatangan: `1A`,
                            status: `Boarding`,
                            Schedule: {
                                create: {
                                    keberangkatan: nextWeek,
                                    kedatangan: arriveAt,
                                    Ticket: {
                                        create:[
                                            {
                                                kelas: 'Economy',
                                                price: 1000000,
                                                Order: {
                                                    create:[
                                                        {
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                }
                                            },
                                            {
                                                kelas: 'Business',
                                                price: 2000000,
                                                Order: {
                                                    create:[
                                                        {
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                            userId: user.id,
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
            kode_maskapai: `6D`
        },
        update: {},
        create: {
            kode_maskapai: `6D`,
            nama_maskapai: `Pelita Air`,
            logo_maskapai: "https://ik.imagekit.io/tvlk/image/imageResource/2022/06/17/1655443880079-cbc17b9b0017fcffca1e294e9165c791.png?tr=q-75",
            planes: {
                create: [{
                    kode_pesawat: `6D001`,
                    model_pesawat: `Boeing 737-800`,
                    bagasi_kabin: 7,
                    bagasi: 20,
                    jarak_kursi: 29,
                    jumlah_kursi: 140,
                    status: `Boarding`,
                    Flight: {
                        create: {
                            bandara_keberangkatan_id: denpasar.id,
                            bandara_kedatangan_id: tangerang.id,
                            terminal_keberangkatan: `2F`,
                            terminal_kedatangan: `1A`,
                            status: `Boarding`,
                            Schedule: {
                                create: {
                                    keberangkatan: nextWeek,
                                    kedatangan: arriveAt,
                                    Ticket: {
                                        create:[
                                            {
                                                kelas: 'Economy',
                                                price: 1000000,
                                                Order: {
                                                    create:[
                                                        {
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                }
                                            },
                                            {
                                                kelas: 'Business',
                                                price: 2000000,
                                                Order: {
                                                    create:[
                                                        {
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    kode_pesawat: `6D002`,
                    model_pesawat: `Boeing 737-800`,
                    bagasi_kabin: 7,
                    bagasi: 20,
                    jarak_kursi: 29,
                    jumlah_kursi: 140,
                    status: `Delayed`,
                    Flight: {
                        create: {
                            bandara_keberangkatan_id: surabaya.id,
                            bandara_kedatangan_id: denpasar.id,
                            terminal_keberangkatan: `2C`,
                            terminal_kedatangan: `4B`,
                            status: `Boarding`,
                            Schedule: {
                                create: {
                                    keberangkatan: nextWeek,
                                    kedatangan: arriveAt,
                                    Ticket: {
                                        create:[
                                            {
                                                kelas: 'Economy',
                                                price: 1000000,
                                                Order: {
                                                    create:[
                                                        {
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                }
                                            },
                                            {
                                                kelas: 'Business',
                                                price: 2000000,
                                                Order: {
                                                    create:[
                                                        {
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    kode_pesawat: `6D003`,
                    model_pesawat: `Boeing 737-800`,
                    bagasi_kabin: 7,
                    bagasi: 20,
                    jarak_kursi: 29,
                    jumlah_kursi: 140,
                    status: `Cancelled`,
                    Flight: {
                        create: {
                            bandara_keberangkatan_id: surabaya.id,
                            bandara_kedatangan_id: denpasar.id,
                            terminal_keberangkatan: `2A`,
                            terminal_kedatangan: `3C`,
                            status: `Boarding`,
                            Schedule: {
                                create: {
                                    keberangkatan: nextWeek,
                                    kedatangan: arriveAt,
                                    Ticket: {
                                        create:[
                                            {
                                                kelas: 'Economy',
                                                price: 1000000,
                                                Order: {
                                                    create:[
                                                        {
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                }
                                            },
                                            {
                                                kelas: 'Business',
                                                price: 2000000,
                                                Order: {
                                                    create:[
                                                        {
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    kode_pesawat: `6D004`,
                    model_pesawat: `Boeing 737-800`,
                    bagasi_kabin: 7,
                    bagasi: 20,
                    jarak_kursi: 29,
                    jumlah_kursi: 140,
                    status: `Arrived`,
                    Flight: {
                        create: {
                            bandara_keberangkatan_id: tangerang.id,
                            bandara_kedatangan_id: surabaya.id,
                            terminal_keberangkatan: `7C`,
                            terminal_kedatangan: `3B`,
                            status: `Boarding`,
                            Schedule: {
                                create: {
                                    keberangkatan: nextWeek,
                                    kedatangan: arriveAt,
                                    Ticket: {
                                        create:[
                                            {
                                                kelas: 'Economy',
                                                price: 1000000,
                                                Order: {
                                                    create:[
                                                        {
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                }
                                            },
                                            {
                                                kelas: 'Business',
                                                price: 2000000,
                                                Order: {
                                                    create:[
                                                        {
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                            userId: user.id,
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

    const sriwijayaAir = await prisma.airline.upsert({
        where: {
            kode_maskapai: `SJ`
        },
        update: {},
        create: {
            kode_maskapai: `SJ`,
            nama_maskapai: `Sriwijaya Air`,
            logo_maskapai: "https://ik.imagekit.io/tvlk/image/imageResource/2019/12/12/1576139484141-e3bb88cae8d9f1f89d9b3d1b8788c450.png?tr=q-75",
            planes: {
                create: [{
                    kode_pesawat: `6D001`,
                    model_pesawat: `Boeing 737-800`,
                    bagasi_kabin: 7,
                    bagasi: 20,
                    jarak_kursi: 29,
                    jumlah_kursi: 140,
                    status: `Boarding`,
                    Flight: {
                        create: {
                            bandara_keberangkatan_id: tangerang.id,
                            bandara_kedatangan_id: surabaya.id,
                            terminal_keberangkatan: `4A`,
                            terminal_kedatangan: `6A`,
                            status: `Boarding`,
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
                                        create:[
                                            {
                                                kelas: 'Economy',
                                                price: 1000000,
                                                Order: {
                                                    create:[
                                                        {
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                }
                                            },
                                            {
                                                kelas: 'Business',
                                                price: 2000000,
                                                Order: {
                                                    create:[
                                                        {
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    kode_pesawat: `6D002`,
                    model_pesawat: `Boeing 737-800`,
                    bagasi_kabin: 7,
                    bagasi: 20,
                    jarak_kursi: 29,
                    jumlah_kursi: 140,
                    status: `Delayed`,
                    Flight: {
                        create: {
                            bandara_keberangkatan_id: tangerang.id,
                            bandara_kedatangan_id: denpasar.id,
                            terminal_keberangkatan: `2A`,
                            terminal_kedatangan: `4C`,
                            status: `Boarding`,
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
                                        create:[
                                            {
                                                kelas: 'Economy',
                                                price: 1000000,
                                                Order: {
                                                    create:[
                                                        {
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                }
                                            },
                                            {
                                                kelas: 'Business',
                                                price: 2000000,
                                                Order: {
                                                    create:[
                                                        {
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    kode_pesawat: `6D003`,
                    model_pesawat: `Boeing 737-800`,
                    bagasi_kabin: 7,
                    bagasi: 20,
                    jarak_kursi: 29,
                    jumlah_kursi: 140,
                    status: `Cancelled`,
                    Flight: {
                        create: {
                            bandara_keberangkatan_id: denpasar.id,
                            bandara_kedatangan_id: tangerang.id,
                            terminal_keberangkatan: `5A`,
                            terminal_kedatangan: `9C`,
                            status: `Boarding`,
                            Schedule: {
                                create: {
                                    keberangkatan: nextWeek,
                                    kedatangan: arriveAt,
                                    Ticket: {
                                        create:[
                                            {
                                                kelas: 'Economy',
                                                price: 1000000,
                                                Order: {
                                                    create:[
                                                        {
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                }
                                            },
                                            {
                                                kelas: 'Business',
                                                price: 2000000,
                                                Order: {
                                                    create:[
                                                        {
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    kode_pesawat: `6D004`,
                    model_pesawat: `Boeing 737-800`,
                    bagasi_kabin: 7,
                    bagasi: 20,
                    jarak_kursi: 29,
                    jumlah_kursi: 140,
                    status: `Arrived`,
                    Flight: {
                        create: {
                            bandara_keberangkatan_id: denpasar.id,
                            bandara_kedatangan_id: surabaya.id,
                            terminal_keberangkatan: `8A`,
                            terminal_kedatangan: `2D`,
                            status: `Boarding`,
                            Schedule: {
                                create: {
                                    keberangkatan: nextWeek,
                                    kedatangan: arriveAt,
                                    Ticket: {
                                        create:[
                                            {
                                                kelas: 'Economy',
                                                price: 1000000,
                                                Order: {
                                                    create:[
                                                        {
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                }
                                            },
                                            {
                                                kelas: 'Business',
                                                price: 2000000,
                                                Order: {
                                                    create:[
                                                        {
                                                            userId: user.id,
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
                                                            userId: user.id,
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
                                                            userId: user.id,
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