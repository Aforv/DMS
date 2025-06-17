import { useState, useEffect } from "react";
import axios from "axios"; // Keep axios if you plan to use later
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../Authentication/AuthContext"; // Assuming you have an AuthContext for authentication

// Initial form state with new fields
const initialFormState = {
  name: "",
  email: "",
  phone: "",
  location: "",
  address: "",
  state: "",
  pincode: "",
};

const AddDistributorForm = ({ show, setShow, fetchDistributors }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth(); // You can keep this for future auth checks

  useEffect(() => {
    if (show) {
      setFormData(initialFormState);
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trimStart() }));
  };
  const handleCancel = () => {
    setShow(false);     
    setFormData(initialFormState);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const distributors = JSON.parse(localStorage.getItem("distributors")) || [];

      const newDistributor = {
        _id: Date.now().toString(), // Generate a unique ID
        ...formData,
      };

      distributors.push(newDistributor);

      localStorage.setItem("distributors", JSON.stringify(distributors));

      toast.success("Distributor added successfully (saved locally)");

      setFormData(initialFormState);
      fetchDistributors(); // This should re-fetch from localStorage
      setTimeout(() => setShow(false), 1000);
    } catch (err) {
      toast.error("Error saving distributor");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-40 items-center" onClick={() => setShow(false)}>
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      <div className="relative bg-white w-full sm:max-w-md h-screen shadow-xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => setShow(false)} className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl">&times;</button>
        <form onSubmit={handleSubmit} className="h-full overflow-y-auto p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Add New Distributor</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                name="name"
                placeholder="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                name="email"
                type="email"
                placeholder="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                name="phone"
                placeholder="phone"
                type="tel"
                pattern="[0-9+\-\s]+"
                value={formData.phone}
                onChange={handleChange}
                required
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                name="location"
                placeholder="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                name="address"
                placeholder="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input
                name="state"
                placeholder="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Pincode</label>
              <input
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>

          <div className="pt-6 text-center flex justify-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-md font-semibold text-white ${
                loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 rounded-md font-semibold text-white bg-red-600 hover:bg-red-700 shadow"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDistributorForm;