const fs = require("fs");
const path = require("path");
const { exec, spawn } = require("child_process");

const outputPath = path.join(__dirname, "outputs");
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeC = async (filePath, inputFile) => {
  const jobId = path.basename(filePath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.exe`);
  const compileCommand = `gcc "${filePath}" -o "${outPath}"`;

  return new Promise((resolve) => {
    exec(compileCommand, (compileErr, stdout, stderr) => {
      if (compileErr || stderr) {
        return resolve({
          output: "",
          error: stderr || compileErr.message,
        });
      }

      const runProcess = spawn(outPath, {
        shell: true, // ✅ Needed on Windows to run .exe
        stdio: "pipe",
      });

      let output = "";
      let error = "";

      if (inputFile) {
        const inputStream = fs.createReadStream(inputFile);
        inputStream.pipe(runProcess.stdin);
      }

      runProcess.stdout.on("data", (data) => {
        output += data.toString();
      });

      runProcess.stderr.on("data", (data) => {
        error += data.toString();
      });

      const timeout = setTimeout(() => {
        runProcess.kill();
        return resolve({
          output: "",
          error: "⏱ Execution timed out",
        });
      }, 5000);

      runProcess.on("close", (code) => {
        clearTimeout(timeout); // ✅ important
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

      runProcess.on("error", (err) => {
        clearTimeout(timeout);
        return resolve({
          output: "",
          error: err.message,
        });
      });
    });
  });
};

module.exports = executeC;
