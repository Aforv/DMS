import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import AddHospitalForm from "./AddHospitalForm";
import axios from "axios";

const columns = [
  { name: "Name", selector: row => row.name, sortable: true },
  { name: "Email", selector: row => row.email },
  { name: "Phone", selector: row => row.phone },
  {
    name: "Address",
    selector: row =>
      `${row.address}, ${row.location}, ${row.city}, ${row.state} - ${row.pincode}`,
    wrap: true,
  },
  {
    name: "Status",
    selector: row => (row.isActive ? "Active" : "Inactive"),
    cell: row => (
      <span className={row.isActive ? "text-green-600" : "text-red-600"}>
        {row.isActive ? "Active" : "Inactive"}
      </span>
    ),
  },
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

const HospitalTable = () => {
  
  const [showModal, setShowModal] = useState(false);
  
  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Hospitals List</h2>
        <button
          onClick={() => setShowModal(true)}
          className="mt-2 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md shadow transition duration-200"
        >
          Add Hospital
        </button>
      </div>
      <AddHospitalForm showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
};

export default HospitalTable;
