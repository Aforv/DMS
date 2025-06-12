import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { HiOutlineX } from "react-icons/hi"; // Cancel icon

const EditPortfolioForm = ({
  show,
  setShow,
  selectedPortfolio,
  portfolioData,
  setPortfolioData,
}) => {
  const [form, setForm] = useState({ _id: "", name: "", description: "" });

  useEffect(() => {
    if (selectedPortfolio) {
      setForm({
        _id: selectedPortfolio._id,
        name: selectedPortfolio.name || "",
        description: selectedPortfolio.description || "",
      });
    }
  }, [selectedPortfolio]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value.trimStart() }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = portfolioData.map((item) =>
      item._id === form._id ? form : item
    );
    setPortfolioData(updatedData);
    localStorage.setItem("portfolioData", JSON.stringify(updatedData));
    toast.success("Portfolio updated successfully!");
    setTimeout(() => {
      setShow(false);
    }, 500);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black bg-opacity-40">
      <div className="fixed inset-0 bg-black opacity-30" onClick={() => setShow(false)}></div>

      <div
        className={`relative bg-white w-full sm:max-w-md h-full shadow-xl transform transition-transform duration-2000 ease-in-out ${
          show ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top-right cancel icon */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setShow(false)}
            className="text-gray-600 hover:text-red-600 transition"
            aria-label="Close"
          >
            <HiOutlineX className="text-2xl" />
          </button>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Edit Portfolio
          </h3>

          <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
            <div className="col-span-2 flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1 capitalize">
                Portfolio Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                type="text"
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2 flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1 capitalize">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2 flex justify-center items-center gap-4 pt-6">
  <button
    type="submit"
    className="px-6 py-2 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow"
  >
    Update
  </button>
  <button
    type="button"
    onClick={() => setShow(false)}
    className="px-6 py-2 rounded-md font-semibold text-white bg-red-600 hover:bg-red-700 shadow"
  >
    Cancel
  </button>
</div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPortfolioForm;



