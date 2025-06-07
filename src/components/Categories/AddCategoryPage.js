import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Snackbar } from "@mui/material";

const AddCategoryPage = () => {
  const [openModal, setOpenModal] = useState(true);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const vertical = "bottom";
  const horizontal = "right";

  const navigate = useNavigate();

  const onCloseModal = () => {
    setOpenModal(false);
    navigate("/categories");
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: category,
      description: description,
    };

    try {
      setLoading(true);
      const response = await fetch("http://43.250.40.133:5005/api/v1/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        showSnackbar("✅ Category added successfully!");
        setTimeout(() => navigate("/categories"), 1500); // Delay to let user see snackbar
      } else {
        showSnackbar(result.message || "❌ Failed to add category");
      }
    } catch (error) {
      console.error("Error adding category:", error.message);
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
            <h2 className="text-xl font-semibold text-gray-800">Add Category</h2>
            <button
              onClick={onCloseModal}
              className="text-gray-500 hover:text-gray-800 text-2xl"
            >
              &times;
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category Name
              </label>
              <input
                type="text"
                id="category"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter category name"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
                {loading ? "Submitting..." : "Create Category"}
              </button>
            </div>
          </form>

          {/* Snackbar Component */}
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

export default AddCategoryPage;
