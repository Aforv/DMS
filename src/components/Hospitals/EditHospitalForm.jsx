
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../Authentication/AuthContext";
import axiosInstance from "../../utils/axiosInstancenew";

const EditHospitalForm = ({ show, onClose, hospital, onUpdate }) => {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useAuth();
  
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
    setIsSubmitting(true);

    try {
      const response = await axiosInstance.put(
        `http://43.250.40.133:5005/api/v1/hospitals/${hospital._id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onUpdate();
      toast.success("Hospital updated successfully!");

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error updating hospital:", error);
      toast.error("Failed to update hospital. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show || !hospital) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black bg-opacity-40 ">
      <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
      <div
        className={`relative bg-white w-full sm:max-w-md h-full shadow-xl transform transition-transform duration-2000 ease-in-out ${
        show ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
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
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditHospitalForm;
