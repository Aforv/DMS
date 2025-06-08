

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../Authentication/AuthContext";

const initialFormState = {
  countDate: "",
  location: "",
  countType: "",
  notes: "",
};

const AddPhysicalCountForm = ({ showModal, setShowModal, fetchData }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trimStart() }));
  };

  const resetForm = () => setFormData(initialFormState);

  useEffect(() => {
    if (showModal) {
      resetForm();
    }
  }, [showModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://43.250.40.133:5005/api/v1/physical-counts",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }
      );

      if ([200, 201].includes(response.status)) {
        toast.success("Physical count added successfully.");
        resetForm();
        fetchData();

        setTimeout(() => {
          setShowModal(false);
        }, 1000);
      } else {
        toast.error(response.data?.message || "Unexpected response from server.");
      }
    } catch (error) {
      const fallback =
        error?.response?.data?.message ||
        error?.message ||
        "An error occurred while adding the physical count.";

      toast.error(fallback);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "countDate", type: "date" },
    { name: "location", type: "text" },
    { name: "countType", type: "text" },
    { name: "notes", type: "text", span: 4, },
  ];

  return (
    <>
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-40"
          onClick={() => setShowModal(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black bg-opacity-40" />

          {/* Drawer */}
          <div
            className={`relative bg-white w-full sm:max-w-md h-screen shadow-xl transform transition-transform duration-300 ease-in-out ${
              showModal ? "translate-x-0" : "translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              &times;
            </button>

            {/* Form */}
            <form onSubmit={handleSubmit} className="h-full overflow-y-auto p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                Add New Physical Count
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {fields.map(({ name, type, span }) => (
                  <div key={name} className={span === 2 ? "sm:col-span-2" : ""}>
                    <label
                      htmlFor={name}
                      className="block text-sm font-medium text-gray-700 capitalize"
                    >
                      {name.replace(/([A-Z])/g, " $1").charAt(0).toUpperCase() + name.slice(1)}
                    </label>
                    <input
                      id={name}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      required
                      type={type}
                      className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-6 text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2 rounded-md font-semibold text-white transition ${
                    loading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 shadow"
                  }`}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddPhysicalCountForm;