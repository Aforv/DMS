

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddSubCategoryPage = () => {
  const [subcategory, setSubCategory] = useState("");
  const [description, setDescription] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
const myToken = localStorage.getItem("token");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://43.250.40.133:5005/api/v1/categories",{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${myToken}` 
        } 
      });
        const data = await response.json();
        
        if (data) {
          setCategoryList(data);
        } else {
          console.error("Failed to load categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      category: selectedCategory,
      name: subcategory,
      description,
    };

const token = localStorage.getItem("token");
    try {
      setLoading(true);
      const response = await fetch("http://43.250.40.133:5005/api/v1/subcategories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Subcategory added successfully!");
        navigate("/categories");
      } else {
        alert(result.message || "Failed to add subcategory");
      }
    } catch (error) {
      console.error("Error submitting subcategory:", error);
      alert("Error submitting subcategory");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl mx-auto rounded shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Add Subcategory</h2>
          <button
            className="text-gray-500 hover:text-red-500 text-lg font-bold"
            onClick={() => navigate("/categories")}
          >
            X
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-1">Select Department</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                required
                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select Department --</option>
                {categoryList.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Subcategory Name</label>
              <input
                type="text"
                value={subcategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Subcategory Name..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter description..."
                rows={3}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/categories")}
              className="px-6 py-2 rounded text-gray-700 border border-gray-300 hover:bg-gray-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded text-gray-700 border border-green-300 hover:bg-green-200"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubCategoryPage;
