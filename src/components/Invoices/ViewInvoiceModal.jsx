// import React from "react";
// import CloseIcon from "@mui/icons-material/Close";
// import { ToastContainer } from "react-toastify";

// const ViewInvoiceModal = ({ show, onClose, invoice }) => {
//   if (!show || !invoice) return null;

//   const formatDate = (dateStr) =>
//     dateStr ? new Date(dateStr).toLocaleDateString() : "N/A";

//   return (
//     <>
//       <ToastContainer position="top-right" autoClose={3000} />
//       <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-40">
//         <div className="relative w-full max-w-md h-full bg-white shadow-2xl overflow-auto z-50 p-6">
//           <button
//             onClick={onClose}
//             className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl"
//             aria-label="Close modal"
//           >
//             <CloseIcon />
//           </button>

//           <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
//             Invoice Details
//           </h2>

//           <div className="grid grid-cols-2 gap-4 text-sm text-gray-800">

//   <Stat label="Invoice Number" value={invoice.invoiceNumber} />
//   <Stat label="Invoice Date" value={formatDate(invoice.invoiceDate)} />
//   <Stat label="Due Date" value={formatDate(invoice.dueDate)} />
//   <Stat label="Payment Type" value={invoice.paymentType} />
//   <Stat label="Payment Status" value={invoice.paymentStatus} />
//   <Stat label="Paid Amount" value={`₹${invoice.paidAmount}`} />
//   <Stat label="Total Amount" value={`₹${invoice.totalAmount}`} />
//   <Stat label="Tax Amount" value={`₹${invoice.taxAmount}`} />
//   <Stat label="Discount Amount" value={`₹${invoice.discountAmount}`} />
//   <Stat label="DC Number" value={invoice.dcNumber} />
//   {/* <Stat label="Invoice Status" value={invoice.invoiceStatus} /> */}

//   {invoice.paymentStatus === "Paid" && (
//     <>
//             <Stat label="Invoice Submitted Date" value={formatDate(invoice.invoiceSubmittedDate)} />
//       <Stat label="BD Charges" value={`N/A`} />
//       <Stat label="BD Paid Date" value={formatDate(invoice.bdPaidDate)} />
//       <Stat label="BD Paid By" value={invoice.bdPaidBy} />
//     </>
//   )}

//   <Stat label="Case Number" value={invoice.case?.caseNumber} />
//   <Stat label="Patient Name" value={invoice.case?.patientName} />
//   <Stat label="Doctor" value={invoice.case?.doctor?.name} />

// </div>

//         </div>
//       </div>
//     </>
//   );
// };

// const Stat = ({ label, value }) => (
//   <div>
//     <label className="block text-xs text-gray-500 mb-1">{label}</label>
//     <div className="border border-gray-300 rounded px-3 py-2 bg-gray-50">{value || "N/A"}</div>
//   </div>
// );

// export default ViewInvoiceModal;


import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { ToastContainer } from "react-toastify";

const ViewInvoiceModal = ({ show, onClose, invoice }) => {
  if (!show || !invoice) return null;

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString() : "N/A";

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-40">
        <div className="relative w-full max-w-md h-full bg-white shadow-2xl overflow-auto z-50 p-6">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl"
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>

          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            Invoice Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
            <Stat label="Invoice Number" value={invoice.invoiceNumber} />
            <Stat label="Invoice Date" value={formatDate(invoice.invoiceDate)} />
            <Stat label="Due Date" value={formatDate(invoice.dueDate)} />
            <Stat label="Payment Type" value={invoice.paymentType} />
            <Stat label="Payment Status" value={invoice.paymentStatus} />
            <Stat label="Paid Amount" value={`₹${invoice.paidAmount}`} />
            <Stat label="Total Amount" value={`₹${invoice.totalAmount}`} />
            <Stat label="Tax Amount" value={`₹${invoice.taxAmount}`} />
            <Stat label="Discount Amount" value={`₹${invoice.discountAmount}`} />
            <Stat label="DC Number" value={invoice.dcNumber} />

            {invoice.paymentStatus === "Paid" && (
              <>
                <Stat label="Invoice Submitted Date" value={formatDate(invoice.invoiceSubmittedDate)} />
                <Stat label="BD Charges" value={`₹${invoice.bdCharges || "N/A"}`} />
                <Stat label="BD Paid Date" value={formatDate(invoice.bdPaidDate)} />
                <Stat label="BD Paid By" value={invoice.bdPaidBy} />
              </>
            )}

            <Stat label="Case Number" value={invoice.case?.caseNumber} />
            <Stat label="Patient Name" value={invoice.case?.patientName} />
            <Stat label="Doctor" value={invoice.case?.doctor?.name} />
          </div>
        </div>
      </div>
    </>
  );
};

const Stat = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-xs text-gray-500">{label}</span>
    <span className="text-sm font-medium text-gray-800">{value || "N/A"}</span>
  </div>
);

export default ViewInvoiceModal;
