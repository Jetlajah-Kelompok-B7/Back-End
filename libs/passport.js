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
        const user = await prisma.user.upsert({
            create: {
                email: profile._json.email,
                is_googleuser: true,
                googleid: profile.id,
                Profile: {
                    create: {
                        nama: profile._json.name,
                        photo_profile: profile._json.picture
                    }
                }
            },
            update: {
                googleid: profile.id
            },
            where: { email: profile._json.email }
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
