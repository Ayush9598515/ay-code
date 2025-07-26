require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const open = require("open").default;
const { DBConnection } = require("./database/db");
const { aiCodeReview } = require('./Routes/aiCodeReview');

const app = express();
const PORT = process.env.PORT || 2000;

// 🛡️ Middleware
app.use(cors({
  origin: [
    process.env.DEV_URL,        // Local dev
    process.env.FRONTEND_URL,     // Production (Vercel domain or custom domain)
  ],
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔌 Connect to MongoDB
DBConnection(); // Use process.env.MONGO_URI inside this function

// 🛣️ Combined Routers (auth, problems, submissions, dashboard, user)
const apiRoutes = require("./Routes/index");
app.use("/api", apiRoutes);

// 🏁 Default route
app.get("/", (req, res) => {
  res.send("🚀 AY-Code Backend is running!");
});

app.post("/api/ai-review", async (req, res) => {
    const { code } = req.body;
    if (code === undefined) {
        return res.status(404).json({ success: false, error: "Empty code!" });
    }
    try {
        const review = await aiCodeReview(code); // Use process.env.OPENAI_API_KEY inside
        res.json({ "review": review });
    } catch (error) {
        res.status(500).json({ error: "Error in AI review, error: " + error.message });
    }
});



// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  if (process.env.NODE_ENV !== "production") open(`http://localhost:${PORT}`);
});

