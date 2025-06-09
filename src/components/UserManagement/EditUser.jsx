import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../Authentication/AuthContext";
import axiosInstance from "../../utils/axiosInstancenew";

const rolesList = ["admin", "user", "manager"];
const statusOptions = ["active", "inactive"];

const fields = [
  { name: "name", type: "text", label: "Full Name", required: true },
  {
    name: "status",
    type: "select",
    label: "Status",
    options: statusOptions,
    required: true,
  },
  { name: "email", type: "email", label: "Email", required: true },
  {
    name: "roles",
    type: "multi-select",
    label: "Roles",
    options: rolesList,
    required: true,
    span: 2,
  },
];

const EditUserForm = ({ show, onClose, user, onUpdate }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    roles: [],
    status: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRolesDropdown, setShowRolesDropdown] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        roles: Array.isArray(user.roles) ? user.roles : [user.roles],
        status: user.status || "",
      });
      setErrors({});
    }
  }, [user]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".roles-dropdown")) {
        setShowRolesDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const validate = () => {
    const newErrors = {};
    fields.forEach(({ name, required }) => {
      const value = formData[name];
      const isEmpty = Array.isArray(value) ? value.length === 0 : !value?.toString().trim();
      if (required && isEmpty) {
        newErrors[name] = "This field is required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const toggleRole = (role) => {
    setFormData((prev) => {
      const exists = prev.roles.includes(role);
      return {
        ...prev,
        roles: exists ? prev.roles.filter((r) => r !== role) : [...prev.roles, role],
      };
    });
    setErrors((prev) => ({ ...prev, roles: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await axiosInstance.put(
        `http://43.250.40.133:5005/api/v1/users/${user._id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("✅ User updated successfully!");
      onUpdate();
      onClose();
    } catch (err) {
      console.error("❌ Error updating user:", err);
      toast.error("❌ Failed to update user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black bg-opacity-40">
      <div className="fixed inset-0" onClick={onClose}></div>
      <div
        className="relative bg-white w-full sm:max-w-md h-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="p-6 h-full overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Edit User</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map(({ name, type, label, options, span }) => (
                <div key={name} className={name === "email" || span === 2 ? "sm:col-span-2" : ""}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                {type === "select" ? (
                  <select
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-md"
                  >
                    <option value="">Select {label}</option>
                    {options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </option>
                    ))}
                  </select>
                ) : type === "multi-select" ? (
                  <div className="relative roles-dropdown">
                    <div
                      className="border rounded-md px-3 py-2 bg-white cursor-pointer"
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
                            className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-100 ${
                              formData.roles.includes(opt) ? "bg-blue-50" : ""
                            }`}
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
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-md"
                  />
                )}
                {errors[name] && (
                  <p className="text-xs text-red-500 mt-1">{errors[name]}</p>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserForm;
