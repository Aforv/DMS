import { toast } from "react-toastify";

const DeleteHospitalConfirmation = ({ isOpen, onClose, onConfirm, hospitalName }) => {
  if (!isOpen) return null;

  const handleDelete = () => {
    onConfirm(); // Calls delete logic from parent
    toast.success(`${hospitalName} deleted successfully!`);
    onClose();   // Close the modal after toast
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end items-center pr-6">
      <div
        className={`
          bg-white rounded-md shadow-lg max-w-md w-full p-6 border border-gray-300
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        `}
      >
        <h2 className="text-lg font-semibold text-red-600 mb-4">Confirm Deletion</h2>
        <p className="mb-6 text-gray-800">
          Are you sure you want to delete the hospital{" "}
          <span className="font-bold">{hospitalName}</span>?
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

export default DeleteHospitalConfirmation;
