import { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  TextInput,
  Label,
} from "flowbite-react";

const EditSubCategory = ({ subcategoryId, openModal, setOpenModal }) => {
  const [subcategoryData, setSubcategoryData] = useState({
    name: "",
    description: "",
  });
  const [popupMessage, setPopupMessage] = useState(null);

  const myToken = localStorage.getItem("token");

  useEffect(() => {
    if (!subcategoryId) return;

    const fetchSubcategory = async () => {
      try {
        const response = await fetch(
          "http://43.250.40.133:5005/api/v1/subcategories",
          {
            headers: {
              Authorization: `Bearer ${myToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const found = Array.isArray(data)
            ? data.find((item) => item._id === subcategoryId)
            : null;

          if (found) {
            setSubcategoryData({
              name: found.name,
              description: found.description,
            });
          } else {
            setPopupMessage("Subcategory not found.");
          }
        } else {
          setPopupMessage("Failed to load subcategories");
        }
      } catch (error) {
        setPopupMessage("Error: " + error.message);
      }
    };

    fetchSubcategory();
  }, [subcategoryId, myToken]);

  const handleUpdate = async () => {
    if (!subcategoryId) {
      setPopupMessage("Subcategory ID is missing.");
      return;
    }

    try {
      const response = await fetch(
        `http://43.250.40.133:5005/api/v1/subcategories/${subcategoryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${myToken}`,
          },
          body: JSON.stringify(subcategoryData),
        }
      );

      if (response.ok) {
        setPopupMessage("Subcategory updated successfully");
        setOpenModal(false);
      } else {
        const error = await response.json();
        setPopupMessage("Update failed: " + error.message);
      }
    } catch (err) {
      setPopupMessage("Error: " + err.message);
    }
  };

  const onCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Modal show={openModal} size="md" onClose={onCloseModal} popup>
      <ModalHeader />
      <ModalBody>
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Edit Subcategory
          </h3>

          {popupMessage && (
            <div className="p-3 rounded bg-green-100 text-green-800 border border-green-300">
              {popupMessage}
              <button
                className="float-right font-bold ml-2"
                onClick={() => setPopupMessage(null)}
              >
                ×
              </button>
            </div>
          )}

          <div>
            <Label htmlFor="subcategory-name">Subcategory Name</Label>
            <TextInput
              id="subcategory-name"
              placeholder="Enter name"
              value={subcategoryData.name}
              onChange={(e) =>
                setSubcategoryData({ ...subcategoryData, name: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="subcategory-desc">Description</Label>
            <TextInput
              id="subcategory-desc"
              placeholder="Enter description"
              value={subcategoryData.description}
              onChange={(e) =>
                setSubcategoryData({
                  ...subcategoryData,
                  description: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="flex justify-between">
            <Button color="blue" onClick={handleUpdate}>
              Save
            </Button>
            <Button color="gray" onClick={onCloseModal}>
              Cancel
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default EditSubCategory;
