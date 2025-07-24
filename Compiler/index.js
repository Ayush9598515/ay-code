const express = require("express");
const cors = require("cors");
const app = express();

const generateFile = require("./generateFile.js");
const generateInputFile = require("./generateInputFile.js");

const executeCpp = require("./executeCpp.js");
const executeC = require("./executeC.js");
const executeJava = require("./executeJava.js");
const executePython = require("./executePython.js");



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("Hello Ayushji! Compiler backend is working ✅");
});

// ✅ Run single test (Run Code button)
app.post("/run", async (req, res) => {
  const { language = "cpp", code, input = "" } = req.body;

  if (!code || typeof code !== "string") {
    return res.status(400).json({
      success: false,
      error: "Code is required and must be a string.",
      output: "",
    });
  }

  try {
    const rawFilePath = generateFile(language, code);
    const filePath = rawFilePath.trim();

    let inputFile = null;
    if (input.trim()) {
      inputFile = generateInputFile(input).trim();
      console.log("📥 Input file created:", inputFile);
    }

    console.log("📄 Code file created:", filePath);

    let result;
    switch (language) {
      case "cpp":
        result = await executeCpp(filePath, inputFile);
        break;
      case "c":
        result = await executeC(filePath, inputFile);
        break;
      case "java":
        result = await executeJava(filePath, inputFile);
        break;
      case "python":
      case "py":
        result = await executePython(filePath, inputFile);
        break;
      default:
        return res.status(400).json({
          success: false,
          error: "Unsupported language.",
          output: "",
        });
    }

    return res.json({
      success: true,
      output: result.output || "",
      error: result.error || "",
    });

  } catch (error) {
    console.error("❌ Internal error during execution:", error);
    return res.status(500).json({
      success: false,
      output: "",
      error: error.stderr || error.message || "Internal execution error",
    });
  }
});

// ✅ Run all test cases (for Submit button)

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`✅ Compiler backend running on http://localhost:${PORT}`);
});
