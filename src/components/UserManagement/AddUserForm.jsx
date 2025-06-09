import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../Authentication/AuthContext";

const initialFormState = {
  name: "",
  email: "",
  password: "",
  status: "active",
  roles: [],
};

const fields = [
  { name: "name", type: "text", label: "Full Name" },
  { name: "email", type: "email", label: "Email" },
  { name: "password", type: "password", label: "Password" },
  { name: "status", type: "select", label: "Status", options: ["active", "inactive"] },
  { name: "roles", type: "multi-select", label: "Roles", options: ["user", "admin"], span: 2 },
];

const AddUserForm = ({ showModal, setShowModal, onSuccess }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRolesDropdown, setShowRolesDropdown] = useState(false);

  useEffect(() => {
    if (showModal) {
      setFormData(initialFormState);
      setError("");
    }
  }, [showModal]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".roles-dropdown")) {
        setShowRolesDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleRole = (role) => {
    setFormData((prev) => {
      const exists = prev.roles.includes(role);
      return {
        ...prev,
        roles: exists ? prev.roles.filter((r) => r !== role) : [...prev.roles, role],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://43.250.40.133:5005/api/v1/users",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          timeout: 15000,
        }
      );

      if (response?.status === 200 || response?.status === 201) {
        toast.success("✅ User added successfully.");
        onSuccess();
        setFormData(initialFormState);
        setShowModal(false);
      } else {
        const message = response?.data?.message || "Unexpected server response.";
        toast.error(`⚠️ ${message}`);
        setError(message);
      }
    } catch (err) {
      console.error("❌ Error adding user:", err);
      const serverMessage = err?.response?.data?.message || err?.message || "Failed to add user.";
      toast.error(`❌ ${serverMessage}`);
      setError(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!showModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end items-center bg-black bg-opacity-40"
      onClick={() => setShowModal(false)}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      <div
        className="relative bg-white w-full sm:max-w-md h-screen shadow-xl transform transition-transform duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          &times;
        </button>

        <form onSubmit={handleSubmit} className="h-full overflow-y-auto p-6 pt-14">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Add New User
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map(({ name, type, label, options, span }) => (
              <div key={name} className={span === 2 ? "sm:col-span-2" : ""}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                {type === "select" ? (
                  <select
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  >
                    {options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </option>
                    ))}
                  </select>
                ) : type === "multi-select" ? (
                  <div className="relative roles-dropdown">
                    <div
                      className="border border-gray-300 rounded-md px-3 py-2 bg-white cursor-pointer"
                      onClick={() => setShowRolesDropdown((prev) => !prev)}
                    >
                      {formData.roles.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {formData.roles.map((role) => (
                            <span
                              key={role}
                              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">Select roles</span>
                      )}
                    </div>
                    {showRolesDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md">
                        {options.map((opt) => (
                          <div
                            key={opt}
                            className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-100 ${formData.roles.includes(opt) ? "bg-blue-50" : ""}`}
                            onClick={() => toggleRole(opt)}
                          >
                            {opt}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <input
                    type={type}
                    name={name}
                    required
                    value={formData[name]}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-md font-semibold text-white transition ${
                loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow"
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

export default AddUserForm;
