
import React from "react";
import DataTable from "react-data-table-component";

import { Dropdown } from "flowbite-react";
import { HiDotsVertical, HiPencil} from "react-icons/hi";

export default function InventoryAdjustmentsTable({ adjustments = [], searchQuery = "", onEdit, onApprove,
   onReject}) {
  const filteredAdjustments = adjustments.filter((item) => {
    const combinedText = [
      item.product?.name,
      item.batchNumber,
      item.location?.name,
      item.adjustmentType,
      item.quantity,
      item.reason,
       item.status,
      item.reasonCategory,
    ]
      .join(" ")
      .toLowerCase();

    return combinedText.includes(searchQuery.toLowerCase());
  });
  

  const columns = [
    {
      name: "S.No",
      selector: (_, index) => index + 1,
      width: "70px",
    },
    {
      name: "Product",
      selector: (row) => row.product?.name || "No product",
      sortable: true,
    },
    {
      name: "Batch Number",
      selector: (row) => row.batchNumber || "N/A",
      sortable: true,
    },
    {
      name: "Type",
      selector: (row) => row.adjustmentType || "N/A",
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.reasonCategory || "N/A",
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status || "N/A",
      sortable: true,
    },
    {
      name: "Action",
      cell: (row, index) => (
        <Dropdown
          inline
          label={<HiDotsVertical className="w-5 h-5 text-gray-600 cursor-pointer" />}
          placement="left-start"
          arrowIcon={false}
        >
          <Dropdown.Item
            onClick={() => onEdit(row)}
            className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <HiPencil className="w-15 h-4" />
            <span>Edit</span>
          </Dropdown.Item>
        <Dropdown.Item
        onClick={() => {
          onApprove(row._id)}}
        className="flex items-center gap-2 text-s text-green-600 hover:bg-green-50"
      >
         <span>Approve</span>
      </Dropdown.Item>
      <Dropdown.Item
        onClick={() => onReject(row._id)}
        className="flex items-center gap-2 text-sm text-red-600 hover:bg-red-50"
      ><span>Reject</span>
      </Dropdown.Item>

        </Dropdown>
      ),
     
      width: "100px",
    },
  ];

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#f1f5f9",
        borderBottomWidth: "1px",
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

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <DataTable
        columns={columns}
        data={filteredAdjustments}
        pagination
        highlightOnHover
        striped
        responsive
        customStyles={customStyles}
        paginationPerPage={5}
        paginationRowsPerPageOptions={[5, 10, 15]}
      />
    </div>
  );
}
