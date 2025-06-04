


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  TextInput,
  Select,
  Spinner,
} from "flowbite-react";

const AddSubCategoryPage = () => {
  const [openModal, setOpenModal] = useState(true);
  const [subcategory, setSubCategory] = useState("");
  const [description, setDescription] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const onCloseModal = () => {
    setOpenModal(false);
    navigate("/categories");
  };

  useEffect(() => {
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    const fetchCategories = async () => {
      try {
        const response = await fetch("http://43.250.40.133:5005/api/v1/categories", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },  
        });
 
 
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to fetch categories:", errorData);
          return;
        }

        const data = await response.json();
        console.log("Categories API response:", data);

        // Adjust this according to your API response
        const categories = data?.data?.categories || data?.categories || [];

        if (Array.isArray(categories)) {
          setCategoryList(categories);
        } else {
          console.error("Invalid category response format:", data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCategory) {
      alert("Please select a category");
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
        alert("Subcategory added successfully!");
        navigate("/categories");
      } else {
        alert(result.message || "Failed to add subcategory");
      }
    } catch (error) {
      console.error("Error submitting subcategory:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={openModal} size="lg" onClose={onCloseModal} popup>
      <ModalHeader>
        <span className="text-lg font-semibold text-gray-900">Add Subcategory</span>
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="category" value="Select Department" />
            <Select
              id="category"
              required
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">-- Select Department --</option>
              {categoryList.length > 0 ? (
                categoryList.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))
              ) : (
                <option disabled>No categories available</option>
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
            />
          </div>

          <div>
            <Label htmlFor="description" value="Description" />
            <TextInput
              id="description"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              color="gray"
              type="button"
              onClick={onCloseModal}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Spinner size="sm" /> : "Submit"}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default AddSubCategoryPage;
















































