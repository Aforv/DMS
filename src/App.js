 
"use client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfilePage from "./components/ProfilePage";
import Layout from "./navigation/Layout";
import Overview from "./components/Dashboard/Overview";
import Login from "./components/Authentication/Login";
import ProtectedRoute from "./components/Authentication/ProtectedRoute";
import Inventory from "./components/inventory/Inventory";
import DataTableWithMenu from "./components/inventory/DataTableWithFlowbite";
import CategoriesPage from "./components/Categories/CategoriesPage";
import AddCategoryPage from "./components/Categories/AddCategoryPage";
import AddSubCategoryPage from "./components/Categories/AddSubCategoryPage";
import EditCategory from "./components/Categories/EditCategory";
import EditSubCategory from "./components/Categories/EditSubCategory";
import Products from "./components/Products/Products";
import ProductsForm from "./components/Products/ProductsForm";
import DoctorsTable from "./components/Doctor/DoctorTable";
import HospitalTable from "./components/Hospitals/HospitalTable";
import UsersTable from "./components/UserManagement/UsersTable";
import InhouseInventory from "./components/inhouseInventory/InhouseInventory";
import PrinciplesModule from "./components/principle/principlemodule";
import DataTableWithMenuPrinciple from "./components/principle/dataTableWithFlowbite";
import DepartmentsManager from "./components/Departments/DepartmentsManager";
import InvoiceTable from "./components/Invoices/InvoiceTable";
import AddInvoiceForm from "./components/Invoices/AddInvoiceForm";
import InventoryAdjustments from "./components/Inventory Adjustments/InventoryAdjustment";
import PhysicalCountsTable from "./components/PhysicalCount/PhysicalCountsTable";
import AddNestedsubcategories from "./components/Categories/Addnestedsubcategories";

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
          {/* <Inventory/> */}
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
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/categories" element={<CategoriesPage />} />
                    <Route path="/add-category" element={<AddCategoryPage />} />
                    <Route path="/subcategories" element={<AddSubCategoryPage />} />
                    <Route path="/add-nestedsubcategories" element={<AddNestedsubcategories />} />
                    <Route path="/edit-category/:id" element={<EditCategory />} />
                    <Route path="/edit-subcategory/:id" element={<EditSubCategory />} />
                    <Route path="/products" element={<Products/>}/>
                     {/** product form do not need route */}
                    <Route path="/dashboard/overview" element={<Overview />} />
                    <Route path = "/inventory" element = {<Inventory/>}/>
                    <Route path="/doctor" element={<DoctorsTable />} />
                    <Route path="/hospitals/list" element={<HospitalTable />} />
                     <Route path="/physicalcount/list" element={<PhysicalCountsTable />} />
                    <Route path="/users/list" element={<UsersTable />} />
                    <Route path = "/inhouseinventory" element = {<InhouseInventory/>}/>
                    <Route path="/principle" element={<PrinciplesModule />} />
                    <Route path="/principle/list" element={< DataTableWithMenuPrinciple/>} />
                    <Route path="/department" element={<DepartmentsManager />} />
                    <Route path="/invoices/list" element={<InvoiceTable />} />
                    <Route path="/invoices/addinvoiceform" element={<AddInvoiceForm />} />
                    <Route path="/inventoryadjustment" element={<InventoryAdjustments/>}/>
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
