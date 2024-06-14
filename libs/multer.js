const multer = require("multer");

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

module.exports = {
    upload
};
