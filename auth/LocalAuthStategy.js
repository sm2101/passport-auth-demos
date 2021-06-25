const User = require("../api/models/User");
const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  bcrypt = require("bcrypt");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (username, password, done) => {
      User.findOne({ email: username }, function (err, user) {
        if (err) {
          console.log(err);
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        bcrypt.compare(password, user.password, (err, res) => {
          if (err) {
            console.log(err);
            return done(err);
          }
          if (res === false) {
            return done(null, false, { message: "incorrect password" });
          } else {
            return done(null, user);
          }
        });
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser((id, done) => {
  console.log(id);
  User.findById(id, (err, user) => {
    console.log(user);
    done(err, user);
  });
});
