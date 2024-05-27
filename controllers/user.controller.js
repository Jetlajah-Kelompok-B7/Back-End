const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const profile = async (req, res, next) => {
    try {
        const users = await prisma.user.findUnique({
            where: {
                id: req.user.id
            }
        });

        delete users.password;

        return res.status(200).json({
            status: 200,
            message: "OK",
            data: users
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
const updateProfile = async (req, res, next) => {
    const { nama, tanggal_lahir, no_telp, alamat, photo_profile, pin } = req.body;
    try {
        const users = await prisma.user.findUnique({
            where: {
                id: req.user.id
            }
        }).Profile();

        const profile = await prisma.profile.update({
            data: {
                nama: nama ? nama : users.nama,
                tanggal_lahir: tanggal_lahir ? tanggal_lahir : users.tanggal_lahir,
                no_telp: no_telp ? no_telp : users.no_telp,
                alamat: alamat ? alamat : users.alamat,
                photo_profile: photo_profile ? photo_profile : users.photo_profile,
                pin: pin ? pin : users.pin
            },
            where: {
                userId: users.id
            }
        });

        return res.status(200).json({
            status: 200,
            message: "OK",
            data: profile
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
const pinValidation = async (req, res, next) => {
    try {
        const { pin } = req.body;

        if (!pin) {
            return res.status(400).json({
                status: 400,
                message: "Bad Request"
            });
        }

        const users = await prisma.user.findUnique({
            where: {
                id: req.user.id
            }
        }).Profile();

        if (users.pin !== Number(pin)) {
            return res.status(401).json({
                status: 401,
                message: "Unauthorized"
            });
        }

        return res.status(200).json({
            status: 200,
            message: "OK"
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
const forgotPin = async (req, res, next) => {
    try {
        const { password, pin } = req.body;
        const users = await prisma.user.findUnique({
            where: {
                id: req.user.id
            }
        });

        const passwordCorrect = bcrypt.compare(password, users.password);

        if (!passwordCorrect) {
            return res.status(401).send({
                status: 401,
                message: "Unauthorized"
            });
        }

        const usersPin = await prisma.profile.update({
            data: {
                pin: pin
            },
            where: {
                id: users.id
            }
        });

        return res.status(201).json({
            status: 201,
            message: "Created",
            data: usersPin.pin
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
const notification = async (req, res, next) => {
    try {
        const users = await prisma.user.findUnique({
            where: {
                id: req.user.id
            }
        });

        const notifications = await prisma.notification.findMany({
            where: {
                id: users.id
            },
            orderBy: {
                tanggal_waktu: "desc"
            }
        });

        delete users.password;

        return res.status(200).json({
            status: 200,
            message: "OK",
            data: [...notifications]
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    profile,
    updateProfile,
    notification,
    forgotPin,
    pinValidation
};
