const path = require("multer");
const multer = require("multer");

const file_name = (req, res, callback) => {
    let fileName = Date.now() + path.extname(file.originalname);
    callback(null, fileName);
};

const createFileFilter = (mimetypes) => {
    return (req, file, callback) => {
        if (mimetypes.includes(file.mimetype)) {
            callback(null, true)
        } else {
            let error = new Error(`Only ${mimetypes} image types are allowed !`);
            callback(error, false);
        }
    };
};

module.exports = {
    image: multer({
        fileFilter: createFileFilter([
            'image/png',
            'image/jpg',
            'image/jpeg'
        ]),
        OnError: (error, next) => {
            next(error);
        }
    }),
}