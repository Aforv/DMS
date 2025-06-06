import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Label,
  Select,
  Spinner,
  TextInput,
} from "flowbite-react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Snackbar, Alert } from "@mui/material"; // ✅ Add this

const AddSubCategoryPage = () => {
  const [openModal, setOpenModal] = useState(true);
  const [subcategory, setSubCategory] = useState("");
  const [description, setDescription] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(true);

  const [snackbarOpen, setSnackbarOpen] = useState(false); // ✅ Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const onCloseModal = () => {
    setOpenModal(false);
    navigate("/categories");
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message, severity = "info") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    if (!token) {
      console.error("No token found in localStorage");
      showSnackbar("Please log in first.", "warning");
      navigate("/login");
      return;
    }

    const fetchCategories = async () => {
      try {
        setFetchingCategories(true);

        const response = await fetch("http://43.250.40.133:5005/api/v1/categories", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Server Error: ${response.status}`);
        }

        const data = await response.json();
        const categories = data?.data || [];

        if (Array.isArray(categories)) {
          setCategoryList(categories);
        } else {
          console.error("Unexpected category format:", data);
          showSnackbar("Unexpected category format", "error");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        showSnackbar("Failed to load categories. Please try again.", "error");
      } finally {
        setFetchingCategories(false);
      }
    };

    fetchCategories();
  }, [navigate, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCategory) {
      showSnackbar("Please select a category", "warning");
      return;
    }

    const payload = {
      category: selectedCategory,
      name: subcategory,
      description,
    };

    try {
      setLoading(true);
      const response = await fetch("http://43.250.40.133:5005/api/v1/subcategories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        showSnackbar("Subcategory added successfully!", "success");
        navigate("/categories");
      } else {
        showSnackbar(result.message || "Failed to add subcategory", "error");
      }
    } catch (error) {
      console.error("Error submitting subcategory:", error);
      showSnackbar("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!openModal) return null;

  return (
    <>
      <div className="fixed top-0 right-0 w-full md:w-[450px] h-full bg-white shadow-lg z-50 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-gray-900">Create Subcategory</h1>
          <button onClick={onCloseModal}>
            <XMarkIcon className="w-6 h-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="category" value="Select Category" />
            <Select
              id="category"
              required
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="mt-1"
              disabled={fetchingCategories}
            >
              <option value="">-- Select Categories --</option>
              {fetchingCategories ? (
                <option disabled>Loading categories...</option>
              ) : categoryList.length > 0 ? (
                categoryList.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))
              ) : (
                <option disabled>No categories found</option>
              )}
            </Select>
          </div>

          <div>
            <Label htmlFor="subcategory" value="Subcategory Name" />
            <TextInput
              id="subcategory"
              placeholder="Enter subcategory name"
              value={subcategory}
              onChange={(e) => setSubCategory(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description" value="Description" />
            <TextInput
              id="description"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              color="gray"
              type="button"
              onClick={onCloseModal}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Spinner size="sm" /> : "Create Subcategory"}
            </Button>
          </div>
        </form>
      </div>

      {/* ✅ Snackbar UI */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddSubCategoryPage;
