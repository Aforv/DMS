import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddCategoryPage = () => {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: category,
      description: description,
    };

    try {
      const response = await fetch("http://43.250.40.133:5005/api/v1/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to add category");
      }

      const result = await response.json();
      console.log("Category added:", result);

      // Redirect after success
      navigate("/categories");
    } catch (error) {
      console.error("Error:", error.message);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl mx-auto rounded shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Add Category</h2>
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
              <label className="block text-sm font-semibold mb-1">Category Name</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Category Name..."
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
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded text-gray-700 border border-green-300 hover:bg-green-200"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryPage;
