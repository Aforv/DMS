// DeleteDoctorConfirmation.jsx
import React from "react";
import { toast } from "react-toastify";

const DeleteDoctorConfirmation = ({ isOpen, onClose, doctor, onConfirm }) => {
  if (!isOpen || !doctor) return null;

  const handleDelete = async () => {
    try {
      await onConfirm(doctor._id);
      toast.success(`${doctor.name} deleted successfully!`);
      onClose();
    } catch (err) {
      toast.error("Failed to delete doctor.");
      console.error("Error in delete confirmation:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-lg font-semibold text-red-600 mb-4">
          Confirm Deletion
        </h2>
        <p className="mb-6 text-gray-800">
          Are you sure you want to delete{" "}
          <span className="font-bold">{doctor.name}</span>?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDoctorConfirmation;
