import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
const AUTH_URL = import.meta.env.VITE_AUTH_URL || "http://localhost:2000";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const res = await axios.get(`${AUTH_URL}/api/me`, {
          withCredentials: true,
        });

        const name = res.data.user.name?.split("@")[0] || res.data.user.email.split("@")[0];
        setUsername(name);
        localStorage.setItem("username", name); // Sync with storage
      } catch (err) {
        setUsername("");
        localStorage.removeItem("username");
      }
    };

    fetchUsername();
  }, [location]);

  const handleStartCoding = () => {
    if (username) {
      navigate("/practice");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white px-4 sm:px-10 py-10 transition-colors duration-300">
      
      {/* ✅ Show greeting only if user is authenticated */}
      {username && username.trim() !== "" && (
        <div className="flex items-center justify-center mb-10">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-mono text-blue-500">
              <span className="text-green-500">Hello,</span> {username} 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 font-mono">
              Welcome back to your coding dojo 🧠💻
            </p>
          </div>
        </div>
      )}

      {/* ✅ Hero Section */}
      <section className="text-center max-w-3xl mx-auto mb-16">
        <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium mb-2">
          ✨ New Era of Coding ✨
        </p>
        <h2 className="text-4xl font-bold mb-4">Master Your Coding Journey</h2>
        <p className="text-gray-700 dark:text-gray-400 mb-6">
          Transform your programming skills with our revolutionary platform.
          Practice algorithms, compete with peers, and unlock your coding potential.
        </p>
        <button
          onClick={handleStartCoding}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2 rounded-full font-semibold shadow hover:scale-105 transition"
        >
          {username ? "Go to Practice →" : "Start Coding Now →"}
        </button>
      </section>

      {/* ✅ Motivation Section */}
      <section className="bg-gray-100 dark:bg-[#1a1a1a] p-6 rounded-xl text-center transition-colors">
        <h3 className="text-2xl font-semibold mb-2">🚀 Daily Coding Motivation</h3>
        <p className="text-gray-700 dark:text-gray-400">
          “Every great developer you know got there by solving problems they were unqualified to solve until they actually did it.” — Patrick McKenzie
        </p>
      </section>
    </div>
  );
};

export default Home;
