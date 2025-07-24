const Submission = require("../models/Submission");
const User = require("../models/user");

// 📊 GET /api/user/progress
exports.getUserProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const submissions = await Submission.find({ user: userId }).sort({ createdAt: 1 });

    let streak = 0, maxStreak = 0, lastDate = null;
    const uniqueDays = new Set();

    for (const sub of submissions) {
      const date = sub.createdAt.toISOString().split("T")[0];
      uniqueDays.add(date);

      if (!lastDate) {
        lastDate = date;
        streak = 1;
      } else {
        const diff = (new Date(date) - new Date(lastDate)) / (1000 * 3600 * 24);
        if (diff === 1) {
          streak++;
        } else if (diff > 1) {
          streak = 1;
        }
        lastDate = date;
      }

      maxStreak = Math.max(maxStreak, streak);
    }

    // 🔓 Badge unlock logic (basic example)
    const badges = [];
    if (uniqueDays.size >= 7) badges.push("7-Day Warrior");
    if (maxStreak >= 5) badges.push("Streak Master");

    res.json({
      totalDays: uniqueDays.size,
      maxStreak,
      badges
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Progress fetch failed" });
  }
};

// ✍️ POST /api/user/update
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, bio, skills } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, bio, skills },
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Profile update failed" });
  }
};
