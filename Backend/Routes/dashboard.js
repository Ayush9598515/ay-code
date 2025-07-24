const express = require("express");
const router = express.Router();

const { getDashboardData, getHeatmapData } = require("../Controller/dashboardController.js");
const verifyUser = require("../middleware/verification.js");

// Dashboard API: /api/dashboard
router.get("/dashboard", verifyUser, getDashboardData);

// Heatmap API: /api/submissions/heatmap
router.get("/submissions/heatmap", verifyUser, getHeatmapData);

module.exports = router;
