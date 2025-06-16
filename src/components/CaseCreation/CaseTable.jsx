import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { Button, Dropdown, Modal } from "flowbite-react";
import {
  HiTrash,
  HiPencil,
  HiDotsVertical,
  HiDownload,
  HiCheckCircle,
} from "react-icons/hi";
import DeleteCase from "./DeleteCase";
import Papa from "papaparse";
import { toast } from "react-toastify";

function CaseTable({
  data = [],
  onEdit,
  onDelete,
  onAdd,
  onStatusUpdate,
  onInvoiceDownload,
}) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [caseToComplete, setCaseToComplete] = useState(null);
  //  const [formDataDrawer, setFormDataDrawer] = useState({
  //    _id: null,
  //    nameOfThePatient: "",
  //    ipNo: "",
  //    usedProducts: [],
  //    paymentType: "",
  //  });
  // const openAddDrawer = () => {
  //   setFormDataDrawer({
  //     _id: null,
  //      nameOfThePatient: "",
  //      ipNo: "",
  //      usedProducts: [],
  //      paymentType: "",
  //   });
  //   // setIsEdit(false);
  //   setOpenModalDrawer(true);
  // };

  //  const resetForm = () => {
  //     setFormDataDrawer({
  //     _id: null,
  //      nameOfThePatient: "",
  //      ipNo: "",
  //      usedProducts: [],
  //      paymentType: "",
  //   });
  //   // setIsEdit(false);
  //   setOpenModalDrawer(false)
  //   };

  const filteredItems = data.filter((item) => {
    const combined = [
      item.caseNumber || "",
      item.patientName || "",
      item.surgeryDate || "",
      item.hospitalName || item.hospital?.name || "",
      item.doctorName || item.doctor?.name || "",
      item.principalName || item.principle?.name || "",
      item.category || item.category?.name || "",
      item.subcategory || item.subcategory?.name || "",
      item.dpValue?.toString() || "",
      item.sellingPrice?.toString() || "",
      item.status || "",
    ]
      .join(" ")
      .toLowerCase();

    return combined.includes(searchTerm.toLowerCase());
  });

  const handleEdit = (item) => {
    if (onEdit) {
      onEdit(item);
    }
  };

  // const handleOnchange = (e)=>{
  //   e.preventDefault();

  //   const { name, value } = e.target;
  //   setFormDataDrawer((prev) => {
  //     return {
  //       ...prev,
  //       [name]: value,
  //     };
  //   });
  // }

  const handleDeleteClick = (caseData) => {
    setSelectedCase(caseData);
    setDeleteModalOpen(true);
  };

  const handleStatusUpdate = (id) => {
    if (window.confirm("Mark this case as Completed?")) {
      onStatusUpdate?.(id, "Completed");
    }
  };

  const handleInvoiceDownload = (id) => {
    onInvoiceDownload?.(id);
  };

  const handleStatusModalOpen = (caseData) => {
    setCaseToComplete(caseData);
    setStatusModalOpen(true);
  };

  const confirmMarkCompleted = () => {
    if (caseToComplete && caseToComplete._id) {
      onStatusUpdate?.(caseToComplete._id, "Completed");
    }
    setStatusModalOpen(false);
  };

  const columns = [
    {
      name: "Case No.",
      selector: (row) => row.caseNumber || "N/A",
      sortable: true,
    },
    {
      name: "Patient",
      selector: (row) => row.patientName || "N/A",
      sortable: true,
    },
    {
      name: "Surgery Date",
      selector: (row) =>
        row.surgeryDate
          ? new Date(row.surgeryDate).toLocaleDateString()
          : "N/A",
      sortable: true,
    },
    {
      name: "Hospital",
      selector: (row) =>
        typeof row.hospital === "object"
          ? row.hospital?.name || "N/A"
          : row.hospital || "N/A",
      sortable: true,
    },
    {
      name: "Doctor",
      selector: (row) =>
        typeof row.doctor === "object"
          ? row.doctor?.name || "N/A"
          : row.doctor || "N/A",
      sortable: true,
    },
    {
      name: "Principal",
      selector: (row) =>
        row.principalName && typeof row.principalName === "object"
          ? row.principalName.name || "N/A"
          : row.principalName || "N/A",
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) =>
        row.category && typeof row.category === "object"
          ? row.category.name || "N/A"
          : row.category || "N/A",
      sortable: true,
    },
    {
      name: "Subcategory",
      selector: (row) =>
        row.subcategory && typeof row.subcategory === "object"
          ? row.subcategory.name || "N/A"
          : row.subcategory || "N/A",
      sortable: true,
    },
    {
      name: "DP Value",
      selector: (row) =>
        typeof row.dpValue === "object"
          ? row.dpValue?.value || 0
          : row.dpValue ?? 0,
      sortable: true,
    },
    {
      name: "Selling Price",
      selector: (row) =>
        typeof row.sellingPrice === "object"
          ? row.sellingPrice?.value || 0
          : row.sellingPrice ?? 0,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status || "Pending",
      cell: (row) => (
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            row.status === "Completed"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {row.status || "Pending"}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <Dropdown
          inline
          label={
            <HiDotsVertical className="w-5 h-5 text-gray-600 cursor-pointer" />
          }
          placement="left-start"
          arrowIcon={false}
        >
          <Dropdown.Item
            onClick={() => handleEdit(row)}
            className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <HiPencil className="w-4 h-4" />
            <span>Edit</span>
          </Dropdown.Item>
          {/* <Dropdown.Item
            onClick={() => handleStatusUpdate(row._id)}
            className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100 "
          >
            <HiCheckCircle className="w-4 h-4" />
            Mark Completed
          </Dropdown.Item> */}

          <Dropdown.Item
            onClick={() => handleStatusModalOpen(row)}
            className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100 "
          >
            <HiCheckCircle className="w-4 h-4" />
            Mark Completed
          </Dropdown.Item>

          <Dropdown.Item
            onClick={() => handleInvoiceDownload(row._id)}
            className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100 "
          >
            <HiDownload className="w-4 h-4" />
            Download Invoice
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => handleDeleteClick(row)}
            className="flex items-center gap-2 text-sm text-red-600 hover:bg-red-50"
          >
            <HiTrash className="w-4 h-4" />
            <span>Delete</span>
          </Dropdown.Item>
        </Dropdown>
      ),
      button: true,
      width: "160px",
    },
  ];
  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "lightblue",
        borderBottomWidth: "1px",
        borderBottomColor: "#e5e7eb",
        fontWeight: 600,
      },
    },
    headCells: {
      style: {
        fontSize: "14px",
        color: "#111827",
        paddingLeft: "16px",
        paddingRight: "16px",
      },
    },
    rows: {
      style: {
        fontSize: "14px",
        color: "#374151",
        backgroundColor: "white",
      },
    },
    pagination: {
      style: {
        borderTop: "1px solid #e5e7eb",
        padding: "16px",
      },
    },
  };

  const handleExport = () => {
    if (!data || data.length === 0) {
      toast.warning("No data to export");
      return;
    }

    const exportData = data.map((item) => ({
      caseName: item?.name || "",
      surgeryDate: item.surgeryDate || "",
      hospital: item.hospitalName || item.hospital?.name || "",
      doctor: item.doctorName || item.doctor?.name || "",
      principle: item.principalName || item.principle?.name || "",
      category: item.category || item.category?.name || "",
      subcategory: item.subcategory || item.subcategory?.name || "",
      dpValue: item.dpValue?.toString() || "",
      sellingPrice: item.sellingPrice?.toString() || "",
      notes: item.status || "",
    }));

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "inhouse_cases.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <Modal
        show={statusModalOpen}
        size="md"
        popup
        onClose={() => setStatusModalOpen(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-start">
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Confirm Completion
            </h3>
            <p className="text-sm text-gray-600 mb-8">
              Are you sure you want to mark{" "}
              <strong>
                {caseToComplete?.caseNumber || caseToComplete?.patientName}
              </strong>{" "}
              as <strong>Completed</strong>?
            </p>
             </div>
            <div className="flex justify-end gap-2">
              <Button color="gray" size="md" onClick={() => setStatusModalOpen(false)}>
                Cancel
              </Button>
              <Button color="success" size="md" onClick={confirmMarkCompleted}>
                Mark Completed
              </Button>
            </div>
         
        </Modal.Body>
      </Modal>
      <DataTable
        columns={columns}
        data={filteredItems}
        pagination
        highlightOnHover
        striped
        responsive
        customStyles={customStyles}
        paginationPerPage={5}
        paginationRowsPerPageOptions={[5, 10, 15]}
        noDataComponent="No data available."
      />

      <DeleteCase
        show={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        caseId={selectedCase?._id}
        caseName={
          selectedCase?.caseNumber ||
          selectedCase?.patientName ||
          selectedCase?.caseName ||
          ""
        }
        onSuccess={() => {
          onDelete(selectedCase._id);
          setDeleteModalOpen(false);
        }}
      />
    </div>
  );
}

export default CaseTable;
