import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
// import AddInvoiceForm from "./AddInvoiceForm";
// import DeleteInvoiceConfirmation from "./DeleteInvoice";
// import EditInvoiceForm from './EditInvoiceForm'
import { Dropdown } from "flowbite-react";
import { HiDotsVertical, HiPencil, HiTrash } from "react-icons/hi"; 

const customStyles = {
  headRow: {
    style: {
      backgroundColor: "#b3d9ff",
      color: "#111827",
      fontWeight: "bold",
    },
  },
  rows: {
    style: {
      backgroundColor: "#fff",
      borderBottom: "1px solid #e5e7eb",
    },
  },
};


const InvoiceTable = () => {
  const [invoicesData, setInvoicesData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [filterText, setFilterText] = useState("");


  // const handleUpdate = (updatedInvoice) => {
  //   setInvoicesData((prevData) =>
  //     prevData.map((h) => (h._id === updatedInvoice._id ? updatedInvoice : h))
  //   );
  //   setEditModalOpen(false);
  // };

  const filteredItems = invoicesData.filter((item) => {
    const caseNumber = item.case?.caseNumber?.toLowerCase() || "";
    const patientName = item.case?.patientName?.toLowerCase() || "";
    const doctorName = item.case?.doctor?.name?.toLowerCase() || "";
    const invoiceDate = item.invoiceDate
      ? new Date(item.invoiceDate).toLocaleDateString().toLowerCase()
      : "";
  
    return (
      caseNumber.includes(filterText.toLowerCase()) ||
      patientName.includes(filterText.toLowerCase()) ||
      doctorName.includes(filterText.toLowerCase()) ||
      invoiceDate.includes(filterText.toLowerCase())
    );
  });

  const columns = [
    { name: "SL.NO", selector: (_, index) => index + 1, width: "80px" },
    // { name: "Invoice Number", selector: row => row.invoiceNumber, sortable: true },
    { name: "Case Number", selector: row => row.case?.caseNumber || "N/A" },
    { name: "Patient Name", selector: row => row.case?.patientName || "N/A" },
    { name: "Doctor", selector: row => row.case?.doctor?.name || "N/A" },
    // {
    //   name: "Surgery Date",
    //   selector: row =>
    //     row.case?.surgeryDate
    //       ? new Date(row.case.surgeryDate).toLocaleDateString()
    //       : "N/A",
    // },
    {
      name: "Invoice Date",
      selector: row =>
        row.invoiceDate ? new Date(row.invoiceDate).toLocaleDateString() : "N/A",
    },
    {
      name: "Due Date",
      selector: row =>
        row.dueDate ? new Date(row.dueDate).toLocaleDateString() : "N/A",
    },
    { name: "Total Amount", selector: row => `₹${row.totalAmount}` },
    { name: "Paid Amount", selector: row => `₹${row.paidAmount}` },
    { name: "Balance", selector: row => `₹${row.remainingBalance}` },
    {
      name: "Status",
      cell: row => (
        <span className={row.paymentStatus === "Paid" ? "text-green-600" : "text-red-600"}>
          {row.paymentStatus}
        </span>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <Dropdown
          inline
          label={<HiDotsVertical className="w-5 h-5 text-gray-600 cursor-pointer" />}
          placement="left-start"
          arrowIcon={false}
        >
          {/* <Dropdown.Item
            onClick={() => handleEditClick(row)}
            className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <HiPencil className="w-4 h-4" />
            <span>Edit</span>
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => handleDeleteClick(row)}
            className="flex items-center gap-2 text-sm text-red-600 hover:bg-red-100"
          >
            <HiTrash className="w-4 h-4" />
            <span>Delete</span>
          </Dropdown.Item> */}
        </Dropdown>
      ),
      button: true,
      width: "100px",
    }
  ];
  

  // const handleEditClick = (invoice) => {
  //   setSelectedInvoice(invoice);
  //   setEditModalOpen(true);
  // };
  
  // const handleDeleteClick = (invoice) => {
  //     setInvoiceToDelete(invoice);
  //     setDeleteModalOpen(true);
  //   };
  
  //   // Confirm delete
  //   const confirmDelete = async () => {
  //     try {
  //       // await axios.delete(
  //       //   `http://43.250.40.133:5005/api/v1/hospitals/${hospitalToDelete._id}`,
  //       //   {
  //       //     headers: {
  //       //       Authorization: `Bearer ${token}`,
  //       //     },
  //       //   }
  //       // );
  //       // setHospitalData((prev) =>
  //       //   prev.filter((hospital) => hospital._id !== hospitalToDelete._id)
  //       // );
  //       setDeleteModalOpen(false);
  //       setInvoiceToDelete(null);
        
  //     } catch (error) {
  //       console.error("Delete failed:", error);
        
  //     }
  //   };
  
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzE4M2UzMDRkYWI3NzA4NDE3ZDM1NyIsImlhdCI6MTc0ODg2OTU3MywiZXhwIjoxNzUxNDYxNTczfQ.GQ8JI7OeUW6dZA63JQLlErGWyTsNLuv1F2WiGRhQTXY";

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setError("");
        const response = await axios.get("http://43.250.40.133:5005/api/v1/case-invoices", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInvoicesData(response.data.data);
      } catch (err) {
        console.error("Error fetching invoices:", err);
        setError("Failed to fetch invoices. Please check your network or CORS settings.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  return (

    <div className="p-6 bg-white shadow-lg rounded-lg">
      
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
  {/* Search Input */}
  <input
    type="text"
    placeholder="Search by Case No / Patient / Doctor..."
    value={filterText}
    onChange={(e) => setFilterText(e.target.value)}
    className="border border-gray-300 rounded px-3 py-2 w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  {/* Title */}
  <h2 className="text-xl font-semibold text-gray-800 flex-shrink-0 ml-[-8px]">Invoice List</h2>

  {/* Add Invoice Button */}
  <button
    onClick={() => setShowModal(true)}
    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md shadow transition duration-200"
  >
    Add Invoices
  </button>
</div>



      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md border border-red-300">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={filteredItems}
        pagination
        highlightOnHover
        striped
        customStyles={customStyles}
        progressPending={loading}
        progressComponent={<div className="text-gray-600">Loading invoices...</div>}
        noDataComponent={
          error
            ? "Unable to display data due to an error."
            : "No invoice records found."
        }
      />
      {/* <AddInvoiceForm showModal={showModal} setShowModal={setShowModal} /> */}

      {/* <EditInvoiceForm
        show={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        invoice={selectedInvoice}
        onUpdate={handleUpdate}
       />

      <DeleteInvoiceConfirmation
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        // hospitalName={hospitalToDelete?.name}
      /> */}

    </div>
    // </div>
  );
};

export default InvoiceTable;
