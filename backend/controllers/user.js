const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { Resend } = require("resend");
const axios = require("axios");

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // ✅ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // ✅ Store OTP
    otpStore.set(email, {
      username,
      email,
      password,
      otp,
      expires: Date.now() + 5 * 60 * 1000,
    });

    console.log("Signup OTP:", otp);

    // ✅ Send Email via Brevo
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          email: "solankivaibhav589@gmail.com", // verified sender
          name: "Finance Tracker",
        },
        to: [{ email }],
        subject: "Signup OTP Verification",
        textContent: `Your OTP is ${otp}`,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("✅ Signup OTP sent via Brevo");

    return res.status(200).send("OTP sent to email");
  } catch (err) {
    console.log("❌ Brevo Error:", err.response?.data || err.message);
    return res.status(500).send("Failed to send OTP");
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

    // ✅ Send email via Brevo
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          email: "solankivaibhav589@gmail.com", // your email
          name: "Finance Tracker",
        },
        to: [{ email }],
        subject: "Password Reset OTP",
        textContent: `Your OTP is ${otp}`,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("✅ OTP Email sent via Brevo");

    return res.send("OTP sent to email");
  } catch (err) {
    console.log("❌ Brevo Error:", err.response?.data || err.message);
    return res.status(500).send("Failed to send OTP");
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
