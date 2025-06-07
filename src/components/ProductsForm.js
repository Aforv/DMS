
import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { Dropdown } from "flowbite-react";
import {  HiTrash, HiPencil, HiDotsVertical } from "react-icons/hi";

export default function ProductTable({ products=[], onEdit, onDelete,searchQuery }) {

const filteredProducts = products.filter((item) => {
  const combinedText = [
    item.name,
    item.productCode,
    item.principle?.name,
    item.dpValue,
    item.mrp,
    item.quantity,
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
      name: "Supplier Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Product Code",
      selector: (row) => row.productCode,
      sortable: true,
    },
    {
      name: "Principle Name",
      selector: (row) => row.principle?.name || "No principle name",
      sortable: true,
    },
    {
      name: "DP Value",
      selector: (row) => row.dpValue,
      sortable: true,
    },
    {
      name: "MRP",
      selector: (row) => row.mrp,
      sortable: true,
    },
    {
      name: "Quantity",
      selector: (row) => row.quantity,
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
            onClick={() => onEdit(index)}
            className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <HiPencil className="w-15 h-4" />
            <span>Edit</span>
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => onDelete(row._id)}
            className="flex items-center gap-2 text-sm text-red-600 hover:bg-red-50"
          >
            <HiTrash className="w-15 h-4" />
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

      <DataTable
      
        columns={columns}
        data={filteredProducts}
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
