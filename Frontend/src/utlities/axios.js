import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:2000/api", // backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add auth token if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;