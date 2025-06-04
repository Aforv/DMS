// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
// import axios from "axios";
// import axiosInstance from "../utils/axiosInstance";
import axiosInstance from "../utils/axiosInstancenew";

const AuthContext = createContext();

export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken"));
//   const [loading, setLoading] = useState(true);

  // Setup axios default Authorization header if token exists
//   useEffect(() => {
//     if (token) {
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//       // Optionally fetch user profile here to validate token
//       fetchProfile();
//     } else {
//       delete axios.defaults.headers.common["Authorization"];
//       setToken(null);
//      // setUser(null);
//     }
//   }, [token]);

//   useEffect(() => {
//     if (token) {
//       // Optionally fetch user profile here to validate token
//      // fetchProfile();
//     } else {
//       setToken(null);
//      // setUser(null);
//     }
//   }, [token]);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       axios.get('/api/auth/me', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//         .then((res) => {
//           setUser(res.data);
//         })
//         .catch(() => {
//           localStorage.removeItem('token');
//           setUser(null);
//         })
//         .finally(() => setLoading(false));
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const fetchProfile = async () => {
//     try {
//     //   const res = await axios.get("http://localhost:4000/api/profile");
//       const res = await axiosInstance.get("/api/profile");
//      // setUser(res.data);
//     } catch {
//       logout();
//     }
//   };

  const login = async (username, password) => {
    try {
    //   const res = await axios.post("http://localhost:4000/api/login", {
    //     username,
    //     password,
    //   });
    // const res = await axiosInstance.post("/api/login", {
    //     username,
    //     password,
    //   });
    const res = await axiosInstance.post("/api/login", {
        username,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      setToken(res.data.token);
      setRefreshToken(res.data.refreshToken)
     // setUser(res.data.user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  };

  const logout = () => {
    // localStorage.clear();
    localStorage.removeItem("token");
     localStorage.removeItem("refreshToken");
    setToken(null);
    setRefreshToken(null);
   // setUser(null);
  };

  return (
    // <AuthContext.Provider value={{ user, login, logout, token }}>
    //   {children}
    // </AuthContext.Provider>

    <AuthContext.Provider value={{ login, logout, token, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}



/*
try {
      await instance({
        // url of the api endpoint (can be changed)
        url: "home/",
        method: "GET",
      }).then((res) => {
        // handle success
        console.log(res);
      });
    } catch (e) {
      // handle error
      console.error(e);
    }
  }

  postData = async (e) => {
    e.preventDefault();
    var data = {
      id: 1,
      name: "rohith",
    };
    try {
      await instance({
        // url of the api endpoint (can be changed)
        url: "profile-create/",
        method: "POST",
        data: data,
      }).then((res) => {
        // handle success
        console.log(res);
      });
    } catch (e) {
      // handle error
      console.error(e);
    }
  };

  putData = async (e) => {
    e.preventDefault();
    var data = {
      id: 1,
      name: "ndrohith",
    };
    try {
      await instance({
        // url of the api endpoint (can be changed)
        url: "profile-update/",
        method: "PUT",
        data: data,
      }).then((res) => {
        // handle success
        console.log(res);
      });
    } catch (e) {
      // handle error
      console.error(e);
    }
  };

  deleteData = async (e) => {
    e.preventDefault();
    var data = {
      id: 1,
    };
    try {
      await instance({
        // url of the api endpoint (can be changed)
        url: "profile-delete/",
        method: "DELETE",
        data: data,
      }).then((res) => {
        // handle success
        console.log(res);
      });
    } catch (e) {
      // handle error
      console.error(e);
    }
  };
*/