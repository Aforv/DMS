
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const myToken = localStorage.getItem("token");
  const [openIndex, setOpenIndex] = useState(null);
  const [subcategories, setSubcategories] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://43.250.40.133:5005/api/v1/categories", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${myToken}`
          }
        });
        const data = await response.json();
        if (data) {
          setCategories(data);
          setFilteredCategories(data);
        } else {
          console.error("Failed to load categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

    const handleToggle = async (index, categoryId) => {
    if (openIndex === index) {
      setOpenIndex(null); // Collapse
    } else {
      setOpenIndex(index); // Expand
      if (!subcategories[categoryId]) {
        setLoading(true);
        try {
          const response = await axios.get(
            `http://43.250.40.133:5005/api/v1/subcategories?category=${categoryId}`
          );
          setSubcategories((prev) => ({
            ...prev,
            [categoryId]: response.data.data || [],
          }));
        } catch (error) {
          console.error('Failed to fetch subcategories:', error);
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
  };

  return (
    <div className="p-6 bg-white rounded-md shadow-md">
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

      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search Categories..."
          className="border border-gray-300 rounded-md px-4 py-2 shadow-sm w-[250px]"
        />
      </div>

      <div className="bg-white border rounded-md shadow-sm">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No categories found.</div>
        ) : (
          filteredCategories.map((item, index) => (
            <div key={item._id || index} className="border-b hover:bg-gray-50 transition">

              <div
                className="flex justify-between items-center px-4 py-3 cursor-pointer"
                onClick={() => handleToggle(index, item._id)}
              >
                {/* Left: Index + Category Name */}
                <div className="flex gap-4 items-center">
                  <span className="font-semibold">{index + 1}.</span>
                  <span className="font-medium text-gray-800">{item.name}</span>
                </div>

                {/* Right: Action Buttons */}
                <div className="flex gap-4">
                  <button className="text-blue-500 hover:underline">
                    Edit
                  </button>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent collapsing on click
                      alert(`Delete category: ${item.name}`);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>


              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-700">
                  < span className="flex flex-row justify-between items-center">
                    <p className="mb-2">
                      <strong>Description:</strong> {item.description}
                    </p>
                  </span>
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
                              <th className="px-4 py-2 border-b">description</th>
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
                                  onClick={() => alert(`Edit subcategory: ${sub.name}`)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="text-red-600 hover:underline"
                                  onClick={() => alert(`Delete subcategory: ${sub.name}`)}
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
