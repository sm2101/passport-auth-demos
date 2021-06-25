const passport = require("passport"),
  GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("../api/models/User");
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK,
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOne({ email: profile.emails[0].value })
        .then((user) => {
          if (user && user.provider === "google") {
            console.log("user", user);
            return cb(null, user);
          }
          if (user && user.provider !== "google") {
            console.log("local stategy", user);
            return cb(null, false, {
              message:
                "User already registred, please login with those credentials",
            });
          }
          if (!user) {
            console.log(profile.emails.value);
            const newUser = new User({
              name: profile.displayName,
              username: profile.name.givenName,
              email: profile.emails[0].value,
              provider: "google",
            });
            console.log(newUser);
            newUser
              .save()
              .then((user) => {
                cb(null, user);
              })
              .catch((err) => {
                cb(err, false);
              });
          }
        })
        .catch((err) => {
          return cb(err, false);
        });
    }
  )
);
