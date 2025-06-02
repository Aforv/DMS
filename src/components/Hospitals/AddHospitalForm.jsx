import { useState } from "react";
import axios from "axios";

const initialFormState = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

const AddHospitalForm = ({ showModal, setShowModal}) => {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzE4M2UzMDRkYWI3NzA4NDE3ZDM1NyIsImlhdCI6MTc0ODg2OTU3MywiZXhwIjoxNzUxNDYxNTczfQ.GQ8JI7OeUW6dZA63JQLlErGWyTsNLuv1F2WiGRhQTXY'
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trimStart() }));
  };

  const resetForm = () => setFormData(initialFormState);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      console.log(formData);
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
        setMessage({ text: "Hospital added successfully.", type: "success" });
        resetForm();
        
      } else {
        setMessage({
          text: response.data?.message || "Unexpected response from server.",
          type: "error",
        });
      }
    } catch (error) {
      const fallback =
        error?.response?.data?.message ||
        error?.message ||
        "An error occurred while adding the hospital.";

      setMessage({ text: fallback, type: "error" });
    } finally {
      setLoading(false);
    }
  };

const fields = [
  { name: "name", type: "text" },
  { name: "email", type: "email" },
  { name: "phone", type: "tel", pattern: "[0-9+\\-\\s]+" },
  { name: "pincode", type: "text", pattern: "\\d{6}" },
  { name: "address", type: "text", span: 2 },  // custom property to control span
  { name: "city", type: "text" },
  { name: "state", type: "text" },
];

  return (
    <>
     {showModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-end bg-black bg-opacity-40">
        <div
          className={`
            bg-white rounded-lg shadow-lg w-full sm:max-w-2xl p-6 relative transform transition-all duration-500 ease-in-out
            ${showModal ? "translate-x-0" : "translate-x-full"}
          `}
        >
          {/* Close Button */}
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
          >
            &times;
          </button>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Add New Hospital</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map(({ name, type, pattern, span }) => (
                <div key={name} className={span === 2 ? "sm:col-span-2" : ""}>
                  <label htmlFor={name} className="block text-sm font-medium text-gray-700 capitalize">
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
            <div className="pt-4 text-center">
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

            {message.text && (
              <div
                className={`text-sm text-center mt-2 ${
                  message.type === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {message.text}
              </div>
            )}
          </form>
        </div>
      </div>
    )}
    </>
  );
};

export default AddHospitalForm;
