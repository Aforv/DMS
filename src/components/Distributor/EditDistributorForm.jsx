import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const EditDistributorForm = ({ show, setShow, fetchDistributors, selectedDistributor }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    address: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    if (selectedDistributor) {
      setFormData({ ...selectedDistributor });
    }
  }, [selectedDistributor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      const distributors = JSON.parse(localStorage.getItem("distributors")) || [];
      const updatedList = distributors.map((dist) =>
        dist._id === selectedDistributor._id ? formData : dist
      );

      localStorage.setItem("distributors", JSON.stringify(updatedList));
      toast.success("Distributor updated successfully");
      fetchDistributors();
      setShow(false);
    } catch (err) {
      toast.error("Error updating distributor");
    }
  };

  if (!show || !selectedDistributor) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-40 items-center" onClick={() => setShow(false)}>
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      <div className="relative bg-white w-full sm:max-w-md h-screen shadow-xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => setShow(false)} className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl">&times;</button>
        <form onSubmit={handleSubmit} className="h-full overflow-y-auto p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Edit Distributor</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input name="name" value={formData.name} onChange={handleChange} required className="mt-1 w-full border border-gray-300 rounded-md p-2" />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input name="email" value={formData.email} onChange={handleChange} required className="mt-1 w-full border border-gray-300 rounded-md p-2" />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input name="phone" value={formData.phone} onChange={handleChange} required className="mt-1 w-full border border-gray-300 rounded-md p-2" />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input name="location" value={formData.location} onChange={handleChange} required className="mt-1 w-full border border-gray-300 rounded-md p-2" />
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input name="address" value={formData.address} onChange={handleChange} required className="mt-1 w-full border border-gray-300 rounded-md p-2" />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input name="state" value={formData.state} onChange={handleChange} required className="mt-1 w-full border border-gray-300 rounded-md p-2" />
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Pincode</label>
              <input name="pincode" value={formData.pincode} onChange={handleChange} required className="mt-1 w-full border border-gray-300 rounded-md p-2" />
            </div>
          </div>

          <div className="col-span-2 flex justify-center items-center gap-4 pt-6">
            <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md">
              Update
            </button>
            <button
    type="button"
    onClick={() => setShow(false)}
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

export default EditDistributorForm;