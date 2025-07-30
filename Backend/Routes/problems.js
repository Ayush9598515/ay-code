const express = require("express");
const router = express.Router();
const Problem = require("../models/Problem");
const isAuth = require("../middleware/verification");
const isAdmin = require("../middleware/isAdmin");

// ✅ GET: All Problems (Public)
router.get("/problems", async (req, res) => {
  try {
    const problems = await Problem.find({}, "_id title difficulty");
    res.json(problems);
  } catch (err) {
    console.error("❌ Error fetching problems:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ GET: Single Problem by ID (Public)
router.get("/problems/:id", async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }
    res.json(problem);
  } catch (err) {
    console.error("❌ Error fetching problem:", err.message);
    res.status(400).json({ error: "Invalid problem ID" });
  }
});

// ✅ POST: Add New Problem (Admin only)
router.post("/problems", isAuth, isAdmin, async (req, res) => {
  const {
    title,
    description,
    difficulty,
    examples,
    constraints,
    starterCode,
    testCases,
  } = req.body;

  if (!title || !description || !difficulty || !Array.isArray(testCases)) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newProblem = new Problem({
      title,
      description,
      difficulty,
      examples,
      constraints,
      starterCode,
      testCases,
    });

    await newProblem.save();
    res.status(201).json({ message: "✅ Problem added successfully", problem: newProblem });
  } catch (err) {
    console.error("❌ Error adding problem:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

