import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { Dropdown } from "flowbite-react";
import { HiSearch, HiTrash, HiPencil, HiDotsVertical } from "react-icons/hi";

const DataTableWithMenu = ({ data = [], onEdit, onDelete }) => {
  const [filterText, setFilterText] = useState("");

  const filteredItems = data.filter((item) => {
    const combined = [
      item.name || "",
      item.description || "",
      item.manager?.name || "",
      item.parentDepartment?.name || "",
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
      onEdit(item);
    }
  };

  const columns = [
    {
      name: "Department Name",
      selector: (row) => row.name || "N/A",
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description || "N/A",
      sortable: true,
    },
    {
      name: "Manager",
      selector: (row) => row.manager?.name || "N/A",
      sortable: true,
    },
    {
      name: "Parent Department",
      selector: (row) => row.parentDepartment?.name || "N/A",
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
    
  
      {/* Data Table */}
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
        noDataComponent="No departments available."
      />
    </div>
  );
};

export default DataTableWithMenu;
