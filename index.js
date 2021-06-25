require("dotenv").config();
const express = require("express"),
  expressSession = require("express-session"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  localRoutes = require("./api/routes/local"),
  googleRoutes = require("./api/routes/google"),
  githubRoutes = require("./api/routes/github");

const app = express();
require("./auth/LocalAuthStategy");
require("./auth/GoogleAuthStrategy");
require("./auth/GithubAuthenticationStrategy");

app.use(require("morgan")("dev"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());

const isLoggedin = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
};
const isNotLoggedin = (req, res, next) => {
  if (!req.isAuthenticated()) return next();
  res.redirect("/");
};

app.get("/", isLoggedin, (req, res) => {
  if (req.user) {
    res.render("home", { user: req.user });
  }
});

app.get("/register", isNotLoggedin, (req, res) => {
  res.render("register");
});
app.get("/login", isNotLoggedin, (req, res) => {
  res.render("login");
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});
app.use("/api/local", localRoutes);
app.use("/google", googleRoutes);
app.use("/github", githubRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server Live at port: ${process.env.PORT}`);
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((res) => {
      console.log("DB Connected");
    })
    .catch((err) => {
      console.log("Connection error");
    });
});
