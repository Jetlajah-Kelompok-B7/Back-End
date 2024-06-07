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

        let photo_profile;
        if (image) {
            photo_profile = await imagekit.upload({
                fileName: Date.now() + path.extname(req.file.originalname),
                file: image
            });
        }

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

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const deleteUser = async (req, res, next) => {
    try {
        
        const id = parseInt(req.params.id);

        const users = await prisma.user.findUnique({
            where: {
                id
            }
        });

        if (!users) {
            return res.status(404).json({
                status: false,
                message: "User not found!"
            });
        }

        await prisma.user.delete({
            where: {
                id: users.id
            }
        });

        return res.status(200).json({
            status: true,
            message: "Success to delete user!"
        });
    } catch (error) {
        next(error);
    }
};

const getUsers = async (req, res, next) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                Profile: {
                    select: {
                        nama: true,
                        tanggal_lahir: true,
                        no_telp: true,
                        alamat: true,
                        photo_profile: true
                    }
                }
            }
        });

        const data = users.map(user => {
            return {
                id: user.id,
                nama: user.Profile.nama,
                email: user.email,
                tanggal_lahir: user.Profile.tanggal_lahir,
                no_telp: user.Profile.no_telp,
                alamat: user.Profile.alamat,
                photo_profile: user.Profile.photo_profile,
                role: user.role
            }
        })

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
    profile,
    updateProfile,
    notification,
    deleteUser,
    getUsers
};
