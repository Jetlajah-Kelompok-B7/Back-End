const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * @param {string} accessToken
 * @param {string} refreshToken
 * @param {import("passport-google-oauth20").Profile} profile
 * @param {import("passport-google-oauth20").VerifyCallback} done
 */
const callbackPassport = async (accessToken, refreshToken, profile, done) => {
    try {
        const exists = await prisma.user.findUnique({
            where: {
                email: profile.emails[0].value
            }
        });

        if (!exists) {
            throw new Error("User not found");
        }

        const user = await prisma.user.update({
            data: { googleid: profile.id },
            where: { email: profile.emails[0].value }
        });

        done(null, user);
    } catch (error) {
        done(error, null);
    }
};

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI
}, callbackPassport));

module.exports = passport;
