const { getHTML, sendEmail } = require("../libs/mailer");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const register = async (req, res, next) => {
    try {
        const { nama, email, password, no_telp } = req.body;

        if (!nama || !email || !password || !no_telp) {
            return res.status(400).json({
                status: false,
                message: "Bad Request"
            });
        }

        const exist = await prisma.user.findFirst({ where: { email: email } });

        if (exist) {
            return res.status(401).json({
                status: false,
                message: "Email has already been used"
            });
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: encryptedPassword,
                Profile: {
                    create: {
                        nama,
                        no_telp
                    }
                },
                Notification: {
                    create: {
                        judul: "Register Success",
                        deskripsi: "Welcome user!",
                        tanggal_waktu: new Date()
                    }
                }
            }
        });

        delete user.password;

        return res.status(201).json({
            status: true,
            message: "Created",
            data: user
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
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: false,
                message: "Bad Request"
            });
        }

        const user = await prisma.user.findFirst({ where: { email: email } });
        if (!user) {
            return res.status(401).json({
                status: false,
                message: "invalid email or password!"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                status: false,
                message: "invalid email or password!"
            });
        }

        delete user.password;

        const token = jwt.sign(user, process.env.JWT_SECRET);

        return res.status(200).json({
            status: true,
            message: "OK",
            data: { ...user, token }
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
const createPin = async (req, res, next) => {
    try {
        const { pin } = req.body;

        const user = await prisma.user.findFirst({ where: { email: req.user.email } });

        if (!user) {
            return res.status(401).json({
                status: false,
                message: "invalid email or password!"
            });
        }

        await prisma.profile.upsert({
            create: {
                pin
            },
            update: {
                pin
            },
            where: {
                userId: user.id
            }
        });

        return res.status(200).json({
            status: true,
            message: "OK",
            data: req.user
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
                status: false,
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
                status: false,
                message: "Unauthorized"
            });
        }

        return res.status(200).json({
            status: true,
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
                status: false,
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

        const tanggal_waktu = new Date();
        await prisma.notification.create({
            data: {
                judul: "Pin updated",
                deskripsi: "Your PIN has been updated successfully",
                tanggal_waktu,
                user: {
                    connect: {
                        id: users.id
                    }
                }
            }
        });

        return res.status(201).json({
            status: true,
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
const resetPasswordView = async (req, res, next) => {
    try {
        const token = req.query.token;
        if (!token) {
            return res.status(401).send("Please provide query token!");
        }
        res.render("reset-password", { token });
    } catch (error) {
        next(error);
    }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const forgotPasswordView = async (req, res, next) => {
    try {
        const token = req.query.token;
        res.render("send-mail", { token });
    } catch (error) {
        next(error);
    }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const resetPassword = async (req, res, next) => {
    try {
        const token = req.query.token;
        const { password, confirmpassword } = req.body;

        if (password !== confirmpassword) {
            return res.status(401).json({
                status: false,
                message: "Password and confirm password does not match"
            });
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
            if (err) {
                return res.status(400).json({
                    status: false,
                    message: "Failed to verify"
                });
            }

            const users = await prisma.user.findUnique({
                where: {
                    id: data.id
                }
            });

            if (!users) {
                return res.status(404).json({
                    status: false,
                    message: "User not found"
                });
            }

            await prisma.user.update({
                data: {
                    password: encryptedPassword
                },
                where: {
                    id: users.id
                }
            });

            await prisma.notification.create({
                data: {
                    judul: "Reset Password",
                    deskripsi: "Your password has been changed successfully!",
                    tanggal_waktu: new Date(),
                    userId: users.id
                }
            });

            return res.status(200).json({
                status: true,
                message: "Success"
            });
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
const requestResetPassword = async (req, res, next) => {
    try {
        const email = req.body.email;

        if (!email) {
            return res.status(400).json({
                status: false,
                message: "Email not provided"
            });
        }

        const users = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (!users) {
            return res.status(404).json({
                status: false,
                message: "Email not found"
            });
        }

        const name = users.name || users.email.split("@")[0];
        const token = jwt.sign({ id: users.id }, process.env.JWT_SECRET, { expiresIn: "5m" });
        const url = `${req.protocol}://${req.get("host")}/api/reset-password?token=${token}`;
        const html = await getHTML("forgot-password.ejs", { name, url });

        await sendEmail(users.email, "Reset password", html);

        await prisma.notification.create({
            data: {
                judul: "Request Reset Password",
                deskripsi: `We have emailed your password reset link to ${users.email}. The token will expire in 5 minutes.`,
                tanggal_waktu: new Date(),
                userId: users.id
            }
        });

        return res.status(200).json({
            status: true,
            message: `We have emailed your password reset link to ${users.email}. The token will expire in 5 minutes.`
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
const googleOAuth2 = async (req, res, next) => {
    try {
        const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET);

        return res.status(200).json({
            status: 200,
            message: "OK",
            data: { user: req.user, token }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    createPin,
    forgotPin,
    pinValidation,
    googleOAuth2,
    resetPassword,
    requestResetPassword,
    forgotPasswordView,
    resetPasswordView
};
