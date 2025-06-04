// import { Button, Label, TextInput } from "flowbite-react";
// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { HiOutlineX } from "react-icons/hi";
// import axios from "axios";

// const EditCategory = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const token = localStorage.getItem("token");

//   const [openDrawer, setOpenDrawer] = useState(true);
//   const [loading, setLoading] = useState(true);
//   const [categoryData, setCategoryData] = useState({
//     category: "",
//     description: "",
//     _id: "",
//   });

//   const closeDrawer = () => {
//     setOpenDrawer(false);
//     navigate(-1);
//   };

//   useEffect(() => {
//     const fetchCategory = async () => {
//       try {
//         const { data } = await axios.get(
//           `http://43.250.40.133:5005/api/v1/categories/${id}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
      
//         console.log( data);
       
//         if (data || data._id === id) {
//           setCategoryData({
//             category: data.name || "",
//             description: data.description || "",
//             _id: data._id 
//           });
//           setLoading(false);
//         } else {
//           alert("Category not found or ID mismatch");
//           navigate("/categories");
//         }
//       } catch (error) {
//         console.error("Error loading category:", error);
//         alert("Failed to load category");
//         navigate("/categories");
//       }
//     };

//     fetchCategory();
//   }, [id, navigate, token]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setCategoryData((prev) => ({ ...prev, [name]: value }));
//   };



// const handleSubmit = async (e) => {
//   e.preventDefault();

//   if (!categoryData.category.trim()) {
//     alert("Category name is required");
//     return;
//   }

//   if (categoryData._id !== id) {
//     alert("Category ID mismatch. Update aborted.");
//     return;
//   }

//   try {
//     await axios.put(
//       `http://43.250.40.133:5005/api/v1/categories/${id}`,
//       {
//         name: categoryData.category,
//         description: categoryData.description,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     alert("Category updated successfully!");
//     navigate("/categories"); // Navigate back to list
//   } catch (error) {
//     console.error("Update failed", error);
//     alert("Error updating category");
//   }
// };


//   if (loading) {
//     return <div className="text-center mt-10 text-gray-500">Loading category...</div>;
//   }

//   return (
//     openDrawer && (
//       <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-30">
//         <div className="w-full max-w-md bg-white h-full shadow-lg p-6 overflow-y-auto">
//           {/* Header */}
//           <div className="flex justify-between items-center mb-6">
//             <h3 className="text-xl font-semibold text-gray-800">Edit Category</h3>
//             <button onClick={closeDrawer}>
//               <HiOutlineX className="w-6 h-6 text-gray-600 hover:text-red-500" />
//             </button>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div>
//               <Label htmlFor="category" value="Category" />
//               <TextInput
//                 id="category"
//                 name="category"
//                 value={categoryData.category}
//                 onChange={handleChange}
//                 placeholder="Enter category name"
//                 required
//               />
//             </div>
//             <div>
//               <Label htmlFor="description" value="Description" />
//               <TextInput
//                 id="description"
//                 name="description"
//                 value={categoryData.description}
//                 onChange={handleChange}
//                 placeholder="Enter description"
//                 required
//               />
//             </div>

//             <div className="flex justify-between mt-4">
//               <Button color="gray" onClick={closeDrawer} type="button">
//                 Cancel
//               </Button>
//               <Button type="submit">Update</Button>
//             </div>
//           </form>
//         </div>
//       </div>
//     )
//   );
// };

// export default EditCategory;























import { Button, Label, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiOutlineX } from "react-icons/hi";
import axios from "axios";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [openDrawer, setOpenDrawer] = useState(true);
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState({
    category: "",
    description: "",
  });

  // Close Drawer and navigate back
  const closeDrawer = () => {
    setOpenDrawer(false);
    navigate(-1);
  };

  // Fetch category details
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const { data } = await axios.get(
          `http://43.250.40.133:5005/api/v1/categories/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Fetched category data:", data);
        
       console.log(data);
  
        setCategoryData({
          category: data.name || "",
          description: data.description || "",
        });
      } catch (error) {
        console.error("Error fetching category:", error);
        alert("Failed to load category");
        navigate("/categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id, token, navigate]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit updated category
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryData.category.trim()) {
      alert("Category name is required");
      return;
    }

    try {
      await axios.put(
        `http://43.250.40.133:5005/api/v1/categories/${id}`,
        {
          name: categoryData.category,
          description: categoryData.description,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Category updated successfully!");
      navigate("/categories");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Error updating category");
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-gray-500">Loading category...</div>;
  }

  return (
    openDrawer && (
      <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-30">
        <div className="w-full max-w-md bg-white h-full shadow-lg p-6 overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Edit Category</h3>
            <button onClick={closeDrawer}>
              <HiOutlineX className="w-6 h-6 text-gray-600 hover:text-red-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="category" value="Category" />
              <TextInput
                id="category"
                name="category"
                value={categoryData.category}
                onChange={handleChange}
                placeholder="Enter category name"
                required
              />
            </div>

            <div>
              <Label htmlFor="description" value="Description" />
              <TextInput
                id="description"
                name="description"
                value={categoryData.description}
                onChange={handleChange}
                placeholder="Enter description"
                required
              />
            </div>

            <div className="flex justify-between mt-4">
              <Button color="gray" onClick={closeDrawer} type="button">
                Cancel
              </Button>
              <Button type="submit">Update</Button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default EditCategory;
