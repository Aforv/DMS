import React, { useState, useEffect } from "react";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../Authentication/AuthContext";

const AddRoleForm = ({ showModal, setShowModal, fetchRoles, onClose}) => {
  const { token } = useAuth();
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!showModal) return;
    const fetchPermissions = async () => {
      try {
        const response = await axios.get(
          "http://43.250.40.133:5005/api/v1/permissions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPermissions(response.data?.data || []);
      } catch (err) {
        console.error("Error fetching permissions:", err);
        toast.error("Failed to fetch permissions.");
      }
    };
    fetchPermissions();
  }, [showModal, token]);

  const handlePermissionChange = (permissionId) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roleName.trim()) {
      toast.warning("Role name is required");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: roleName.trim(),
        description: description.trim(),
        permissions: selectedPermissions.map((id) => id),
      };

      const response = await axios.post(
        "http://43.250.40.133:5005/api/v1/roles",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Role created successfully!");
        fetchRoles();
        setTimeout(() => setShowModal(false), 1000);
      } else {
        toast.error("Something went wrong.");
      }
    } catch (error) {
      console.error("Role creation failed", error);
      toast.error(error.response?.data?.message || "Failed to create role");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRoleName("");
    setDescription("");
    setSelectedPermissions([]);
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-40" >
        <div className="relative w-full max-w-md max-h-[600px] bg-white shadow-2xl overflow-auto z-50 p-6" >
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl"
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>

          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            Add New Role
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Role Name</label>
              <input
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Select Permissions
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-2 rounded-md">
                {permissions.map((permission) => (
                  <label key={permission._id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={permission._id}
                      checked={selectedPermissions.includes(permission._id)}
                      onChange={() => handlePermissionChange(permission._id)}
                    />
                    <span className="text-sm">{permission.name}</span>
                  </label>
                ))}
              </div>
            </div>
      <div className="flex justify-between items-center gap-4 mt-4">
  <button
    type="button"
    onClick={handleClose}
    className="w-1/2 bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
  >
    Cancel
  </button>
  <button
    type="submit"
    disabled={loading}
    className="w-1/2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
  >
    {loading ? "Saving..." : "Add Role"}
  </button>
</div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddRoleForm;
