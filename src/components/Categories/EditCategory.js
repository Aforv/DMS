// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";

// const EditCategory = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const myToken = localStorage.getItem("token");

//   const [categoryData, setCategoryData] = useState({
//     category: "",
//     description: "",
//     _id: "",
//   });

//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCategory = async () => {
//       try {
//         const response = await axios.get(`http://43.250.40.133:5005/api/v1/categories/${id}`, {
//           headers: { Authorization: `Bearer ${myToken}` },
//         });
//         const foundCategory = response.data.data.category || response.data.category;      
//           setCategoryData({
//             category: foundCategory.name || "",
//             description: foundCategory.description || "",
//             _id: foundCategory._id,
     
//       } catch (error) {
//         console.error("Error loading category:", error);
//         alert("Failed to load category");
//         navigate("/categories");
     
//     };

//     fetchCategory();
//   }, [id, navigate, myToken]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setCategoryData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!categoryData.category.trim()) {
//       alert("Category name is required");
//       return;
//     }

//     try {
//       const response = await axios.put(
//         `http://43.250.40.133:5005/api/v1/categories/${categoryData._id}`,
//         {
//           name: categoryData.category,
//           description: categoryData.description,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${myToken}`,
//           },
//         }
//       );

//       console.log("Update response:", response.data);
//       alert("Category updated successfully!");
//       navigate("/categories");
//     } catch (error) {
//       console.error("Update failed", error);
//       alert("Error updating category");
//     }
//   };

//   if (loading) {
//     return <div className="text-center mt-10 text-gray-500">Loading category...</div>;
//   }

//   return (
//     <div className="p-6 bg-white rounded-md shadow-md max-w-xl mx-auto mt-6">
//       <h2 className="text-2xl font-bold mb-4">Edit Category</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Category</label>
//           <input
//             type="text"
//             name="category"
//             value={categoryData.category}
//             onChange={handleChange}
//             className="w-full mt-1 p-2 border rounded"
//             placeholder="Enter category name"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Description</label>
//           <input
//             type="text"
//             name="description"
//             value={categoryData.description}
//             onChange={handleChange}
//             className="w-full mt-1 p-2 border rounded"
//             placeholder="Enter category description"
//           />
//         </div>

//         <div className="flex justify-between">
//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//           >
//             Back
//           </button>

//           <button
//             type="submit"
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//           >
//             Update
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EditCategory;




















import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const myToken = localStorage.getItem("token");

  const [categoryData, setCategoryData] = useState({
    category: "",
    description: "",
    _id: "",
  });
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          `http://43.250.40.133:5005/api/v1/categories/${id}`,
          {
            headers: { Authorization: `Bearer ${myToken}` },
          }
        );
        console.log( response.data);
        // Check if fetched id matches the param id
        if (response.data && response.data._id === id) {
          setCategoryData({
            category: response.data.name || "",
            description: response.data.description || "",
            _id: response.data._id,
          });
          setLoading(false);
        } else {
          alert("Category not found or ID mismatch");
          navigate("/categories");
        }
      } catch (error) {
        console.error("Error loading category:", error);
        alert("Failed to load category");
        navigate("/categories");
      }
    };

    fetchCategory();
  }, [id, navigate, myToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryData.category.trim()) {
      alert("Category name is required");
      return;
    }

    // Check again if _id matches id param before updating
    if (categoryData._id !== id) {
      alert("Category ID mismatch. Update aborted.");
      return;
    }

    try {
      const response = await axios.put(
        `http://43.250.40.133:5005/api/v1/categories/${categoryData._id}`,
        {
          name: categoryData.category,
          description: categoryData.description,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${myToken}`,
          },
        }
      );

      console.log("Update response:", response.data);
      alert("Category updated successfully!");
      navigate("/categories");
    } catch (error) {
      console.error("Update failed", error);
      alert("Error updating category");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-500">Loading category...</div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-md shadow-md max-w-xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4">Edit Category</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            name="category"
            value={categoryData.category}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
            placeholder="Enter category name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <input
            type="text"
            name="description"
            value={categoryData.description}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
            placeholder="Enter category description"
          />
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back
          </button>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCategory;
