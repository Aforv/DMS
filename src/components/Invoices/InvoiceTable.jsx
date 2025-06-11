import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import AddInvoiceForm from "./AddInvoiceForm";
import EditInvoiceForm from './EditInvoiceForm'
import { Dropdown } from "flowbite-react";
import { HiDotsVertical, HiPencil,HiEye } from "react-icons/hi"; 
import { TextInput } from "flowbite-react";
import {
    HiSearch,
} from "react-icons/hi";
import ViewInvoiceModal from "./ViewInvoiceModal";
import { useAuth } from "../Authentication/AuthContext";


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
  pagination: {
    style: {
      borderTop: "1px solid #e5e7eb",
      padding: "16px",
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
  const [filterText, setFilterText] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
const [viewInvoice, setViewInvoice] = useState(null);


  const handleUpdate = (updatedInvoice) => {
    setInvoicesData((prevData) =>
      prevData.map((h) => (h._id === updatedInvoice._id ? updatedInvoice : h))
    );
    setEditModalOpen(false);
  };


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
    // { name: "Case Number", selector: row => row.case?.caseNumber || "N/A" },
    { name: "Patient Name", selector: row => row.case?.patientName || "N/A" },
    { name: "Doctor", selector: row => row.case?.doctor?.name || "N/A" },
    // {
    //   name: "Surgery Date",
    //   selector: row =>
    //     row.case?.surgeryDate
    //       ? new Date(row.case.surgeryDate).toLocaleDateString()
    //       : "N/A",
    // },
    // {
    //   name: "Invoice Date",
    //   selector: row =>
    //     row.invoiceDate ? new Date(row.invoiceDate).toLocaleDateString() : "N/A",
    // },
    {
      name: "Due Date",
      selector: row =>
        row.dueDate ? new Date(row.dueDate).toLocaleDateString() : "N/A",
    },
    // { name: "Total Amount", selector: row => `₹${row.totalAmount}` },
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
          <Dropdown.Item
            onClick={() => handleEditClick(row)}
            className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <HiPencil className="w-4 h-4" />
            <span>Edit</span>
          </Dropdown.Item>
          <Dropdown.Item
  onClick={() => handleViewClick(row)}
  className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100"
>
  <HiEye className="w-4 h-4" />
  <span>View</span>
</Dropdown.Item>
        </Dropdown>
      ),
      button: true,
      width: "100px",
    }
  ];
  

  const handleEditClick = (invoice) => {
    setSelectedInvoice(invoice);
    setEditModalOpen(true);
  };
  
    const { token } = useAuth();
  


    const fetchInvoices = async () => {
      try {
        setError("");
        const response = await axios.get("http://43.250.40.133:5005/api/v1/case-invoices?page=1&limit=100", {
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


  useEffect(() => {
    
    fetchInvoices();
  }, []);

  const handleViewClick = (invoice) => {
  setViewInvoice(invoice);
  setViewModalOpen(true);
};



  const handleExport = () => {
    const dataToExport = filteredItems.map((invoice, index) => ({
      "SL.NO": index + 1,
      "Invoice Number": invoice.invoiceNumber || "N/A",
      "Case Number": invoice.case?.caseNumber || "N/A",
      "Patient Name": invoice.case?.patientName || "N/A",
      "Doctor": invoice.case?.doctor?.name || "N/A",
      "Surgery Date": invoice.case?.surgeryDate
        ? new Date(invoice.case.surgeryDate).toLocaleDateString()
        : "N/A",
      "Invoice Date": invoice.invoiceDate
        ? new Date(invoice.invoiceDate).toLocaleDateString()
        : "N/A",
      "Due Date": invoice.dueDate
        ? new Date(invoice.dueDate).toLocaleDateString()
        : "N/A",
      "Total Amount": `${invoice.totalAmount ?? 0}`,
      "Paid Amount": `${invoice.paidAmount ?? 0}`,
      "Balance": `${invoice.remainingBalance ?? 0}`,
      "Status": invoice.paymentStatus || "N/A",
    }));
  
    if (dataToExport.length === 0) {
      alert("No data available to export.");
      return;
    }
  
    const headers = Object.keys(dataToExport[0]);
    const csvRows = [headers.join(",")];
  
    for (const row of dataToExport) {
      const values = headers.map(header => `"${row[header]}"`);
      csvRows.push(values.join(","));
    }
  
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "invoice_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  return (

    <div className="p-6 bg-white shadow-lg rounded-lg">
      
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">


<div className="flex justify-start">
                    <TextInput
                        icon={HiSearch}
                        placeholder="Search by Patient / Doctor...."
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        className="w-64"
                    />
                </div>

                  <div className="text-3xl font-semibold text-blue-800 mb-4 text-center">Invoice List</div>
  <div className="flex items-center gap-3">
          <Dropdown label="Actions">
            <Dropdown.Item onClick={handleExport}>Export</Dropdown.Item>
            <Dropdown.Item>Import</Dropdown.Item>
          </Dropdown>

  <button
    onClick={() => setShowModal(true)}
    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md shadow transition duration-200"
  >
    Add Invoices
  </button>
  </div>
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
      <AddInvoiceForm showModal={showModal} setShowModal={setShowModal} onClose={() => setShowModal(false)} fetchInvoices={fetchInvoices}
 />

      <EditInvoiceForm
        show={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        invoice={selectedInvoice}
        onUpdate={handleUpdate}
        fetchInvoices={fetchInvoices}
       />


<ViewInvoiceModal
  show={viewModalOpen}
  onClose={() => setViewModalOpen(false)}
  invoice={viewInvoice}
/>


    </div>
  );
};

export default InvoiceTable;
