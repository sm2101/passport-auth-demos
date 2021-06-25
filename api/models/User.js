const mongoose = require("mongoose"),
  { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    provider: {
      type: "String",
      enum: ["local", "google", "github"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = User = model("user", UserSchema);
