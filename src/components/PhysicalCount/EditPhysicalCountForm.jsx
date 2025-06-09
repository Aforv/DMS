import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../Authentication/AuthContext";

const EditPhysicalCountForm = ({ show, onClose, item, onUpdate }) => {
  const [formData, setFormData] = useState({
    countDate: "",
    location: "",
    countType: "",
    notes: "",
    status: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { token } = useAuth();

  // Initialize form when item is available
  useEffect(() => {
    if (show && item) {
      setFormData({
        countDate: item.countDate?.split("T")[0] || "",
        location: item.location || "",
        countType: item.countType || "",
        notes: item.notes || "",
        status: item.status || "",
      });
    }
  }, [show, item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.countDate) newErrors.countDate = "Count Date is required.";
    if (!formData.location) newErrors.location = "Location is required.";
    if (!formData.countType) newErrors.countType = "Count Type is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const response = await axios.put(
        `http://43.250.40.133:5005/api/v1/physical-counts/${item._id}/start`,
        formData,
        console.log("Form Data:", formData),
        
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if ([200, 201].includes(response.status)) {
        toast.success("Physical count updated successfully.");
        onUpdate(); // Refresh table
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        toast.error("Failed to update physical count.");
      }
    } catch (error) {
      const fallback =
        error?.response?.data?.message ||
        error?.message ||
        "An error occurred while updating the physical count.";

      toast.error(`${fallback}`);
    } finally {
      setLoading(false);
    }
  };

  if (!show || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-40">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black opacity-30" onClick={onClose}></div>

      {/* Drawer */}
      <div
        className={`relative bg-white w-full sm:max-w-md h-screen shadow-xl transform transition-transform duration-300 ease-in-out ${
          show ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          &times;
        </button>

        {/* Form */}
        <form onSubmit={handleSubmit} className="h-full overflow-y-auto p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Edit Physical Count
          </h2>

          {/* Count Date + Count Type in One Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Count Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="countDate"
                value={formData.countDate}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.countDate
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200"
                }`}
              />
              {errors.countDate && (
                <p className="mt-1 text-sm text-red-500">{errors.countDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Count Type <span className="text-red-500">*</span>
              </label>
              <select
                name="countType"
                value={formData.countType}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.countType
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200"
                }`}
              >
                <option value="">-- Select --</option>
                <option value="Full Count">Full Count</option>
                <option value="Cycle Count">Cycle Count</option>
              </select>
              {errors.countType && (
                <p className="mt-1 text-sm text-red-500">{errors.countType}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter location"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.location
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-200"
              }`}
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-500">{errors.location}</p>
            )}
          </div>

          {/* Notes */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes..."
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
            ></textarea>
          </div>

      
          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md transition ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Updating...
                </span>
              ) : (
                "Update"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPhysicalCountForm;