const jwt = require("jsonwebtoken");

// ✅ Middleware to verify token and attach user to request
const verifyUser = (req, res, next) => {
  const token = req.cookies.token;

  // 🔒 Token missing
  if (!token) {
    console.log("🚫 No token found in cookies.");
    return res.status(401).json({ success: false, message: "Access denied. No token provided." });
  }

  try {
    // ✅ Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach user to request
    req.user = decoded;

    console.log("✅ Authenticated user:", decoded); // 🧠 Debug log

    next(); // continue
  } catch (err) {
    console.error("❌ Invalid or expired token:", err.message);
    return res.status(403).json({ success: false, message: "Invalid or expired token." });
  }
};

module.exports = verifyUser;
