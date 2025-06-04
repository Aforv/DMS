import { useState, useEffect } from "react";

const EditSubCategory = ({ subcategoryId }) => {
  const [subcategoryData, setSubcategoryData] = useState({
    name: "",
    _id: "",
    description: "",
  });

  const [editing, setEditing] = useState(false);
  const [popupMessage, setPopupMessage] = useState(null);
  const myToken = localStorage.getItem("token");

  useEffect(() => {
    if (!subcategoryId) return;

    // ✅ Keep all fields, don't drop `description`
    setSubcategoryData({ name: "", _id: "", description: "" });

    const fetchSubcategory = async () => {
      try {
        const response = await fetch("http://43.250.40.133:5005/api/v1/subcategories", {
          headers: {
            Authorization: `Bearer ${myToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();

          // ✅ Defensive: Ensure data is an array before using `.find()`
          if (Array.isArray(data)) {
            const found = data.find((item) => item._id === subcategoryId);

            if (found) {
              setSubcategoryData({
                name: found.name || "",
                _id: found._id || "",
                description: found.description || "",
              });
            } else {
              console.warn("Subcategory not found!");
              setPopupMessage("Subcategory not found.");
            }
          } else {
            setPopupMessage("Invalid data format from API.");
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
      setPopupMessage("Subcategory ID is missing. Cannot update.");
      return;
    }

    try {
      const response = await fetch(
        `http://43.250.40.133:5005/api/v1/subcategories/${subcategoryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${myToken}`, // ✅ include token for auth
          },
          body: JSON.stringify({
            name: subcategoryData.name,
            description: subcategoryData.description,
          }),
        }
      );

      if (response.ok) {
        setPopupMessage("Subcategory updated successfully");
        setEditing(false);
      } else {
        const error = await response.json();
        setPopupMessage("Update failed: " + error.message);
      }
    } catch (err) {
      setPopupMessage("Error: " + err.message);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow max-w-sm mx-auto">
      {popupMessage && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-800 shadow border border-green-300">
          {popupMessage}
          <button
            className="float-right font-bold ml-2"
            onClick={() => setPopupMessage(null)}
          >
            ×
          </button>
        </div>
      )}

      {!editing ? (
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          onClick={() => setEditing(true)}
        >
          Edit
        </button>
      ) : (
        <div className="space-y-3">
          <input
            type="text"
            value={subcategoryData.name}
            placeholder="Enter Subcategory Name"
            onChange={(e) =>
              setSubcategoryData({ ...subcategoryData, name: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={subcategoryData.description}
            placeholder="Enter Subcategory Description"
            onChange={(e) =>
              setSubcategoryData({ ...subcategoryData, description: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
          <div className="flex justify-between">
            <button
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditSubCategory;
