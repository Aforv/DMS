import React, { useState, useEffect } from "react";

const EditHospitalForm = ({ show, onClose, hospital, onUpdate }) => {
  const [formData, setFormData] = useState({});

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
    }
  }, [hospital]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(
      `http://43.250.40.133:5005/api/v1/hospitals/${hospital._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),  // send whole formData as simple object
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update hospital: ${response.status}`);
    }

    const updatedHospital = await response.json();
    console.log("Hospital updated successfully:", updatedHospital);

    setFormData({}); // clear form after update
    if (onUpdate) onUpdate(updatedHospital); // notify parent

  } catch (error) {
    console.error("Error updating hospital:", error);
  } finally {
    onClose(); // close modal regardless of success/failure
  }
};


  if (!show || !hospital) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>

      {/* Sliding Panel */}
      <div
        className={`relative mt-10 mr-4 w-full max-w-md bg-white shadow-2xl rounded-xl transform transition-transform duration-300 ease-in-out ${
          show ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-6 text-gray-800">
            Edit Hospital
          </h3>
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
