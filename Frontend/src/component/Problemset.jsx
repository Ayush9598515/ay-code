import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Problemset = () => {
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [loading, setLoading] = useState(true); // 🔁 Added

const AUTH_URL = import.meta.env.VITE_AUTH_URL || "http://localhost:2000";

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axios.get(`${AUTH_URL}/api/problems`);
        console.log("📦 Problems from backend:", data); // 🟢 Debug log
        setProblems(data);
      } catch (err) {
        console.error("❌ Error fetching problems:", err);
      } finally {
        setLoading(false); // 🟢 Stop loading
      }
    };
    fetchProblems();
  }, []);

  const filteredProblems = problems.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) &&
      (difficulty === "" || p.difficulty === difficulty)
  );

  return (
    <div className="p-6 min-h-screen bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        🧠 Practice Problems
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by Title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded"
        />
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded"
        >
          <option value="">All</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-400">Loading problems...</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-300 dark:border-gray-700">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.length > 0 ? (
                filteredProblems.map((problem, index) => (
                  <tr key={problem._id} className="border-t border-gray-300 dark:border-gray-700">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:underline">
                      <Link to={`/problems/${problem._id}`}>{problem.title}</Link>
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          problem.difficulty === "Easy"
                            ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300"
                            : problem.difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300"
                            : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300"
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-6 text-gray-500 dark:text-gray-400">
                    No problems found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Problemset;
