import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../Authentication/AuthContext";

const EditRoleForm = ({ show, onClose, role, fetchRoles }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [],
  });
  const [allPermissions, setAllPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name || "",
        description: role.description || "",
        permissions: role.permissions?.map(p => p._id) || [],
      });
    }
  }, [role]);

  useEffect(() => {
    if (!show) return;

    const fetchPermissions = async () => {
      try {
        const res = await axios.get("http://43.250.40.133:5005/api/v1/permissions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllPermissions(res.data?.data || []);
      } catch (error) {
        toast.error("Failed to load permissions.");
      }
    };

    fetchPermissions();
  }, [show, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePermissionToggle = (id) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(id)
        ? prev.permissions.filter(pid => pid !== id)
        : [...prev.permissions, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.put(
        `http://43.250.40.133:5005/api/v1/roles/${role._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200 || res.status === 201) {
        toast.success("Role updated successfully.");
        setTimeout(() => {
          onClose();
        }, 1000);
        fetchRoles();
      } else {
        toast.error("Unexpected server response.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Role update failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!show || !role) return null;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-40">
        <div className="relative w-full max-w-md h-full bg-white shadow-2xl overflow-auto">
          <div className="p-6 relative">
            <button
              className="absolute top-5 right-5 text-gray-500 hover:text-black text-2xl"
              onClick={onClose}
              aria-label="Close"
            >
              &times;
            </button>

            <h3 className="text-xl font-semibold mb-6 text-gray-800">Edit Role</h3>

            <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium mb-1 text-black">
                  Role Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-black">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-black">
                  Permissions
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded p-2">
                  {allPermissions.map((perm) => (
                    <label key={perm._id} className="flex items-center gap-2 text-sm text-black">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(perm._id)}
                        onChange={() => handlePermissionToggle(perm._id)}
                      />
                      {perm.name}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {loading ? "Updating..." : "update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditRoleForm;
