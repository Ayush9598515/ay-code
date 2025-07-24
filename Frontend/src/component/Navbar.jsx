import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
const AUTH_URL = import.meta.env.VITE_AUTH_URL || "http://localhost:2000";

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const navigate = useNavigate();
  const location = useLocation();

  // 🔁 Check auth on route change
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${AUTH_URL}/api/me`, {
     withCredentials: true,
    });
        const nameFromRes = res.data.user.name?.split("@")[0] || res.data.user.email.split("@")[0];
        setIsLoggedIn(true);
        setUserName(nameFromRes);
        localStorage.setItem("username", nameFromRes);
      } catch (err) {
        setIsLoggedIn(false);
        setUserName("");
        localStorage.removeItem("username");
      }
    };

    checkAuth();
  }, [location]);

  // 🌗 Handle theme toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // 🚪 Logout handler
  const handleLogout = async () => {
    try {
      await axios.post(`${AUTH_URL}/api/logout`, {}, {
     withCredentials: true,
      });

      localStorage.removeItem("username");
      setIsLoggedIn(false);
      setUserName("");
      setDropdownOpen(false);
      navigate("/login");
      alert("You have been logged out.");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-[#0f172a] text-white shadow-md dark:bg-black">
      <div className="max-w-screen-xl mx-auto p-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="AyCode Logo" />
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
            AyCode
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link to="/" className="hover:text-purple-400">Home</Link>
          <Link to="/dashboard" className="hover:text-purple-400">Dashboard</Link>
          
          <Link to="/contest" className="hover:text-purple-400">Contest</Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-yellow-400 hover:text-yellow-300 text-lg"
            title="Toggle Theme"
          >
            {darkMode ? "🌙" : "☀️"}
          </button>

          {/* Auth Section */}
          {!isLoggedIn ? (
            <Link to="/login" className="bg-blue-600 px-4 py-2 rounded-md text-sm hover:bg-blue-700">
              Login
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-md text-sm hover:bg-gray-700"
              >
                <span>{userName || "User"}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-800"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-800"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
