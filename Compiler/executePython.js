const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const executePython = (filePath, inputFile) => {
  return new Promise((resolve) => {
    const pythonProcess = spawn("python", [filePath], {
      stdio: "pipe",
      shell: true, // ✅ Windows compatibility
    });

    let output = "";
    let error = "";

    if (inputFile) {
      const inputStream = fs.createReadStream(inputFile);
      inputStream.pipe(pythonProcess.stdin);
    }

    const timeout = setTimeout(() => {
      pythonProcess.kill();
      return resolve({
        output: "",
        error: "⏱ Execution timed out",
      });
    }, 5000);

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      error += data.toString();
    });

    pythonProcess.on("close", (code) => {
      clearTimeout(timeout); // ✅ prevent late timeout
      if (code !== 0) {
        return resolve({
          output: "",
          error: error || `Exited with code ${code}`,
        });
      }
      return resolve({
        output,
        error: "",
      });
    });

    pythonProcess.on("error", (err) => {
      clearTimeout(timeout); // ✅ also here
      return resolve({
        output: "",
        error: err.message,
      });
    });
  });
};

module.exports = executePython;
