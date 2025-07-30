// AddProblem.jsx
import { useState, useEffect } from "react";
import axios from "axios";

const defaultStarterCode = {
  cpp: `#include <iostream>
using namespace std;
int main() {
    cout << "Hello, world!" << endl;
    return 0;
}`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, world!");
    }
}`,
  python: `print("Hello, world!")`,
  c: `#include <stdio.h>
int main() {
    printf("Hello, world!\\n");
    return 0;
}`,
};

const AddProblem = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    difficulty: "Easy",
    examples: [""],
    constraints: [""],
    starterCode: defaultStarterCode,
    defaultInput: "",
    testCases: [{ input: "", expectedOutput: "" }],
  });

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (key, index, value) => {
    const updated = [...form[key]];
    updated[index] = value;
    setForm({ ...form, [key]: updated });
  };

  const handleTestCaseChange = (index, field, value) => {
    const updated = [...form.testCases];
    updated[index][field] = value;
    setForm({ ...form, testCases: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = import.meta.env.VITE_PROBLEM_URL;
      await axios.post(url, form, {
        withCredentials: true,
      });
      alert("✅ Problem added successfully");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add problem");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-900 transition-colors">
      <div className="flex justify-end p-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-white rounded shadow"
        >
          Toggle {darkMode ? "Light" : "Dark"}
        </button>
      </div>

      <div className="max-w-5xl mx-auto p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-lg transition-colors duration-300">
        <h2 className="text-3xl font-bold mb-6 text-center text-zinc-800 dark:text-white">
          🚀 Add New Coding Problem
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="title"
            type="text"
            placeholder="Problem Title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-3 border rounded dark:bg-zinc-800 dark:text-white"
          />

          <textarea
            name="description"
            placeholder="Problem Description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-3 border rounded h-40 dark:bg-zinc-800 dark:text-white"
          />

          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            className="w-full p-3 border rounded dark:bg-zinc-800 dark:text-white"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>

          <div>
            <label className="font-semibold dark:text-white">🧪 Examples:</label>
            {form.examples.map((ex, idx) => (
              <textarea
                key={idx}
                value={ex}
                onChange={(e) => handleArrayChange("examples", idx, e.target.value)}
                className="w-full p-3 border rounded mt-2 dark:bg-zinc-800 dark:text-white"
              />
            ))}
          </div>

          <div>
            <label className="font-semibold dark:text-white">⚠️ Constraints:</label>
            {form.constraints.map((c, idx) => (
              <textarea
                key={idx}
                value={c}
                onChange={(e) => handleArrayChange("constraints", idx, e.target.value)}
                className="w-full p-3 border rounded mt-2 dark:bg-zinc-800 dark:text-white"
              />
            ))}
          </div>

          <div>
            <label className="font-semibold dark:text-white">💻 Starter Code:</label>
            {Object.keys(form.starterCode).map((lang) => (
              <div key={lang} className="mb-4">
                <label className="block font-medium dark:text-white">
                  {lang.toUpperCase()}
                </label>
                <textarea
                  value={form.starterCode[lang]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      starterCode: {
                        ...form.starterCode,
                        [lang]: e.target.value,
                      },
                    })
                  }
                  className="w-full p-3 border rounded mt-1 dark:bg-zinc-800 dark:text-white"
                />
              </div>
            ))}
          </div>

          <input
            name="defaultInput"
            type="text"
            placeholder="Default Input"
            value={form.defaultInput}
            onChange={handleChange}
            className="w-full p-3 border rounded dark:bg-zinc-800 dark:text-white"
          />

          <div>
            <label className="font-semibold dark:text-white">🧪 Test Cases:</label>
            {form.testCases.map((tc, idx) => (
              <div key={idx} className="mb-4">
                <input
                  type="text"
                  placeholder="Input"
                  value={tc.input}
                  onChange={(e) => handleTestCaseChange(idx, "input", e.target.value)}
                  className="w-full p-2 border rounded mt-1 mb-2 dark:bg-zinc-800 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Expected Output"
                  value={tc.expectedOutput}
                  onChange={(e) =>
                    handleTestCaseChange(idx, "expectedOutput", e.target.value)
                  }
                  className="w-full p-2 border rounded dark:bg-zinc-800 dark:text-white"
                />
              </div>
            ))}

            {/* 🔘 Add More Test Case Button */}
            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  testCases: [...form.testCases, { input: "", expectedOutput: "" }],
                })
              }
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              ➕ Add Test Case
            </button>
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded w-full text-lg font-semibold"
          >
            ➕ Submit Problem
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProblem;
