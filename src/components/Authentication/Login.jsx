// src/pages/Login.jsx
import { useState } from "react";
import { useAuth } from "./AuthContext"; // Assuming context is set
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard/overview";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await login(username, password);

    if (res.success) {
      navigate(from, { replace: true });
      localStorage.setItem("Token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzE4M2UzMDRkYWI3NzA4NDE3ZDM1NyIsImlhdCI6MTc0OTAwODQwMCwiZXhwIjoxNzUxNjAwNDAwfQ.Ox1GAlSDEXAPau98gmpizt_gXuMDAijA8K-mdigdLCQ"); // Store username in localStorage
    } else {
      setError(res.message || "Invalid username or password");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 animate-fade-in">
      <img
        src="https://lh3.googleusercontent.com/p/AF1QipNPhBBFyfSf3VNyH-AK1r-P3fDIV_P8P43-MvfV=s1360-w1360-h1020"
        alt="Company Logo"
        className="h-20 mb-8"
      />

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-80 animate-fade-in-up"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white mb-6">
          Sign In
        </h2>

        {error && (
          <div className="text-red-600 text-sm text-center mb-4 font-medium">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
