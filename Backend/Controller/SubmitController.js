// controllers/SubmitController.js

const axios = require("axios");
const Submission = require("../models/Submission");
const Problem = require("../models/Problem");
const { aiCodeReview } = require("../Routes/aiCodeReview");

const submitCode = async (req, res) => {
  const { problemId, code, language } = req.body;

  if (!problemId || !code || !language) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found." });
    }

    const testCases = problem.testCases || [];
    const compilerURL = process.env.VITE_COMPILER_URL || "http://localhost:8000/run";

    let allPassed = true;
    let failedCase = null;

    for (let i = 0; i < testCases.length; i++) {
      const { input, expectedOutput } = testCases[i];

      const { data } = await axios.post(compilerURL, {
        code,
        language,
        input,
        timeout: 2000,
      });

      const actualOutput = (data.output || "").trim();
      const expected = (expectedOutput || "").trim();

      if (actualOutput !== expected) {
        allPassed = false;
        failedCase = {
          input,
          expectedOutput: expected,
          actualOutput,
          error: data.error || null,
        };
        break;
      }
    }

    const verdict = allPassed ? "Accepted" : "Wrong Answer";

    const submission = await Submission.create({
      user: req.user._id,
      problem: problemId,
      code,
      language,
      verdict,
      difficulty: problem.difficulty,
    });

    if (verdict === "Accepted") {
      const review = await aiCodeReview(code);
      return res.json({ verdict, review });
    }

    return res.json({ verdict, failedCase });

  } catch (err) {
    console.error("❌ Submission Error:", err.message);
    return res.status(500).json({ verdict: "Internal Error", error: err.message });
  }
};

module.exports = { submitCode };
