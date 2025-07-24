import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
const AUTH_URL = import.meta.env.VITE_AUTH_URL || "http://localhost:2000";
const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
   
    try {
      const res = await axios.post(
       `${AUTH_URL}/api/login`,
        formData,
        
        {
          withCredentials: true, // ✅ Important to receive cookie
        }
      );

      localStorage.setItem("username", res.data.username); // ✅ Save username to show later
      alert("Login Successful ✅");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex items-center justify-center px-6 py-12 transition-colors duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl w-full items-center">
        {/* Left: AyCode Image */}
        <div className="hidden md:block">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            alt="AyCode Illustration"
            className="w-full max-h-[400px] object-contain rounded-lg"
          />
        </div>

        {/* Right: Form */}
        <div className="w-full">
          <div className="text-center mb-8">
            <img
              className="mx-auto h-10 w-auto"
              src="https://flowbite.com/docs/images/logo.svg"
              alt="AyCode Logo"
            />
            <h2 className="mt-4 text-2xl font-bold tracking-tight">Sign in to your account</h2>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-400 outline outline-1 outline-gray-300 dark:outline-gray-700 focus:outline-indigo-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                name="password"
                id="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-400 outline outline-1 outline-gray-300 dark:outline-gray-700 focus:outline-indigo-500"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md shadow"
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Not a member?{" "}
            <Link to="/signup" className="text-indigo-600 hover:text-indigo-500 font-semibold">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
