const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const path = require("path");
const imagekit = require("../middlewares/middleware").imagekit;

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const profile = async (req, res, next) => {
    try {
        const users = await prisma.profile.findUnique({
            where: {
                id: req.user.id
            }
        });

        delete users.password;

        return res.status(200).json({
            status: true,
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
    const { nama, tanggal_lahir, no_telp, alamat } = req.body;
    const image = req.file?.buffer?.toString("base64");

    try {
        const users = await prisma.user.findUnique({
            where: {
                id: req.user.id
            }
        }).Profile();

        const photo_profile = imagekit.upload({
            fileName: Date.now() + path.extname(req.file.originalname),
            file: image
        });

        const profile = await prisma.profile.update({
            data: {
                nama: nama ? nama : users.nama,
                tanggal_lahir: tanggal_lahir ? tanggal_lahir : users.tanggal_lahir,
                no_telp: no_telp ? no_telp : users.no_telp,
                alamat: alamat ? alamat : users.alamat,
                photo_profile: photo_profile ? photo_profile.url : users.photo_profile
            },
            where: {
                userId: users.id
            }
        });

        return res.status(200).json({
            status: true,
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
const notification = async (req, res, next) => {
    try {
        const users = await prisma.user.findUnique({
            where: {
                id: req.user.id
            }
        });

        const notifications = await prisma.notification.findMany({
            where: {
                userId: users.id
            },
            orderBy: {
                tanggal_waktu: "desc"
            }
        });

        delete users.password;

        return res.status(200).json({
            status: false,
            message: "OK",
            data: notifications
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    profile,
    updateProfile,
    notification
};
