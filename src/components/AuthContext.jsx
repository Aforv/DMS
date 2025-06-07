// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import axiosInstance from "../utils/axiosInstancenew";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
 // const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken"));

  const login = async (username, password) => {
    try {
    const res = await axiosInstance.post("/api/login", {
        username,
        password,
      });
      localStorage.setItem("token", res.data.token);
      // localStorage.setItem('refreshToken', res.data.refreshToken);
      setToken(res.data.token);
     // setRefreshToken(res.data.refreshToken)
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
  //  localStorage.removeItem("refreshToken");
    setToken(null);
   // setRefreshToken(null);
  };

  return (

    // <AuthContext.Provider value={{ login, logout, token, refreshToken }}>
      <AuthContext.Provider value={{ login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
