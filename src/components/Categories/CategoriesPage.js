import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openIndex, setOpenIndex] = useState(null);
  const [subcategories, setSubcategories] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const myToken = localStorage.getItem("Token");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://43.250.40.133:5005/api/v1/categories", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${myToken}`,
          },
        });

        const result = await response.json();
        const categoryList = result?.data || [];

        setCategories(categoryList);
        setFilteredCategories(categoryList);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchCategories();
  }, [myToken]);

  const handleToggle = async (index, categoryId) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);

      if (!subcategories[categoryId]) {
        setLoading(true);
        try {
          const response = await axios.get(
            `http://43.250.40.133:5005/api/v1/subcategories?category=${categoryId}`,
            {
              headers: {
                Authorization: `Bearer ${myToken}`,
              },
            }
          );
          setSubcategories((prev) => ({
            ...prev,
            [categoryId]: response.data?.data || [],
          }));
        } catch (error) {
          console.error("Failed to fetch subcategories:", error);
          setSubcategories((prev) => ({
            ...prev,
            [categoryId]: [],
          }));
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = categories.filter((cat) =>
      cat.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  const handleExportToExcel = () => {
    alert("Export to Excel feature coming soon!");
    // Can add XLSX.js export logic here later
  };

  // Delete category by ID
  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (!window.confirm(`Are you sure you want to delete category: ${categoryName}?`)) {
      return;
    }

    try {
      await axios.delete(`http://43.250.40.133:5005/api/v1/categories/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${myToken}`,
        },
      });

      // Remove deleted category from states
      setCategories((prev) => prev.filter((cat) => cat._id !== categoryId));
      setFilteredCategories((prev) => prev.filter((cat) => cat._id !== categoryId));
      // Also remove any subcategories cached
      setSubcategories((prev) => {
        const newSub = { ...prev };
        delete newSub[categoryId];
        return newSub;
      });

      alert(`Category "${categoryName}" deleted successfully.`);
    } catch (error) {
      console.error("Failed to delete category:", error);
      alert("Failed to delete category. Please try again.");
    }
  };

  // Delete subcategory by ID
  const handleDeleteSubcategory = async (categoryId, subcategoryId, subcategoryName) => {
    if (!window.confirm(`Are you sure you want to delete subcategory: ${subcategoryName}?`)) {
      return;
    }

    try {
      await axios.delete(`http://43.250.40.133:5005/api/v1/subcategories/${subcategoryId}`, {
        headers: {
          Authorization: `Bearer ${myToken}`,
        },
      });

      // Remove deleted subcategory from state
      setSubcategories((prev) => {
        const updatedSubs = prev[categoryId]?.filter((sub) => sub._id !== subcategoryId) || [];
        return {
          ...prev,
          [categoryId]: updatedSubs,
        };
      });

      alert(`Subcategory "${subcategoryName}" deleted successfully.`);
    } catch (error) {
      console.error("Failed to delete subcategory:", error);
      alert("Failed to delete subcategory. Please try again.");
    }
  };

 

  return (
    <div className="p-6 bg-white rounded-md shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">CATEGORIES</h2>
        <div className="flex gap-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => navigate("/add-category")}
          >
            + Add Categories
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => navigate("/subcategories")}
          >
            + Add SubCategories
          </button>
          <button
            className="bg-teal-700 text-white px-4 py-2 rounded hover:bg-teal-800"
            onClick={handleExportToExcel}
          >
            + Export to Excel
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search Categories..."
          className="border border-gray-300 rounded-md px-4 py-2 shadow-sm w-[250px]"
        />
      </div>

      {/* Categories List */}
      <div className="bg-white border rounded-md shadow-sm">
        {initialLoading ? (
          <div className="text-center py-4 text-gray-500">Loading categories...</div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No categories found.</div>
        ) : (
          filteredCategories.map((item, index) => (
            <div key={item._id || index} className="border-b hover:bg-gray-50 transition">
              <div
                className="flex justify-between items-center px-4 py-3 cursor-pointer"
                onClick={() => handleToggle(index, item._id)}
              >
                <div className="flex gap-4 items-center">
                  <span className="font-semibold">{index + 1}.</span>
                  <span className="font-medium text-gray-800">{item.name}</span>
                </div>
                <div className="flex gap-4">
                  <button className="text-blue-500 hover:underline"
                   onClick={() => navigate(`/edit-category/${item._id}`)}
                  >Edit</button>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Delete category: ${item.name}`);
                      handleDeleteCategory(item._id, item.name);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Expanded Subcategories */}
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-700">
                  <p className="mb-2">
                    <strong>Description:</strong> {item.description || "N/A"}
                  </p>
                  <div className="mt-2">
                    <strong>Subcategories:</strong>
                    {loading ? (
                      <p className="text-sm text-gray-500">Loading...</p>
                    ) : subcategories[item._id] && subcategories[item._id].length > 0 ? (
                      <table className="w-full text-sm text-left mt-2 border border-gray-300">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-2 border-b">#</th>
                            <th className="px-4 py-2 border-b">Subcategory Name</th>
                            <th className="px-4 py-2 border-b">Description</th>
                            <th className="px-4 py-2 border-b">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subcategories[item._id].map((sub, i) => (
                            <tr key={sub._id || i} className="hover:bg-gray-50">
                              <td className="px-4 py-2 border-b">{i + 1}</td>
                              <td className="px-4 py-2 border-b">{sub.name}</td>
                              <td className="px-4 py-2 border-b">{sub.description}</td>
                              <td className="px-4 py-2 border-b">
                                <button
                                  className="text-blue-600 hover:underline mr-4"
                                 onClick={() => navigate(`/edit-subcategory/${sub._id}`)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="text-red-600 hover:underline"
                                  alert={`Delete subcategory: ${sub.name}`}
                                  onClick={() => handleDeleteSubcategory(item._id, sub._id, sub.name)
                                }
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-sm text-gray-500">No subcategories found.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
