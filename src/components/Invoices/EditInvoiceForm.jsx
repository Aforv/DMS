// import axios from "axios";
// import React, { useState, useEffect } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useAuth } from "../Authentication/AuthContext";


// const EditInvoiceForm = ({ show, onClose, invoice, onUpdate,fetchInvoices }) => {
//   const [formData, setFormData] = useState({});
//     const [loading, setLoading] = useState(false);
  
//   const { token } = useAuth();


//   const fields = [
//         {
//       name: "paymentType",
//       type: "select",
//       options: ["Invoice", "Cash", "Card", "UPI", "Online"],
//     },
//     { name: "totalAmount", type: "number" },
//     { name: "taxAmount", type: "number" },
//     { name: "discountAmount", type: "number" },
//     // {
//     //   name: "paymentType",
//     //   type: "select",
//     //   options: ["Invoice", "Cash", "Card", "UPI", "Online"],
//     // },
//     {
//     name: "paymentStatus", 
//     type: "select",
//     options: ["Pending", "Paid", "Partial"],
//   },
//     { name: "paidAmount", type: "number" },
//     { name: "paidDate", type: "date" },
//   ];

//   // useEffect(() => {
//   //   if (invoice) {
//   //     setFormData(invoice);
//   //   }
//   // }, [invoice]);
//   useEffect(() => {
//   if (invoice) {
//     setFormData({
//       ...invoice,
//       paymentStatus: invoice.paymentStatus || "Pending", // ensure fallback
//     });
//   }
// }, [invoice]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: name.includes("Amount") ? parseFloat(value) : value,
//     }));
//   };


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
  
//     try {
//       const response = await axios.put(
//         `http://43.250.40.133:5005/api/v1/case-invoices/${invoice._id}`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
  
//   if (response.status === 201 || response.status === 200) {
//           toast.success("Invoice updated successfully.");
//           console.log(response.data.data)
//           setTimeout(() => {
//             onClose();
//           }, 1000); 
//           fetchInvoices()
//         } else {
//           toast.error("Unexpected response from server.");
//         }
//       } catch (error) {
//         toast.error(
//           error?.response?.data?.message || "Invoice update failed."
//         );
//         console.error("Invoice updated failed", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//   if (!show || !invoice) return null;

//   return (
//     <>
//       <ToastContainer position="top-right" autoClose={3000} />
//       <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-40" >
//         <div className="relative w-full max-w-md h-full bg-white shadow-2xl overflow-auto" >
//           <div className="p-6 relative">
//             <button
//               className="absolute top-5 right-5 text-gray-500 hover:text-black text-2xl"
//               onClick={onClose}
//               aria-label="Close"
//             >
//               &times;
//             </button>

//             <h3 className="text-xl font-semibold mb-6 text-gray-800">
//               Edit Invoice
//             </h3>

//             <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
//               {fields.map((field) => (
//                 <div key={field.name}>
//                   <label className="block text-sm font-medium mb-1 capitalize text-black">
//                     {field.name.replace(/([A-Z])/g, " $1")}
//                   </label>

//                   {field.type === "select" ? (
//                     <select
//                       name={field.name}
//                       value={formData[field.name] || ""}
//                       onChange={handleChange}
//                       className="w-full border border-gray-300 rounded px-3 py-2 text-black"
//                     >
//                       {field.options.map((option) => (
//                         <option key={option} value={option}>
//                           {option}
//                         </option>
//                       ))}
//                     </select>
//                   ) : (
//                     <input
//                       type={field.type}
//                       name={field.name}
//                       value={formData[field.name] || ""}
//                       onChange={handleChange}
//                       className="w-full border border-gray-300 rounded px-3 py-2 text-black"
//                     />
//                   )}
//                 </div>
//               ))}
//               {formData.paymentStatus === "Paid" && (
//   <>
//     <div>
//       <label className="block text-sm font-medium mb-1 text-black">
//         Invoice Submitted Date
//       </label>
//       <input
//         type="date"
//         name="invoiceSubmittedDate"
//         value={formData.invoiceSubmittedDate || ""}
//         onChange={handleChange}
//         className="w-full border border-gray-300 rounded px-3 py-2 text-black"
//       />
//     </div>

//     <div>
//       <label className="block text-sm font-medium mb-1 text-black">
//         BD Charges
//       </label>
//       <input
//         type="number"
//         name="bdCharges"
//         value={formData.bdCharges || ""}
//         onChange={handleChange}
//         className="w-full border border-gray-300 rounded px-3 py-2 text-black"
//       />
//     </div>

//     <div>
//       <label className="block text-sm font-medium mb-1 text-black">
//         BD Paid Date
//       </label>
//       <input
//         type="date"
//         name="bdPaidDate"
//         value={formData.bdPaidDate || ""}
//         onChange={handleChange}
//         className="w-full border border-gray-300 rounded px-3 py-2 text-black"
//       />
//     </div>

//     <div>
//       <label className="block text-sm font-medium mb-1 text-black">
//         BD Paid By
//       </label>
//       <input
//         type="text"
//         name="bdPaidBy"
//         value={formData.bdPaidBy || ""}
//         onChange={handleChange}
//         className="w-full border border-gray-300 rounded px-3 py-2 text-black"
//       />
//     </div>
//   </>
// )}

//                <div className="col-span-2 flex justify-end gap-2 mt-6">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
//                 disabled={loading}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//                 disabled={loading}
//               >
//                 {loading ? "Updating..." : "Update"}
//               </button>
//             </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default EditInvoiceForm;

import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../Authentication/AuthContext";

const EditInvoiceForm = ({ show, onClose, invoice, fetchInvoices }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [cases, setCases] = useState([]);

  const { token } = useAuth();

  // Define static fields
  const fields = [
    {
      name: "paymentType",
      type: "select",
      options: ["Invoice", "Cash", "Card", "UPI", "Online"],
    },
    { name: "totalAmount", type: "number" },
    { name: "taxAmount", type: "number" },
    { name: "discountAmount", type: "number" },
    {
      name: "paymentStatus",
      type: "select",
      options: ["Pending", "Paid", "Partial"],
    },
    { name: "paidAmount", type: "number" },
    { name: "paidDate", type: "date" },
  ];

  // Load invoice data into form
  useEffect(() => {
    if (invoice) {
      // setFormData({
      //   ...invoice,
      //   paymentStatus: invoice.paymentStatus || "Pending",
      // });
      setFormData({
  ...invoice,
  paymentStatus: invoice.paymentStatus || "Pending",
  // case: invoice.case?._id || "",  // set case to the ID
    case: invoice.case?._id || "",  // 👈 ensure this is a string

});

    }
  }, [invoice]);

  // Fetch cases and invoices, filter cases
  useEffect(() => {
    const fetchCasesAndInvoices = async () => {
      try {
        const [casesRes, invRes] = await Promise.all([
          axios.get("http://43.250.40.133:5005/api/v1/cases", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://43.250.40.133:5005/api/v1/case-invoices", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const allCases = casesRes.data?.data || [];
        const allInvoices = invRes.data?.data || [];
        const invoicedIds = new Set(allInvoices.map((inv) => inv.case?._id));

        const filtered = allCases.filter(
          (c) => !invoicedIds.has(c._id) || c._id === invoice?.case?._id
        );
        setCases(filtered);
      } catch (e) {
        toast.error("Failed to load cases or invoices.");
        console.error(e);
      }
    };
    if (show) fetchCasesAndInvoices();
  }, [show, invoice, token]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name.includes("Amount") || name === "bdCharges"
          ? parseFloat(value)
          : value,
    }));
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(
        `http://43.250.40.133:5005/api/v1/case-invoices/${invoice._id}`,
        {
          ...formData,
          case: formData.case, // update case object reference if needed
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Invoice updated successfully");
      fetchInvoices();
      setTimeout(onClose, 1000);
    } catch (e) {
      console.error(e);
      toast.error(e?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!show || !invoice) return null;

  const selectedCase = cases.find(c => c._id === formData.case);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-40">
        <div className="relative w-full max-w-md h-full bg-white shadow-2xl overflow-auto">
          <div className="p-6 relative">
            <button
              className="absolute top-5 right-5 text-gray-500 hover:text-black text-2xl"
              onClick={onClose}
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-6 text-gray-800">
              Edit Invoice
            </h3>
            <form
              className="grid grid-cols-2 gap-4"
              onSubmit={handleSubmit}
            >
              {/* Case dropdown */}
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1 text-black">
                  Case
                </label>
                {/* <select
                  name="case"
                  value={formData.case?._id || ""}
                  onChange={(e) => {
                    const sel = cases.find((c) => c._id === e.target.value);
                    setFormData((p) => ({ ...p, case: sel }));
                  }}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                >
                  <option value="">-- select case --</option>
                  {cases.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.caseNumber} - {c.patientName}
                    </option>
                  ))}
                </select> */}
                <select
  name="case"
  value={formData.case || ""}
  onChange={handleChange}
  required
  className="w-full border border-gray-300 rounded px-3 py-2 text-black"
>
   <option value="" disabled>
    -- Select Case --
  </option>
  {cases.map((c) => (
    <option key={c._id} value={c._id}>
      {c.caseNumber} - {c.patientName}
    </option>
  ))}
</select>
              </div>

              {/* Static fields */}
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
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
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

              {/* Paid-specific fields */}
              {formData.paymentStatus === "Paid" && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-black">
                      Invoice Submitted Date
                    </label>
                    <input
                      type="date"
                      name="invoiceSubmittedDate"
                      value={formData.invoiceSubmittedDate || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-black">
                      BD Charges
                    </label>
                    <input
                      type="number"
                      name="bdCharges"
                      value={formData.bdCharges || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-black">
                      BD Paid Date
                    </label>
                    <input
                      type="date"
                      name="bdPaidDate"
                      value={formData.bdPaidDate || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-black">
                      BD Paid By
                    </label>
                    <input
                      type="text"
                      name="bdPaidBy"
                      value={formData.bdPaidBy || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                    />
                  </div>
                </>
              )}

              {/* Action buttons */}
              <div className="col-span-2 flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
