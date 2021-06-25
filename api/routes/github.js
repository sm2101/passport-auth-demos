const express = require("express"),
  router = express.Router(),
  passport = require("passport");

router.get("/", passport.authenticate("github"));

router.get(
  "/callback",
  passport.authenticate("github", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

module.exports = router;
