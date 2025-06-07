// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Snackbar } from "@mui/material";

// const AddDepartment = () => {
//   const [openModal, setOpenModal] = useState(true);
//   const [department, setDepartment] = useState("");
//   const [description, setDescription] = useState("");
//   const [manager, setManager] = useState(""); // NEW
//   const [parentDepartment, setParentDepartment] = useState(""); 
//   const [loading, setLoading] = useState(false);

//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const vertical = "bottom";
//   const horizontal = "right";

//   const navigate = useNavigate();

//   const onCloseModal = () => {
//     setOpenModal(false);
//     navigate("/departments");
//   };

//   const handleSnackbarClose = () => {
//     setSnackbarOpen(false);
//   };

//   const showSnackbar = (message) => {
//     setSnackbarMessage(message);
//     setSnackbarOpen(true);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const payload = {
//       name: department,
//       description,
//       manager,
//       parentDepartment,
//     };

//     try {
//       setLoading(true);
//       const response = await fetch("http://43.250.40.133:5005/api/v1/departments", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       const result = await response.json();
//       console.log("Response:", result);

//       if (response.ok) {
//         showSnackbar("✅ Department added successfully!");
//         setTimeout(() => navigate("/departments"), 1500);
//       } else {
//         showSnackbar(result.message || "❌ Failed to add department");
//       }
//     } catch (error) {
//       console.error("Error adding department:", error.message);
//       showSnackbar("❌ Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     openModal && (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
//         <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-xl p-6">
//           <div className="flex justify-between items-center border-b pb-4 mb-6">
//             <h2 className="text-xl font-semibold text-gray-800">Add Department</h2>
//             <button
//               onClick={onCloseModal}
//               className="text-gray-500 hover:text-gray-800 text-2xl"
//             >
//               &times;
//             </button>
//           </div>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
//                 Department Name
//               </label>
//               <input
//                 type="text"
//                 id="department"
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 placeholder="Enter department name"
//                 value={department}
//                 onChange={(e) => setDepartment(e.target.value)}
//                 required
//               />
//             </div>

//             <div>
//               <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
//                 Description
//               </label>
//               <textarea
//                 id="description"
//                 rows="3"
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 placeholder="Enter description..."
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//               />
//             </div>

//             <div>
//               <label htmlFor="manager" className="block text-sm font-medium text-gray-700 mb-1">
//                 Manager ID
//               </label>
//               <input
//                 type="text"
//                 id="manager"
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 placeholder="Enter manager user ID"
//                 value={manager}
//                 onChange={(e) => setManager(e.target.value)}
//               />
//             </div>

//             <div>
//               <label htmlFor="parentDept" className="block text-sm font-medium text-gray-700 mb-1">
//                 Parent Department ID
//               </label>
//               <input
//                 type="text"
//                 id="parentDept"
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 placeholder="Enter parent department ID"
//                 value={parentDepartment}
//                 onChange={(e) => setParentDepartment(e.target.value)}
//               />
//             </div>

//             <div className="flex justify-end gap-4">
//               <button
//                 type="button"
//                 onClick={onCloseModal}
//                 disabled={loading}
//                 className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-100 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
//               >
//                 {loading ? "Submitting..." : "Create Department"}
//               </button>
//             </div>
//           </form>

//           {/* Snackbar Component */}
//           <Snackbar
//             anchorOrigin={{ vertical, horizontal }}
//             open={snackbarOpen}
//             onClose={handleSnackbarClose}
//             message={snackbarMessage}
//             autoHideDuration={3000}
//             key={vertical + horizontal}
//           />
//         </div>
//       </div>
//     )
//   );
// };

// export default AddDepartment;























import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Snackbar } from "@mui/material";

const AddDepartment = () => {
  const [openModal, setOpenModal] = useState(true);
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [manager, setManager] = useState("");
  const [parentDepartment, setParentDepartment] = useState("");
  const [loading, setLoading] = useState(false);

  const [managersList, setManagersList] = useState([]);
  const [departmentsList, setDepartmentsList] = useState([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const vertical = "bottom";
  const horizontal = "right";
  const token = localStorage.getItem("myToken");
  const navigate = useNavigate();

  const onCloseModal = () => {
    setOpenModal(false);
    navigate("/departments");
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

   // 🔽 Fetch Managers and Departments for dropdowns
useEffect(() => {
  const fetchData = async () => {
    try {


      const [usersRes, deptsRes] = await Promise.all([
        fetch("http://43.250.40.133:5005/api/v1/users", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }),
        fetch("http://43.250.40.133:5005/api/v1/departments", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
      ]);

      if (!usersRes.ok || !deptsRes.ok) {
        throw new Error("Unauthorized access. Please login again.");
      }

      const [usersData, departmentsData] = await Promise.all([
        usersRes.json(),
        deptsRes.json()
      ]);

      setManagersList(usersData?.data || []);
      setDepartmentsList(departmentsData?.data || []);
    } catch (error) {
      console.error("Error fetching dropdown data:", error.message);
      showSnackbar("❌ Failed to fetch dropdown data. Please login again.");
    }
  };

  fetchData();
}, []);

 const handleSubmit = async (e) => {
  e.preventDefault();

 

  const payload = {
    name: department,
    description,
    manager,
    parentDepartment,
  };

  try {
    setLoading(true);
    const response = await fetch("http://43.250.40.133:5005/api/v1/departments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log("Response:", result);

    if (response.ok) {
      showSnackbar("✅ Department added successfully!");
      setTimeout(() => navigate("/departments"), 1500);
    } else {
      showSnackbar(result.message || "❌ Failed to add department");
    }
  } catch (error) {
    console.error("Error adding department:", error.message);
    showSnackbar("❌ Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};

 
  return (
    openModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
        <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-xl p-6">
          <div className="flex justify-between items-center border-b pb-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Add Department</h2>
            <button
              onClick={onCloseModal}
              className="text-gray-500 hover:text-gray-800 text-2xl"
            >
              &times;
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                Department Name
              </label>
              <input
                type="text"
                id="department"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter department name"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                rows="3"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="manager" className="block text-sm font-medium text-gray-700 mb-1">
                Manager
              </label>
              <select
                id="manager"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={manager}
                onChange={(e) => setManager(e.target.value)}
              >
                <option value="">Select Manager</option>
                {managersList.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name || user.email || user._id}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="parentDept" className="block text-sm font-medium text-gray-700 mb-1">
                Parent Department
              </label>
              <select
                id="parentDept"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={parentDepartment}
                onChange={(e) => setParentDepartment(e.target.value)}
              >
                <option value="">Select Parent Department</option>
                {departmentsList.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name || dept._id}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onCloseModal}
                disabled={loading}
                className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                {loading ? "Submitting..." : "Create Department"}
              </button>
            </div>
          </form>

          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={snackbarOpen}
            onClose={handleSnackbarClose}
            message={snackbarMessage}
            autoHideDuration={3000}
            key={vertical + horizontal}
          />
        </div>
      </div>
    )
  );
};

export default AddDepartment;
