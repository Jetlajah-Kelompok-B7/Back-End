const ejs = require("ejs");
const nodemailer = require("nodemailer");
const oauth2Client = require("./googleapis");

const sendEmail = async (to, subject, html) => {
    try {
        const accessToken = await oauth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: process.env.GOOGLE_USER,
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken
            }
        });

        await transport.sendMail({
            to,
            subject,
            html
        });
    } catch (error) {
        console.error(error);
    }
};

const getHTML = (fileName, data) => {
    return new Promise((resolve, reject) => {
        const path = `${__dirname}/../views/templates/${fileName}`;
        ejs.renderFile(path, data, (err, data) => {
            if (err) {
                return reject(err);
            }

            return resolve(data);
        });
    });
};

module.exports = {
    sendEmail,
    getHTML
};
