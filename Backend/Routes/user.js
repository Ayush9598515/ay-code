// backend/Routes/user.js
const express = require("express");
const router = express.Router();
const { getUserProgress, updateUserProfile } = require("../Controller/userController");
const verifyUser = require("../middleware/verification");

// User Progress API: /api/user/progress
router.get("/user/progress", verifyUser, getUserProgress);

// User Profile Update API: /api/user/update
router.post("/user/update", verifyUser, updateUserProfile);

module.exports = router;
