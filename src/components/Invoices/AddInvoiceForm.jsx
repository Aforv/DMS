import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../Authentication/AuthContext";

const initialFormState = {
  invoiceNumber: "",
  invoiceDate: "",
  dueDate: "",
  totalAmount: "",
  paidAmount: "",
  taxAmount: "",
  discountAmount: "",
  paymentStatus: "Pending",
  paymentType: "Invoice",
  caseId: "",
};

const AddInvoiceForm = ({
  showModal,
  setShowModal,
  fetchInvoices,
  onClose,
}) => {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [cases, setCases] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await axios.get(
          "http://43.250.40.133:5005/api/v1/cases",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCases(response.data?.data || []);
      } catch (error) {
        toast.error("Failed to fetch cases.");
        console.error("Failed to fetch cases:", error);
      }
    };

    if (showModal) fetchCases();
  }, [showModal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => setFormData(initialFormState);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      invoiceNumber: formData.invoiceNumber,
      invoiceDate: formData.invoiceDate,
      dueDate: formData.dueDate,
      totalAmount: Number(formData.totalAmount),
      taxAmount: Number(formData.taxAmount),
      discountAmount: Number(formData.discountAmount),
      paymentStatus: formData.paymentStatus,
      paymentType: formData.paymentType,
      case: formData.caseId,
    };

    try {
      const response = await axios.post(
        "http://43.250.40.133:5005/api/v1/case-invoices",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Invoice added successfully.");
        resetForm();
        fetchInvoices();
        setTimeout(() => {
          setShowModal(false);
        }, 1000);
      } else {
        toast.error("Unexpected response from server.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invoice creation failed.");
      console.error("Invoice creation failed", error);
    } finally {
      setLoading(false);
      resetForm();
    }
  };

  if (!showModal) return null;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-40">
        <div className="relative w-full max-w-md h-full bg-white shadow-2xl overflow-auto z-50 p-6" >
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl"
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>

          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            Add New Invoice
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Invoice Number
              </label>
              <input
                type="text"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Invoice Date
              </label>
              <input
                type="date"
                name="invoiceDate"
                value={formData.invoiceDate}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                min={formData.invoiceDate} 
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Total Amount
              </label>
              <input
                type="number"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleChange}
                required
                min={0}
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Tax Amount
              </label>
              <input
                type="number"
                name="taxAmount"
                value={formData.taxAmount}
                onChange={handleChange}
                min={0}
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Discount Amount
              </label>
              <input
                type="number"
                name="discountAmount"
                value={formData.discountAmount}
                onChange={handleChange}
                min={0}
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Payment Type
              </label>
              <select
                name="paymentType"
                value={formData.paymentType}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
              >
                <option value="Invoice">Invoice</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
                <option value="Online">Online</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Case</label>
              <select
                name="caseId"
                value={formData.caseId}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
              >
                <option value="">Select a case</option>
                {cases.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.caseNumber || `Case ${c._id}`}
                  </option>
                ))}
              </select>
            </div>

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
                {loading ? "Submitting..." : "Add Invoice"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddInvoiceForm;
