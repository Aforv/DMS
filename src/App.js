
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import ProfilePage from "./components/ProfilePage";
import Layout from "./navigation/Layout";
import Overview from "./components/Dashboard/Overview";
import Daily from "./components/Dashboard/Reports/Daily";
import Monthly from "./components/Dashboard/Reports/Monthly";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import CategoriesPage from "./components/Categories/CategoriesPage";
import AddCategoryPage from "./components/Categories/AddCategoryPage";
import AddSubCategoryPage from "./components/Categories/AddSubCategoryPage";
import EditCategory from "./components/Categories/EditCategory";
import EditSubCategory from "./components/Categories/EditSubCategory";
function App() {
  return (
    <>
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
                    <Route path="/categories" element={<CategoriesPage />} />
                    <Route path="/add-category" element={<AddCategoryPage />} />
                    <Route path="/subcategories" element={<AddSubCategoryPage />} />

                    <Route path="/edit-category/:id" element={<EditCategory />} />
                    <Route path="/edit-subcategory/:id" element={<EditSubCategory />} />

                    <Route path="/dashboard/overview" element={<Overview />} />
                    <Route
                      path="/dashboard/reports/daily"
                      element={<Daily />}
                    />
                    <Route
                      path="/dashboard/reports/monthly"
                      element={<Monthly />}
                    />
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
