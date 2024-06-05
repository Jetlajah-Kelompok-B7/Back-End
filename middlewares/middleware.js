const jwt = require("jsonwebtoken");
const path = require("path");
const multer = require("multer");
const imagekit = require("imagekit");
const { 
    IMAGEKIT_PUBLIC_KEY, 
    IMAGEKIT_PRIVATE_KEY, 
    IMAGEKIT_ENDPOINT_URL } = process.env;

const imagekitInstance = new imagekit({
    publicKey: IMAGEKIT_PUBLIC_KEY,
    privateKey: IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: IMAGEKIT_ENDPOINT_URL
});

const file_name = (req, file, callback) => {
    let fileName = Date.now() + path.extname(file.originalname);
    callback(null, fileName);
};

const generateFileFilter = (mimetypes) => {
    return (req, file, callback) => {
        if (mimetypes.includes(file.mimetype)) {
            callback(null, true);
        } else {
            let error = new Error(`Only ${mimetypes} are allowed to upload!`);
            callback(error, false);
        }
    };
};

const upload = multer({
    fileFilter: generateFileFilter([
        'image/jpg',
        'image/png',
        'image/jpeg'
    ]),
    onError: (error, next) => {
        next(error);
    }
});
    

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
    imagekit: imagekitInstance,
    upload,
    restrict
};
