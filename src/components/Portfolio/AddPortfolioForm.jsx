
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const AddPortfolioForm = ({ show, setShow, setPortfolioData }) => {
  const [formData, setFormData] = useState({ name: "", description: "" });

  useEffect(() => {
    if (show) {
      setFormData({ name: "", description: "" });
    }

    const storedData = JSON.parse(localStorage.getItem("portfolioData")) || [];
    setPortfolioData(storedData);
  }, [show, setPortfolioData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trimStart() }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description) {
      toast.error("All fields are required.");
      return;
    }

    const newPortfolio = {
      _id: Date.now().toString(),
      ...formData,
    };

    const updatedData = [
      ...(JSON.parse(localStorage.getItem("portfolioData")) || []),
      newPortfolio,
    ];
    localStorage.setItem("portfolioData", JSON.stringify(updatedData));
    setPortfolioData(updatedData);

    toast.success("Portfolio added successfully!");
    setShow(false);
    setFormData({ name: "", description: "" });
  };

  const handleCancel = () => {
    setShow(false);
    setFormData({ name: "", description: "" });
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-40 items-center"
      onClick={handleCancel}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-40" />

      {/* Drawer */}
      <div
        className={`relative bg-white w-full sm:max-w-md h-screen shadow-xl transform transition-transform duration-300 ease-in-out ${
          show ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleCancel}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          &times;
        </button>
      

        {/* Form */}
        <form onSubmit={handleSubmit} className="h-full overflow-y-auto p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Add New Portfolio
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 capitalize"
              >
                Portfolio Name
              </label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                type="text"
                className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
            </div>

            {/* Description Field */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 capitalize"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="pt-6 text-center flex justify-center gap-4">
            <button
              type="submit"
              className="px-6 py-2 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 rounded-md font-semibold text-white bg-red-600 hover:bg-red-700 shadow"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPortfolioForm;
