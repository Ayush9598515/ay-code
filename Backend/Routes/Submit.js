const express = require('express');
const router = express.Router();
const axios = require('axios');
const Problem = require('../models/Problem');
const Submission = require('../models/Submission');
const isAuth = require('../middleware/verification');
const { aiCodeReview } = require('./aiCodeReview');

const COMPILER_URL = process.env.COMPILER_URL || 'http://localhost:8000';

router.post('/submit', isAuth, async (req, res) => {
  const { code, language, problemId } = req.body;

  if (!code || !language || !problemId) {
    return res.status(400).json({
      verdict: "Invalid Request",
      error: "Missing fields",
    });
  }

  try {
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ verdict: "Problem Not Found" });
    }

    const testCases = problem.testCases || [];
    if (testCases.length === 0) {
      return res.status(400).json({ verdict: "No Test Cases Found" });
    }

    let verdict = "Accepted";
    let errorMessage = "";
    let failedTest = null;
    let testResults = [];

    for (let i = 0; i < testCases.length; i++) {
      const { input, expectedOutput } = testCases[i];

      let result;
      try {
        result = await axios.post(`${COMPILER_URL}/run`, {
          code,
          language,
          input,
        }, {
          timeout: 2000, // 10 seconds timeout
        });
      } catch (err) {
        console.error("🔥 Compiler Error:", err.message);
        console.error("🔥 Compiler Full Error:", err.response?.data || err.toString());
        verdict = "Internal Error";
        errorMessage = err.response?.data?.error || "Compiler server error";
        break;
      }

      if (!result || !result.data) {
        verdict = "Internal Error";
        errorMessage = "Compiler returned no response";
        break;
      }

      const output = result.data.output?.trim() || "";
      const error = result.data.error;

      const normalizedOutput = output.replace(/[\[\],]/g, '').trim();
      const normalizedExpected = expectedOutput.replace(/[\[\],]/g, '').trim();

      testResults.push({
        input,
        expectedOutput,
        actualOutput: output,
        error: error || "",
        passed: !error && normalizedOutput === normalizedExpected,
      });

      if (error) {
        verdict = "Compilation Error";
        errorMessage = error;
        failedTest = testCases[i];
        break;
      }

      if (normalizedOutput !== normalizedExpected) {
        verdict = "Wrong Answer";
        errorMessage = `Test case ${i + 1} failed`;
        failedTest = testCases[i];
        break;
      }
    }

    let aiReview = "";
    if (verdict === "Accepted") {
      try {
        aiReview = await aiCodeReview(code);
      } catch (err) {
        console.error("⚠️ AI Review Error:", err.message);
        aiReview = "⚠️ AI Review failed.";
      }
    }

    await Submission.create({
      user: req.user.id,
      problem: problemId,
      code,
      language,
      verdict,
      difficulty: problem.difficulty,
    });

    return res.status(200).json({
      verdict,
      testResults,
      failedTest,
      aiReview,
      error: errorMessage,
    });

  } catch (err) {
    console.error("❌ Submission Error:", err.message);
    return res.status(500).json({
      verdict: "Internal Error",
      error: err.message,
    });
  }
});

module.exports = router;
