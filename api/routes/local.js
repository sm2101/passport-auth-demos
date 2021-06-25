const express = require("express"),
  router = express.Router(),
  passport = require("passport");

const { registerUser } = require("../controllers/local");

router.post("/register", registerUser);
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);
module.exports = router;
