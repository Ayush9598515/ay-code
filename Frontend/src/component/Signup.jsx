import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
const AUTH_URL = import.meta.env.VITE_AUTH_URL || "http://localhost:2000";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    password: "",
    gender: "Male",
    subscriptionPlan: "Free",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const AUTH_URL = import.meta.env.VITE_AUTH_URL || "http://localhost:2000";

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const payload = {
      name: formData.name,
      email: formData.email,
      phonenumber: formData.phone,
      dateofbirth: formData.dob,
      password: formData.password,
      gender: formData.gender,
      subscription: formData.subscriptionPlan,
    };

    const res = await axios.post(`${AUTH_URL}/api/register`, payload);
    alert("Account created successfully 🎉");
    navigate("/login");
  } catch (err) {
    setError(err.response?.data?.error || "Registration failed");
  }
};


  return (
    <section className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-gray-800 text-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-6">Create Your Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400"
          />
          <input
            type="date"
            name="dob"
            placeholder="Date of Birth"
            value={formData.dob}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-md bg-gray-700 text-white"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400"
          />

          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={formData.gender === "Male"}
                onChange={handleChange}
                className="mr-2"
              />
              Male
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={formData.gender === "Female"}
                onChange={handleChange}
                className="mr-2"
              />
              Female
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="Other"
                checked={formData.gender === "Other"}
                onChange={handleChange}
                className="mr-2"
              />
              Other
            </label>
          </div>

          <div>
            <label htmlFor="subscriptionPlan" className="block mb-1 text-sm">
              Subscription Plan
            </label>
            <select
              name="subscriptionPlan"
              value={formData.subscriptionPlan}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-gray-700 text-white"
            >
              <option value="Free">Free</option>
              <option value="Basic">Basic</option>
              <option value="Premium">Premium</option>
            </select>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 underline">
            Sign In
          </Link>
        </p>
      </div>
    </section>
  );
};

export default SignUp;
