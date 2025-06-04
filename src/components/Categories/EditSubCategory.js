

import { Button, Label, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiOutlineX } from "react-icons/hi";
import axios from "axios";

const EditSubCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [openDrawer, setOpenDrawer] = useState(true);
  const [loading, setLoading] = useState(true);
  const [subCategoryData, setSubCategoryData] = useState({
    subcategory: "",
    description: "",
  });

  const closeDrawer = () => {
    setOpenDrawer(false);
    navigate(-1);
  };

  useEffect(() => {
    const fetchSubCategory = async () => {
      try {
        const { data } = await axios.get(
          `http://43.250.40.133:5005/api/v1/subcategories/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Fetched subcategory edit  data:", data.data);

        setSubCategoryData({
          subcategory: data.data.name || "",
          description: data.data.description || "",
        });
      } catch (error) {
        console.error("Error fetching subcategory:", error);
        alert("Failed to load subcategory");
        navigate("/categories");
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategory();
  }, [id, token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubCategoryData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subCategoryData.subcategory.trim()) {
      alert("Subcategory name is required");
      return;
    }

    try {
      await axios.put(
        `http://43.250.40.133:5005/api/v1/subcategories/${id}`,
        {
          name: subCategoryData.subcategory,
          description: subCategoryData.description,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Subcategory updated successfully!");
      navigate("/categories");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Error updating subcategory");
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-gray-500">Loading subcategory...</div>;
  }

  return (
    openDrawer && (
      <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-30">
        <div className="w-full max-w-md bg-white h-full shadow-lg p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Edit SubCategory</h3>
            <button onClick={closeDrawer}>
              <HiOutlineX className="w-6 h-6 text-gray-600 hover:text-red-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="subcategory" value="SubCategory" />
              <TextInput
                id="subcategory"
                name="subcategory"
                value={subCategoryData.subcategory}
                onChange={handleChange}
                placeholder="Enter subcategory name"
                required
              />
            </div>

            <div>
              <Label htmlFor="description" value="Description" />
              <TextInput
                id="description"
                name="description"
                value={subCategoryData.description}
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

export default EditSubCategory;
