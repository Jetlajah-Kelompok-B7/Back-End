const jwt = require("jsonwebtoken");

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


module.exports = {
    restrict
};
