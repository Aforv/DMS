import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../Authentication/AuthContext";
import axiosInstance from "../../utils/axiosInstancenew";

const initialFormState = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  agreement: "",
  gst: "",
  pan: "",
  tan: "",
  addressAsPerGst: "",
  gstPercentage: "",
};

const AddHospitalForm = ({ showModal, setShowModal, fetchHospitals }) => {
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
      const response = await axiosInstance.post(
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
            className={`relative bg-white w-full sm:max-w-4xl h-screen shadow-xl transform transition-transform duration-300 ease-in-out ${
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
              <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                Add New Hospital
              </h2>
                
                {/* Basic Information Section */}
                <div>
    
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter hospital name"
                        type="text"
                        className="w-full border border-gray-300 px-3 py-2 rounded-md"
                      />
                    </div>

                     <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter email"
                        type="email"
                        className="w-full border border-gray-300 px-3 py-2 rounded-md"
                      />
                    </div>

                   
                    </div>

                     <div className="grid grid-cols-2 gap-4">
                   

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="Enter phone number"
                        type="tel"
                        pattern="[0-9+\-\s]+"
                        className="w-full border border-gray-300 px-3 py-2 rounded-md"
                      />
                    </div>

                      <div>
                      <label htmlFor="gst" className="block text-sm font-medium text-gray-700 mb-1">
                        GST Number
                      </label>
                      <input
                        id="gst"
                        name="gst"
                        value={formData.gst}
                        onChange={handleChange}
                        placeholder="Enter GST number"
                        type="text"
                        className="w-full border border-gray-300 px-3 py-2 rounded-md"
                      />
                    </div>
                    </div>
                 

                    <div className="grid grid-cols-2 gap-4">

                                <div>
                      <label htmlFor="pan" className="block text-sm font-medium text-gray-700 mb-1">
                        PAN Number
                      </label>
                      <input
                        id="pan"
                        name="pan"
                        value={formData.pan}
                        onChange={handleChange}
                        placeholder="Enter PAN"
                        type="text"
                        className="w-full border border-gray-300 px-3 py-2 rounded-md"
                      />
                    </div>

                      <div>
                      <label htmlFor="agreement" className="block text-sm font-medium text-gray-700 mb-1">
                        Agreement
                      </label>
                      <input
                        id="agreement"
                        name="agreement"
                        value={formData.agreement}
                        onChange={handleChange}
                        type="file"
                        className="w-full border border-gray-300 px-3 py-1.5 rounded-md"
                      />
                    </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                      <label htmlFor="addressAsPerGst" className="block text-sm font-medium text-gray-700 mb-1">
                        Address as per GST
                      </label>
                      <input
                        id="addressAsPerGst"
                        name="addressAsPerGst"
                        value={formData.addressAsPerGst}
                        onChange={handleChange}
                        placeholder="Enter GST registered address"
                        type="text"
                        className="w-full border border-gray-300 px-3 py-2 rounded-md"
                      />
                    </div>

                         <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          placeholder="City"
                          type="text"
                          className="w-full border border-gray-300 px-3 py-2 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                                              <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          required
                          placeholder="State"
                          type="text"
                          className="w-full border border-gray-300 px-3 py-2 rounded-md"
                        />
                      </div>

                    <div>
                      <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                        Pincode
                      </label>
                      <input
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                        placeholder="Enter 6-digit pincode"
                        type="text"
                        pattern="\d{6}"
                        className="w-full border border-gray-300 px-3 py-2 rounded-md"
                      />
                    </div>
                    </div>
                  </div>
                </div>
                 <div>
                </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  disabled={loading}
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