const Submission = require("../models/Submission");

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    // 📌 1. Fetch recent submissions with populated problem
    const recentSubmissions = await Submission.find({ user: userId })
      .populate("problem")
      .sort({ createdAt: -1 })
      .limit(5);

    // 📌 2. Fetch all submissions with problem populated
    const allSubs = await Submission.find({ user: userId }).populate("problem");

    // 📌 3. Difficulty stats (Accepted only)
    const difficultyStats = {
      easy: allSubs.filter(s => s.problem?.difficulty === "Easy" && s.verdict === "Accepted").length,
      medium: allSubs.filter(s => s.problem?.difficulty === "Medium" && s.verdict === "Accepted").length,
      hard: allSubs.filter(s => s.problem?.difficulty === "Hard" && s.verdict === "Accepted").length,
    };

    // 📌 4. Submission history for heatmap
    const submissionHistory = {};
    allSubs.forEach(sub => {
      const date = sub.createdAt.toISOString().split("T")[0];
      submissionHistory[date] = (submissionHistory[date] || 0) + 1;
    });

    const heatmapData = Object.keys(submissionHistory).map(date => ({
      date,
      count: submissionHistory[date],
    }));

    // ✅ Return combined data
    res.json({
      recentSubmissions,
      difficultyStats,
      submissionHistory: heatmapData,
    });

  } catch (err) {
    console.error("❌ Dashboard Error:", err.message);
    res.status(500).json({ error: "Dashboard fetch failed" });
  }
};

exports.getHeatmapData = async (req, res) => {
  try {
    const userId = req.user.id;

    const submissions = await Submission.find({ user: userId });

    const submissionHistory = {};
    submissions.forEach(sub => {
      const date = sub.createdAt.toISOString().split("T")[0];
      submissionHistory[date] = (submissionHistory[date] || 0) + 1;
    });

    const heatmapData = Object.keys(submissionHistory).map(date => ({
      date,
      count: submissionHistory[date],
    }));

    res.json({ heatmap: heatmapData });

  } catch (err) {
    console.error("❌ Heatmap Error:", err.message);
    res.status(500).json({ error: "Heatmap fetch failed" });
  }
};
