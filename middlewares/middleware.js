const jwt = require("jsonwebtoken");
const passport = require("../libs/passport");
const multer = require("multer");
const imagekit = require("imagekit");
const { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_ENDPOINT_URL } = process.env;

const imagekitInstance = new imagekit({
    publicKey: IMAGEKIT_PUBLIC_KEY,
    privateKey: IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: IMAGEKIT_ENDPOINT_URL
});

const generateFileFilter = (mimetypes) => {
    return (req, file, callback) => {
        if (mimetypes.includes(file.mimetype)) {
            callback(null, true);
        } else {
            const error = new Error(`Only ${mimetypes} are allowed to upload!`);
            callback(error, false);
        }
    };
};

const upload = multer({
    fileFilter: generateFileFilter([
        "image/jpg",
        "image/png",
        "image/jpeg"
    ]),
    onError: (error, next) => {
        next(error);
    }
});

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const restrict = (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization || !authorization.split(" ")[1]) {
            return res.status(401).json({
                status: 401,
                message: "Token not provided!"
            });
        }

        const token = authorization.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(401).json({
                    status: 401,
                    message: err.message
                });
            }
            delete user.iat;
            req.user = user;
            next();
        });
    } catch (error) {
        next(error);
    }
};

let isAdmin = (req, res, next) => {
    if (req.user.role != 'ADMIN') {
        return res.status(401).json({
            status: false,
            message: 'only admin can access!',
            data: null
        });
    }
    next();
};

const authGoogle = passport.authenticate("google", {
    scope: ["email", "profile"],
    prompt: "select_account"
});

const authGoogleCallback = passport.authenticate("google", {
    failureRedirect: "/api/login/google",
    session: false
});

module.exports = {
    imagekit: imagekitInstance,
    upload,
    authGoogle,
    authGoogleCallback,
    restrict,
    isAdmin
};
