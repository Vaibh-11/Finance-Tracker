const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/usermodel");

const nodemailer = require("nodemailer");

const otpStore = new Map();

module.exports.signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).send("All fields are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Email already registered");
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    otpStore.set(email, { username, email, password, otp });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is ${otp}`,
    });

    res.send("OTP sent to email");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const data = otpStore.get(email);

    if (!data) {
      return res.status(400).send("OTP expired or invalid");
    }

    if (data.otp != otp) {
      return res.status(400).send("Invalid OTP");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(data.password, salt);

    const user = await User.create({
      username: data.username,
      email: data.email,
      password: hash,
    });

    otpStore.delete(email);

    res.status(200).json({
      message: "User registered successfully",
      user,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Unauthorize Access" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
        expiresIn: "7d",
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: true, // ✅ REQUIRED for production (HTTPS)
        sameSite: "None", // ✅ REQUIRED for cross-origin
      });
      res.send(user);
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(404).send(err.message);
  }
};

module.exports.logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  return res.status(200).json({
    message: "Logout successful",
  });
};

module.exports.getProfile = async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({
      message: "Profile fetched successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        password: user.password,
      },
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).send("All fields are required");
    }

    if (newPassword.length < 6) {
      return res.status(400).send("Password must be at least 6 characters");
    }
    const user = await User.findById(req.id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).send("Old password is incorrect");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    user.password = hash;
    await user.save();

    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send("Email is required");
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    otpStore.set(email, {
      otp,
      expires: Date.now() + 5 * 60 * 1000,
    });

    // ✅ SEND RESPONSE IMMEDIATELY
    res.send("OTP sent to email");
    console.log("MAIL USER:", process.env.EMAIL_USER);
    console.log("MAIL PASS:", process.env.EMAIL_PASS);

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log("MAIL USER:", process.env.EMAIL_USER);
    console.log("MAIL PASS:", process.env.EMAIL_PASS);

    transporter
      .sendMail({
        from: "test@mailtrap.io",
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP is ${otp}`,
      })
      .then(() => console.log("✅ Email sent"))

      .catch((err) => console.log("❌ Mail error:", err));
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).send("All fields are required");
    }

    const data = otpStore.get(email);

    if (!data) {
      return res.status(400).send("OTP expired or invalid");
    }

    if (Date.now() > data.expires) {
      otpStore.delete(email);
      return res.status(400).send("OTP expired");
    }

    if (data.otp != otp) {
      return res.status(400).send("Invalid OTP");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    const user = await User.findOneAndUpdate(
      { email },
      { password: hash },
      { new: true },
    );

    otpStore.delete(email);

    res.send("Password reset successful");
  } catch (err) {
    res.status(500).send(err.message);
  }
};
