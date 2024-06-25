const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllPlane = async (req, res, next) => {
    try {
        const planes = await prisma.plane.findMany({
            include: {
                Airline: true
            }
        });

        const data = planes.map(plane => ({
            id: plane.id,
            kode_pesawat: plane.kode_pesawat,
            status: plane.status,
            maskapai: {
                nama: plane.Airline.nama_maskapai,
                kode: plane.Airline.kode_maskapai,
                logo: plane.Airline.logo_maskapai
            }
        }))

        return res.status(200).json({
            status: true,
            message: "OK",
            data: data
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllPlane
};