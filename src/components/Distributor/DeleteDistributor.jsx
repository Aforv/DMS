import React from "react";
import { toast } from "react-toastify";

const DeleteDistributorConfirmation = ({ isOpen, onClose, distributor, onConfirm }) => {
  const handleDelete = () => {
    try {
      onConfirm(distributor._id);
      toast.success(`${distributor.name} deleted successfully`);
      onClose();
    } catch (err) {
      toast.error("Failed to delete distributor");
    }
  };

  if (!isOpen || !distributor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-lg font-semibold text-red-600 mb-4">Confirm Deletion</h2>
        <p className="mb-6 text-gray-800">
          Are you sure you want to delete <span className="font-bold">{distributor.name}</span>?
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md">
            Cancel
          </button>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDistributorConfirmation;