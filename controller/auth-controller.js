const User = require("../models/user-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Utility: generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// Setup Nodemailer transporter (Gmail example)
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // your email app password
  },
});

// ---------------- REGISTER & LOGIN ---------------- //

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    if (!process.env.JWT_SECRET) return res.status(500).json({ message: "JWT_SECRET not set in .env" });

    const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({ success: true, message: "Login successful", token });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- FORGET PASSWORD ---------------- //

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Generate OTP & save in DB temporarily
    const otp = generateOTP();
    user.resetOTP = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid 10 minutes
    await user.save();

    // Send OTP via email
   await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: email,
  subject: "Password Reset OTP",
  html: `
    <div style="
      font-family: Arial, sans-serif; 
      background-color: #f4f4f9; 
      padding: 20px; 
      border-radius: 10px;
      text-align: center;
    ">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p style="font-size: 16px; color: #555;">
        Your OTP for password reset is:
      </p>
      <p style="
        font-size: 24px; 
        font-weight: bold; 
        color: #1a73e8; 
        margin: 20px 0;
      ">
        ${otp}
      </p>
      <p style="font-size: 14px; color: #777;">
        This OTP is valid for 10 minutes. Please do not share it with anyone.
      </p>
      <div style="margin-top: 20px;">
        <span style="
          display: inline-block; 
          padding: 10px 20px; 
          background-color: #1a73e8; 
          color: #fff; 
          border-radius: 5px;
          text-decoration: none;
          font-weight: bold;
        ">
          Reset Password
        </span>
      </div>
    </div>
  `,
});


    res.status(200).json({ success: true, message: "OTP sent to your email" });
  } catch (err) {
    console.error("Forget Password Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // if (user.resetOTP !== parseInt(otp) || Date.now() > user.otpExpiry)
    //   return res.status(400).json({ message: "Invalid or expired OTP" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOTP = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login, forgetPassword, resetPassword };
