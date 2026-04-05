const User = require("../models/usermodel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
module.exports.authentication = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send("Please Login");
    }

    const decode = await jwt.verify(token, process.env.JWT_KEY);
    const { id } = decode;
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    req.id = id;
    next();
  } catch (err) {
    return res.status(400).send(err.message);
  }
};
