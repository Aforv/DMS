"use client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import ProfilePage from "./components/ProfilePage";
import Layout from "./navigation/Layout";
import Overview from "./components/Dashboard/Overview";
import Daily from "./components/Dashboard/Reports/Daily";
import Monthly from "./components/Dashboard/Reports/Monthly";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import HospitalTable from "./components/Hospitals/HospitalTable";

function App() {
  return (
    <>
    <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
        <Routes>
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                   <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-5"> 
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/dashboard/overview" element={<Overview />} />
                    <Route
                      path="/dashboard/reports/daily"
                      element={<Daily />}
                    />
                    <Route
                      path="/dashboard/reports/monthly"
                      element={<Monthly />}
                    />
                    <Route path="/hospitals/list" element={<HospitalTable />} />
                    
                    {/* Add more protected routes here */}
                  </Routes>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
    
    </>
  );
}

export default App;
