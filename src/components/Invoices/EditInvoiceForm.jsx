import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../Authentication/AuthContext";


const EditInvoiceForm = ({ show, onClose, invoice, onUpdate,fetchInvoices }) => {
  const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
  
  const { token } = useAuth();


  const fields = [
    { name: "totalAmount", type: "number" },
    { name: "taxAmount", type: "number" },
    { name: "discountAmount", type: "number" },
    {
      name: "paymentType",
      type: "select",
      options: ["Invoice", "Cash", "Card", "UPI", "Online"],
    },
    { name: "paidAmount", type: "number" },
    { name: "paidDate", type: "date" },
  ];

  useEffect(() => {
    if (invoice) {
      setFormData(invoice);
    }
  }, [invoice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("Amount") ? parseFloat(value) : value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await axios.put(
        `http://43.250.40.133:5005/api/v1/case-invoices/${invoice._id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
  if (response.status === 201 || response.status === 200) {
          toast.success("Invoice updated successfully.");
          setTimeout(() => {
            onClose();
          }, 1000); 
          fetchInvoices()
        } else {
          toast.error("Unexpected response from server.");
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Invoice update failed."
        );
        console.error("Invoice updated failed", error);
      } finally {
        setLoading(false);
      }
    };

  if (!show || !invoice) return null;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-40" >
        <div className="relative w-full max-w-md h-full bg-white shadow-2xl overflow-auto">
          <div className="p-6 relative">
            <button
              className="absolute top-5 right-5 text-gray-500 hover:text-black text-2xl"
              onClick={onClose}
              aria-label="Close"
            >
              &times;
            </button>

            <h3 className="text-xl font-semibold mb-6 text-gray-800">
              Edit Invoice
            </h3>

            <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
              {fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium mb-1 capitalize text-black">
                    {field.name.replace(/([A-Z])/g, " $1")}
                  </label>

                  {field.type === "select" ? (
                    <select
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                    >
                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                    />
                  )}
                </div>
              ))}

               <div className="col-span-2 flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditInvoiceForm;