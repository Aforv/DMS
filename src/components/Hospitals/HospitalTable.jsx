import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import AddHospitalForm from "./AddHospitalForm";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa"; // Icons for Edit and Delete
import EditHospitalForm from "./EditHospitalForm"; // Add this
import DeleteHospital from "./DeleteHospital";



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

const HospitalTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [hospitalData, setHospitalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [hospitalToDelete, setHospitalToDelete] = useState(null);
const handleUpdate = (updatedHospital) => {
  setHospitalData((prevData) =>
    prevData.map((h) => (h._id === updatedHospital._id ? updatedHospital : h))
  );
  setEditModalOpen(false);
};
const columns = [
  { name: "SL.NO", selector: (_, index) => index + 1, width: "80px" },
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
    cell: row => (
      <span className={row.isActive ? "text-green-600" : "text-red-600"}>
        {row.isActive ? "Active" : "Inactive"}
      </span>
    ),
  },
{
  name: "Actions",
  cell: row => (
    <div className="flex gap-2">
      <button
        onClick={() => handleEditClick(row)}
        className="bg-teal-700 hover:bg-teal-800 text-white px-2 py-1 rounded text-xs flex items-center"
        title="Edit"
      >
        <FaEdit className="mr-1" size={12} />
        Edit
      </button>
      <button
       onClick={() => handleDeleteClick(row)}
        className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs flex items-center"
        title="Delete"
      >
        <FaTrash className="mr-1" size={12} />
        Delete
      </button>
    </div>
  ),
  ignoreRowClick: true,
  allowOverflow: true,
  button: true,
  width: "140px"
}

];

const handleEditClick = (hospital) => {
  setSelectedHospital(hospital);
  setEditModalOpen(true);
};

const handleDeleteClick = (hospital) => {
    setHospitalToDelete(hospital);
    setDeleteModalOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://43.250.40.133:5005/api/v1/hospitals/${hospitalToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setHospitalData((prev) =>
        prev.filter((hospital) => hospital._id !== hospitalToDelete._id)
      );
      setDeleteModalOpen(false);
      setHospitalToDelete(null);
      
    } catch (error) {
      console.error("Delete failed:", error);
      
    }
  };


  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzE4M2UzMDRkYWI3NzA4NDE3ZDM1NyIsImlhdCI6MTc0ODg2OTU3MywiZXhwIjoxNzUxNDYxNTczfQ.GQ8JI7OeUW6dZA63JQLlErGWyTsNLuv1F2WiGRhQTXY";

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setError("");
        const response = await axios.get("http://43.250.40.133:5005/api/v1/hospitals", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHospitalData(response.data.data);
      } catch (err) {
        console.error("Error fetching hospitals:", err);
        setError("Failed to fetch hospitals. Please check your network or CORS settings.");
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Hospitals List</h2>
        <button
          onClick={() => setShowModal(true)}
          className="mt-2 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md shadow transition duration-200"
        >
          Add Hospital
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md border border-red-300">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={hospitalData}
        pagination
        highlightOnHover
        striped
        customStyles={customStyles}
        progressPending={loading}
        progressComponent={<div className="text-gray-600">Loading hospitals...</div>}
        noDataComponent={
          error
            ? "Unable to display data due to an error."
            : "No hospital records found."
        }
      />

      <AddHospitalForm showModal={showModal} setShowModal={setShowModal} />
      <EditHospitalForm
        show={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        hospital={selectedHospital}
        onUpdate={handleUpdate}
       />

      <DeleteHospital
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        hospitalName={hospitalToDelete?.name}
      />


    </div>
  );
};

export default HospitalTable;
