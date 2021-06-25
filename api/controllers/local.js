const User = require("../models/User"),
  bcrypt = require("bcrypt");

exports.registerUser = (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({
        status: "Error",
        message: "User already Exists",
      });
    } else {
      console.log(req.body);
      const newUsr = new User({
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
        name: req.body.name,
        provider: "local",
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUsr.password, salt, (err, hash) => {
          if (err) {
            throw err;
          } else {
            newUsr.password = hash;
            newUsr
              .save()
              .then((result) => {
                res.redirect("/login");
              })
              .catch((err) => {
                res.redirect("/register");
              });
          }
        });
      });
    }
  });
};
