const fs = require("fs");
const path = require("path");
const { exec, spawn } = require("child_process");

const executeJava = (filePath, inputFile) => {
  const jobId = path.basename(filePath).split(".")[0];
  const dir = path.dirname(filePath);

  return new Promise((resolve) => {
    const compileCommand = `javac "${filePath}"`;

    exec(compileCommand, { cwd: dir }, (compileErr, stdout, stderr) => {
      if (compileErr || stderr) {
        return resolve({
          output: "",
          error: stderr || compileErr.message || "Compilation Error",
        });
      }

      const className = jobId;
      const javaProcess = spawn("java", ["-cp", dir, className], {
        stdio: "pipe",
        shell: true, // ✅ optional but safe on Windows
      });

      let output = "";
      let error = "";

      if (inputFile) {
        const inputStream = fs.createReadStream(inputFile);
        inputStream.pipe(javaProcess.stdin);
      }

      javaProcess.stdout.on("data", (data) => {
        output += data.toString();
      });

      javaProcess.stderr.on("data", (data) => {
        error += data.toString();
      });

      const timeout = setTimeout(() => {
        javaProcess.kill();
        return resolve({
          output: "",
          error: "⏱ Execution timed out",
        });
      }, 5000);

      javaProcess.on("close", (code) => {
        clearTimeout(timeout); // ✅ prevent double resolve
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

      javaProcess.on("error", (err) => {
        clearTimeout(timeout);
        return resolve({
          output: "",
          error: err.message,
        });
      });
    });
  });
};

module.exports = executeJava;
