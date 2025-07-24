const express = require("express");
const router = express.Router();
const Problem = require("../models/Problem"); // Mongoose Model

// ✅ API: Get All Problems
router.get("/problems", async (req, res) => {
  try {
    const problems = await Problem.find({}, "_id title difficulty");
    res.json(problems);
  } catch (err) {
    console.error("❌ Error fetching problems:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ API: Get Single Problem by ID
router.get("/problems/:id", async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    // ✏️ Patch description for "Two Sum"
    if (
      problem.title === "Two Sum" &&
      !problem.description.includes("The array has a fixed size")
    ) {
      problem.description = `The array has a fixed size and contains integers. ${problem.description}`;
    }

    res.json(problem);
  } catch (err) {
    console.error("❌ Error fetching problem:", err.message);
    res.status(400).json({ error: "Invalid problem ID" });
  }
});

module.exports = router;
