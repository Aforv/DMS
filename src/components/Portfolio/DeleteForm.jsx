import React from "react";
import { toast } from "react-toastify";

const DeletePortfolioModal = ({ show, setShow, portfolioToDelete, portfolioData, setPortfolioData }) => {
  if (!show || !portfolioToDelete) return null;

  const handleDelete = () => {
    const updatedList = portfolioData.filter((item) => item._id !== portfolioToDelete._id);
    setPortfolioData(updatedList);
    localStorage.setItem("portfolioData", JSON.stringify(updatedList));
    toast.success("Portfolio deleted successfully!");
    setShow(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <h2 className="text-lg font-semibold text-red-600 mb-4">Confirm Delete</h2>
        <p className="mb-4">
          Are you sure you want to delete <b>{portfolioToDelete.name}</b>?
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setShow(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeletePortfolioModal;




