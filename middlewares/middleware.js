const jwt = require("jsonwebtoken");
const passport = require("../libs/passport");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const restrict = (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({
                status: 401,
                message: "Token not provided!"
            });
        }

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

const isAdmin = (req, res, next) => {
    if (req.user.role != "ADMIN") {
        return res.status(401).json({
            status: false,
            message: "only admin can access!",
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
    authGoogle,
    authGoogleCallback,
    restrict,
    isAdmin
};
