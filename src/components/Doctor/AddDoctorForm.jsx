import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select"; 
import { useAuth } from "../Authentication/AuthContext";

const initialFormState = {
  name: "",
  email: "",
  phone: "",
  specialization: "",
  hospitals: [], 
  location: "",
  targets: "",
};

const AddDoctorForm = ({ show, setShow, fetchDoctors }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (show) {
      setFormData(initialFormState);
      fetchHospitals();
    }
  }, [show]);

  const fetchHospitals = async () => {
    try {
      const res = await axios.get("http://43.250.40.133:5005/api/v1/hospitals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHospitals(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load hospitals");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trimStart() }));
  };

  const handleHospitalChange = (selectedOptions) => {
    const selectedIds = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
    setFormData((prev) => ({
      ...prev,
      hospitals: selectedIds,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name || !formData.email || !formData.phone || !formData.targets) {
      toast.error("Please fill all required fields");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
      };
      const res = await axios.post(
        "http://43.250.40.133:5005/api/v1/doctors",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if ([200, 201].includes(res.status)) {
        toast.success("Doctor added successfully");
        setFormData(initialFormState);
        fetchDoctors();
        setTimeout(() => setShow(false), 1000);
      } else {
        toast.error(res.data?.message || "Error from server");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error adding doctor");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  // Prepare options for react-select
  const hospitalOptions = hospitals.map((hosp) => ({
    value: hosp._id,
    label: hosp.name,
  }));

  const selectedHospitalOptions = hospitalOptions.filter((option) =>
    formData.hospitals.includes(option.value)
  );

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-40 items-center"
      onClick={() => setShow(false)}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      <div
        className="relative bg-white w-full sm:max-w-md h-screen shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setShow(false)}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          &times;
        </button>

        <form onSubmit={handleSubmit} className="h-full overflow-y-auto p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Add New Doctor
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                name="email"
                type="email"
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
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                pattern="[0-9+\-\s]+"
                required
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Specialization */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Specialization</label>
              <input
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Hospitals (Multi Select with react-select) */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Hospitals</label>
              <Select
                isMulti
                options={hospitalOptions}
                value={selectedHospitalOptions}
                onChange={handleHospitalChange}
                placeholder="Select hospitals..."
                className="mt-1"
              />
            </div>

            {/* Location */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-md p-2 "
              />
            </div>

            {/* Targets */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Targets</label>
              <input
                name="targets"
                value={formData.targets}
                onChange={handleChange}
                required
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>

          <div className="pt-6 text-center">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-md font-semibold text-white ${
                loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctorForm;