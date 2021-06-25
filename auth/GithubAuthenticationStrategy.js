const passport = require("passport"),
  GitHubStrategy = require("passport-github").Strategy;

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK,
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOne({ email: profile.emails[0].value })
        .then((user) => {
          if (user && user.provider === "github") {
            console.log("user", user);
            return cb(null, user);
          }
          if (user && user.provider !== "github") {
            console.log(user.provider, user);
            return cb(null, false, {
              message:
                "User already registred, please login with those credentials",
            });
          }
          if (!user) {
            const newUser = new User({
              name: profile.displayName,
              username: profile.username,
              email: profile.emails[0].value,
              provider: "github",
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
