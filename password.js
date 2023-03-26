const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

passport.use(
    new GoogleStrategy(
        {



            clientID: "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",
            clientSecret: "98316589168-qeko5cpac0skope1klt6rqgijf3odadl.apps.googleusercontent.com",
            callbackURL: "/auth/google/callback"
        },
        function (accessToken, refreshToken, profile, callback) {
            callback(null, profile)
        }
    )
)
passport.serializeUser((user, done) => {
    done(null, user)
})
passport.deserializeUser((user, done) => {
    done(null, user)
})