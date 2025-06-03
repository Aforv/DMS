import axios from "axios";
import React, { useState, useEffect } from "react";

const EditHospitalForm = ({ show, onClose, hospital, onUpdate }) => {
  const [formData, setFormData] = useState({});
  const [updateMessage, setUpdateMessage] = useState("");

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzE4M2UzMDRkYWI3NzA4NDE3ZDM1NyIsImlhdCI6MTc0ODg2OTU3MywiZXhwIjoxNzUxNDYxNTczfQ.GQ8JI7OeUW6dZA63JQLlErGWyTsNLuv1F2WiGRhQTXY";

  const fields = [
    { name: "name", type: "text" },
    { name: "email", type: "email" },
    { name: "phone", type: "tel", pattern: "[0-9+\\-\\s]+" },
    { name: "pincode", type: "text", pattern: "\\d{6}" },
    { name: "address", type: "text", span: 2 },
    { name: "city", type: "text" },
    { name: "state", type: "text" },
  ];

  useEffect(() => {
    if (hospital) {
      setFormData(hospital);
      setUpdateMessage("");
    }
  }, [hospital]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://43.250.40.133:5005/api/v1/hospitals/${hospital._id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedHospital = response.data.data;
      onUpdate(updatedHospital);
      setUpdateMessage("Hospital updated successfully!");

      // Close modal after 3 seconds
      setTimeout(() => {
        setUpdateMessage("");
        onClose();
      }, 3000);
    } catch (error) {
      console.error("Error updating hospital:", error);
      setUpdateMessage("Failed to update hospital. Please try again.");
    }
  };

  if (!show || !hospital) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
      <div
        className={`relative mt-10 mr-4 w-full max-w-md bg-white shadow-2xl rounded-xl transform transition-transform duration-300 ease-in-out ${
          show ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Edit Hospital
          </h3>

          {updateMessage && (
            <div className="mb-4 text-sm text-green-600 bg-green-100 p-2 rounded">
              {updateMessage}
            </div>
          )}

          <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
            {fields.map((field) => (
              <div
                key={field.name}
                className={`col-span-${field.span || 1} flex flex-col`}
              >
                <label className="text-sm font-medium text-gray-700 mb-1 capitalize">
                  {field.name}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  pattern={field.pattern}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}

            <div className="col-span-2 flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditHospitalForm;
