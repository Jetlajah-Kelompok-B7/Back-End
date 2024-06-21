const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllAirport = async (req, res, next) => {
    try {
        const airports = await prisma.airport.findMany();
        return res.status(200).json({
            status: true,
            message: "OK",
            data: airports
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllAirport
}