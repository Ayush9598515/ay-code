import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const PrivateRoute = ({ children }) => {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
const AUTH_URL = import.meta.env.VITE_AUTH_URL || "http://localhost:2000";

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${AUTH_URL}/api/me`, {
          withCredentials: true,
        });
        if (res.data.user) {
          setIsAuthenticated(true);
        }
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  if (!authChecked) return <div className="text-center mt-10">Checking authentication...</div>;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
