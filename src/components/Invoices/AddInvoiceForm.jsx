

import { useState, useEffect } from "react";
import axios from "axios";

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

const AddInvoiceForm = ({ showModal, setShowModal }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [cases, setCases] = useState([]);

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzE4M2UzMDRkYWI3NzA4NDE3ZDM1NyIsImlhdCI6MTc0ODg2OTU3MywiZXhwIjoxNzUxNDYxNTczfQ.GQ8JI7OeUW6dZA63JQLlErGWyTsNLuv1F2WiGRhQTXY"; 

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await axios.get("http://43.250.40.133:5005/api/v1/cases", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCases(response.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch cases:", error);
      }
    };

    fetchCases();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => setFormData(initialFormState);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    const payload = {
      invoiceNumber: formData.invoiceNumber,
      invoiceDate: formData.invoiceDate,
      dueDate: formData.dueDate,
      totalAmount: Number(formData.totalAmount),
      // paidAmount: Number(formData.paidAmount),
      taxAmount: Number(formData.taxAmount),
      discountAmount: Number(formData.discountAmount),
      paymentStatus: formData.paymentStatus,
      paymentType: formData.paymentType,
      case: formData.caseId, 
    };

    try {
      const response = await axios.post("http://your-api-url/api/v1/case-invoices", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201 || response.status === 200) {
        setMessage({ text: "Invoice added successfully.", type: "success" });
        resetForm();
      } else {
        setMessage({ text: "Unexpected response from server.", type: "error" });
      }
    } catch (error) {
      setMessage({
        text: error?.response?.data?.message || "Failed to add invoice.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full sm:max-w-2xl p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              &times;
            </button>

            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
                Add New Invoice
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Invoice Number", name: "invoiceNumber" },
                  { label: "Invoice Date", name: "invoiceDate", type: "date" },
                  { label: "Due Date", name: "dueDate", type: "date" },
                  { label: "Total Amount", name: "totalAmount", type: "number" },
                  // { label: "Paid Amount", name: "paidAmount", type: "number" },
                  { label: "Tax Amount", name: "taxAmount", type: "number" },
                  { label: "Discount Amount", name: "discountAmount", type: "number" },
                  { label: "Payment Status", name: "paymentStatus" },
                  {
                    label: "Payment Type",
                    name: "paymentType",
                    type: "readonly",
                  },                  {
                    label: "Select Case",
                    name: "caseId",
                    type: "select",
                    options: cases.map(c => ({
                      value: c._id,
                      label: `${c.caseNumber} - ${c.patientName}`,
                    })),
                  },
                ].map(({ label, name, type = "text", options }) => (
                  <div key={name}>
                    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                      {label}
                    </label>
                
                    {type === "select" ? (
                      <select
                        id={name}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Case</option>
                        {options.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : type === "readonly" ? (
                      <input
                        id={name}
                        name={name}
                        type="text"
                        value={formData[name]}
                        readOnly
                        className="mt-1 w-full border border-gray-200 bg-gray-100 rounded-md p-2 text-gray-600"
                      />
                    ) : (
                      <input
                        id={name}
                        name={name}
                        type={type}
                        value={formData[name]}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-4 text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2 rounded-md font-semibold text-white transition ${
                    loading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 shadow"
                  }`}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>

              {message.text && (
                <div
                  className={`text-sm text-center mt-2 ${
                    message.type === "success" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {message.text}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddInvoiceForm;
