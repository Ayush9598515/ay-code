const User = require("../models/user");

const isAdmin = async (req, res, next) => {
  try {
    // Debug log: verifyToken ne userId set kiya ya nahi
    if (!req.userId) {
      console.error("isAdmin middleware error: req.userId is undefined.");
      return res.status(401).json({ message: "Unauthorized: Token missing or invalid." });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: "Access denied: Admins only." });
    }

    next();
  } catch (err) {
    console.error("isAdmin middleware error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = isAdmin;
