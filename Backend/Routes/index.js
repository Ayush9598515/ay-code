const express = require("express");
const router = express.Router();

const AuthRouter = require("./AuthRouter");
const ProblemRouter = require("./problems");
const SubmitRouter = require("./Submit");
const DashboardRouter = require("./dashboard");
const UserRouter = require("./user"); // optional

// ✅ Mount all routes at root so they appear under /api/
router.use("/", AuthRouter);       // /api/login, /api/register etc.
router.use("/", ProblemRouter);    // /api/problems
router.use("/", SubmitRouter);     // /api/submit
router.use("/", DashboardRouter);  // /api/dashboard
router.use("/", UserRouter);       // optional /api/user/*

module.exports = router;
