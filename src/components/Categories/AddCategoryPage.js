import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  TextInput,
  Textarea,
  Spinner,
} from "flowbite-react";

const AddCategoryPage = () => {
  const [openModal, setOpenModal] = useState(true);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onCloseModal = () => {
    setOpenModal(false);
    navigate("/categories");
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
        alert("Category added successfully!");
        navigate("/categories");
      } else {
        alert(result.message || "Failed to add category");
      }
    } catch (error) {
      console.error("Error adding category:", error.message);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal show={openModal} size="lg" onClose={onCloseModal} popup>
        <ModalHeader>
          <h3 className="text-lg font-semibold text-gray-900">Add Category</h3>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="category" value="Category Name" />
              <TextInput
                id="category"
                placeholder="Enter category name"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="description" value="Description" />
              <Textarea
                id="description"
                placeholder="Enter description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
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
    </>
  );
};

export default AddCategoryPage;
