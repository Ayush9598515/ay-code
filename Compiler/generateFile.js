const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const dirCodes = path.join(__dirname, "Codes");

if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

const generateFile = (language, code = "") => {
  const jobId = uuid();
  let fileName = `${jobId}.${language}`;
  let filePath = path.join(dirCodes, fileName);

  // ✅ Special handling for Java: class name must match a valid filename
  if (language === "java") {
    const className = `Main_${jobId.replace(/-/g, "_")}`;
    code = code.replace(/public\s+class\s+\w+/, `public class ${className}`);
    fileName = `${className}.java`;
    filePath = path.join(dirCodes, fileName);
  }

  try {
    filePath = filePath.trim(); // ✅ Trim only before usage
    fs.writeFileSync(filePath, code);
    console.log("📄 Code file created at:", filePath);
    return filePath;
  } catch (err) {
    console.error("❌ Error writing code file:", err);
    return null;
  }
};

module.exports = generateFile;
