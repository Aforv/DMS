import { Button, Label, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiOutlineX } from "react-icons/hi";
import Snackbar from "@mui/material/Snackbar"; // ✅ Add this
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

  // ✅ Snackbar states
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const vertical = "bottom";
  const horizontal = "center";

  // Close Drawer and navigate back
  const closeDrawer = () => {
    setOpenDrawer(false);
    navigate(-1);
  };

  // ✅ Snackbar handler
  const handleSnackbarClose = () => {
    setSnackOpen(false);
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

        setCategoryData({
          category: data.data.name || "",
          description: data.data.description || "",
        });
      } catch (error) {
        console.error("Error fetching category:", error);
        setSnackMessage("Failed to load category");
        setSnackOpen(true);
        navigate("/categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id, token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryData.category.trim()) {
      setSnackMessage("Category name is required");
      setSnackOpen(true);
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

      setSnackMessage("Category updated successfully!");
      setSnackOpen(true);

      // Navigate after a short delay so user can read message
      setTimeout(() => {
        navigate("/categories");
      }, 1500);
    } catch (error) {
      console.error("Update failed:", error);
      setSnackMessage("Error updating category");
      setSnackOpen(true);
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-gray-500">Loading category...</div>;
  }

  return (
    openDrawer && (
      <>
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

        {/* ✅ Snackbar */}
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={snackOpen}
          onClose={handleSnackbarClose}
          message={snackMessage}
          autoHideDuration={3000}
          key={vertical + horizontal}
        />
      </>
    )
  );
};

export default EditCategory;
