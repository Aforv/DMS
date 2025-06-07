import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialFormState = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

const AddHospitalForm = ({ showModal, setShowModal, fetchHospitals }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzE4M2UzMDRkYWI3NzA4NDE3ZDM1NyIsImlhdCI6MTc0ODg2OTU3MywiZXhwIjoxNzUxNDYxNTczfQ.GQ8JI7OeUW6dZA63JQLlErGWyTsNLuv1F2WiGRhQTXY";

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
        "http://43.250.40.133:5005/api/v1/hospitals",
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
        toast.success("Hospital added successfully.");
        resetForm();
        fetchHospitals();

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
        "An error occurred while adding the hospital.";

      toast.error(fallback);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "name", type: "text" },
    { name: "email", type: "email" },
    { name: "phone", type: "tel", pattern: "[0-9+\\-\\s]+" },
    { name: "pincode", type: "text", pattern: "\\d{6}" },
    { name: "address", type: "text", span: 2 },
    { name: "city", type: "text" },
    { name: "state", type: "text" },
  ];

  return (
    <>
      {showModal && (
  <div
    className="fixed inset-0 z-50 flex justify-end align-center bg-black bg-opacity-40 items-center"
    onClick={() => setShowModal(false)} // Close on backdrop click
  >
    {/* Backdrop */}
    <div className="absolute inset-0 bg-black bg-opacity-40" />

    {/* Drawer */}
    <div
  className={`relative bg-white w-full sm:max-w-md h-screen shadow-xl transform transition-transform duration-2000 ease-in-out ${
    showModal ? "translate-x-0" : "translate-x-full"
  }`} 
      style={{ height: "80vh", borderRadius: "10px"  }}
     
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
          Add New Hospital
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(({ name, type, pattern, span }) => (
            <div key={name} className={span === 2 ? "sm:col-span-2" : ""}>
              <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700 capitalize"
              >
                {name}
              </label>
              <input
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required
                type={type}
                pattern={pattern}
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

export default AddHospitalForm;
