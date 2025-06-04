import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { Dropdown } from "flowbite-react";
import { HiSearch, HiTrash, HiPencil, HiDotsVertical } from "react-icons/hi";

const DataTableWithMenu = ({ data = [], onEdit, onDelete }) => {
  const [filterText, setFilterText] = useState("");

  // Filter items based on filterText
  const filteredItems = data.filter((item) => {
    // Safely map each field to string or empty string to avoid errors
    const combined = [
      item.product?.name || "",
      item.batchNumber || "",
      item.location || "",
      item.quantity?.toString() || "",
      item.dpValue?.toString() || "",
      item.status || "",
    ]
      .join(" ")
      .toLowerCase();

    return combined.includes(filterText.toLowerCase());
  });

  const handleDelete = (rowId) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      onDelete(rowId);
    }
  };

 const handleEdit = (item) => {
    if (onEdit) {
      onEdit(item); // this should call the Inventory's editItem
    }
  };


  const columns = [
    {
      name: "Product Name",
      selector: (row) => row.product?.name || "N/A",
      sortable: true,
    },
    {
      name: "Batch No",
      selector: (row) => row.batchNumber || "N/A",
      sortable: true,
    },
    {
      name: "Location",
      selector: (row) => row.location || "N/A",
      sortable: true,
    },
    {
      name: "Quantity",
      selector: (row) => row.quantity ?? 0,
      sortable: true,
    },
    {
      name: "DP Value",
      selector: (row) => row.dpValue ?? 0,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status || "N/A",
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <Dropdown
          inline
          label={<HiDotsVertical className="w-5 h-5 text-gray-600 cursor-pointer" />}
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
          <Dropdown.Item
            onClick={() => handleDelete(row._id)}
            className="flex items-center gap-2 text-sm text-red-600 hover:bg-red-50"
          >
            <HiTrash className="w-4 h-4" />
            <span>Delete</span>
          </Dropdown.Item>
        </Dropdown>
      ),
      button: true,
      width: "100px",
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

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* Search Input */}
      {/* <div className="mb-4 max-w-xs">
        <TextInput
          icon={HiSearch}
          type="text"
          placeholder="Search inventory..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          sizing="sm"
        />
      </div> */}

      {/* Data Table */}
      <DataTable
        title={<span className="text-lg font-semibold text-gray-800">Inventory List</span>}
        columns={columns}
        data={filteredItems}
        pagination
        highlightOnHover
        striped
        responsive
        customStyles={customStyles}
        paginationPerPage={5}
        paginationRowsPerPageOptions={[5, 10, 15]}
        noDataComponent="No inventory data available."
      />
    </div>
  );
};

export default DataTableWithMenu;
