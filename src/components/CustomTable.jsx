import React from "react";
import DataTable from "react-data-table-component";

const columns = [
  { name: "ID", selector: (row) => row.id, sortable: true },
  { name: "Name", selector: (row) => row.name, sortable: true },
  { name: "Email", selector: (row) => row.email, sortable: true },
];

const data = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
  { id: 3, name: "Alice Johnson", email: "alice@example.com" },
  { id: 4, name: "John Doe", email: "john@example.com" },
  { id: 5, name: "Jane Smith", email: "jane@example.com" },
  { id: 6, name: "Alice Johnson", email: "alice@example.com" },
  { id: 7, name: "John Doe", email: "john@example.com" },
  { id: 8, name: "Jane Smith", email: "jane@example.com" },
  { id: 9, name: "Alice Johnson", email: "alice@example.com" },
  { id: 10, name: "John Doe", email: "john@example.com" },
  { id: 11, name: "Jane Smith", email: "jane@example.com" },
  { id: 12, name: "Alice Johnson", email: "alice@example.com" },
];

const customStyles = {
  headRow: {
    style: {
      backgroundColor: "#f3f4f6",
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

const CustomTable = () => {
  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <DataTable
        columns={columns}
        data={data}
        pagination
        highlightOnHover
        striped
        customStyles={customStyles}
      />
    </div>
  );
};

export default CustomTable;
