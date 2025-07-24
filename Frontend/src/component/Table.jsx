import React, { useEffect, useState } from "react";
import axios from "axios";
import HeatMap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
const AUTH_URL = import.meta.env.VITE_AUTH_URL || "http://localhost:2000";

// 📦 Reusable StatCard
const StatCard = ({ title, value, total }) => (
  <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow text-center">
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-2xl font-bold text-blue-500">{value}</p>
    <p className="text-sm text-gray-500 dark:text-gray-400">out of {total}</p>
  </div>
);

const Dashboard = () => {
  const username = localStorage.getItem("username");

  const [stats, setStats] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
    total: 0,
  });
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);

  // 📅 Dates
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);

  // 🎯 Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${AUTH_URL}/api/dashboard`, {
          withCredentials: true,
        });

        setStats(res.data.problemStats || {});
        setRecentSubmissions(res.data.recentSubmissions || []);
        setHeatmapData(res.data.submissionHistory || []);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      }
    };

    fetchData();
  }, []);

  const totalSubmissions = recentSubmissions.length;
  const acceptedCount = recentSubmissions.filter(s => s.status === "Accepted").length;

  const chartData = [
    { name: "Accepted", value: acceptedCount },
    { name: "Other", value: totalSubmissions - acceptedCount },
  ];

  const COLORS = ["#3b82f6", "#ffffff"];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">👤 Dashboard</h1>
        <p className="text-lg">
          Welcome back, <span className="font-semibold text-blue-500">{username}</span>! 🎉
        </p>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          This is your personalized dashboard. Track your progress, stats, and more.
        </p>

        {/* User Info Card */}
        <div className="bg-gray-100 dark:bg-zinc-800 rounded-2xl shadow p-6 mt-6 flex flex-col sm:flex-row justify-between">
          <div>
            <h2 className="text-xl font-semibold">👨‍💻 {username}</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">India • C++ • Python</p>
          </div>
        </div>

        {/* Problem Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <StatCard title="Easy" value={stats.easy} total="885" />
          <StatCard title="Medium" value={stats.medium} total="1878" />
          <StatCard title="Hard" value={stats.hard} total="848" />
        </div>

        {/* Heatmap */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-2">📅 Submission Activity (Last 12 months)</h2>
          <div className="overflow-x-auto max-w-full">
            <div className="scale-[0.85] sm:scale-100">
              <HeatMap
                startDate={startDate}
                endDate={endDate}
                values={heatmapData}
                showWeekdayLabels={false}
                showMonthLabels={true}
                classForValue={(val) =>
                  !val || val.count === 0 ? "color-empty" : "color-submitted"
                }
                horizontal={true}
              />
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">📊 Submission Breakdown</h2>
          <div className="w-full sm:w-1/2 mx-auto">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} stroke="#000" />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 p-4 rounded-xl mt-10 text-center">
          🏅 No badges yet — keep solving to unlock achievements!
        </div>

        {/* Recent Submissions */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">📝 Recent Submissions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-700 dark:text-gray-300">
                  <th className="p-2">Problem</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Language</th>
                  <th className="p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentSubmissions.map((s, i) => (
                  <tr key={i} className="border-b dark:border-zinc-700">
                    <td className="p-2">{s.title}</td>
                    <td className={`p-2 ${s.status === "Accepted" ? "text-green-500" : "text-red-500"}`}>{s.status}</td>
                    <td className="p-2">{s.lang}</td>
                    <td className="p-2">{s.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
