const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/user.js");

// ✅ REGISTER Route
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      phonenumber,
      dateofbirth,
      password,
      gender,
      subscription,
    } = req.body;

    if (!name || !email || !phonenumber || !dateofbirth || !password || !gender || !subscription) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      phone: phonenumber,
      dob: dateofbirth,
      password: hashedPassword,
      gender,
      subscriptionPlan: subscription,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ error: "Server error during registration" });
  }
});

// ✅ LOGIN Route (with HTTP-only cookie)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ Send token as HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,        // ✅ true in production with HTTPS
      sameSite: "None",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    // ✅ Send username as response
    res.status(200).json({
      message: "Login successful",
      username: user.name,
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ OPTIONAL: Auth check route (used by frontend to verify session)
router.get("/me", (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ user: decoded });
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
});
// ✅ LOGOUT Route
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "Lax",
    secure: false, // 🔒 Set true in production with HTTPS
  });
  return res.status(200).json({ message: "Logged out successfully" });
});


module.exports = router;
