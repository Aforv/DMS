import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { HiDotsVertical, HiSearch, HiPencil, HiTrash } from "react-icons/hi";
import { Dropdown, TextInput } from "flowbite-react";
import { useAuth } from "../Authentication/AuthContext";
import AddDoctorForm from "./AddDoctorForm";
import EditDoctorForm from "./EditDoctorForm";
import DeleteDoctorConfirmation from "./DeleteDoctor";


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

const DoctorTable = () => {
  const [doctorData, setDoctorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterText, setFilterText] = useState("");
  const [showAddDoctor, setShowAddDoctor] = useState(false);
const [showEditForm, setShowEditForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
const [doctorToDelete, setDoctorToDelete] = useState(null);


  const { token } = useAuth();

  const fetchDoctors = async () => {
    try {
      setError("");
      setLoading(true);
      const response = await axios.get("http://43.250.40.133:5005/api/v1/doctors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctorData(response.data.data);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setError("Failed to fetch doctors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filteredData = doctorData.filter((doctor) => {
    const text = filterText.toLowerCase();
    return (
      doctor.name?.toLowerCase().includes(text) ||
      doctor.email?.toLowerCase().includes(text) ||
      doctor.phone?.toLowerCase().includes(text) ||
      doctor.specialization?.name?.toLowerCase().includes(text) ||
      doctor.hospital?.name?.toLowerCase().includes(text) ||
      doctor.location?.toLowerCase().includes(text)
    );
  });

  const handleEdit = (doctor) => {
    setSelectedDoctor(doctor);
    setShowEditForm(true);
  };
  const handleDeleteClick = (doctor) => {
  setDoctorToDelete(doctor);
  setShowDeleteConfirm(true);
};

const handleConfirmDelete = async (doctorId) => {
  try {
    await axios.delete(`http://43.250.40.133:5005/api/v1/doctors/${doctorId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchDoctors();
  } catch (error) {
    console.error("Delete failed:", error);
    throw error; // re-throw to catch in DeleteDoctorConfirmation
  }
};


  const handleExport = () => {
    const dataToExport = filteredData.map((doctor, index) => ({
      "SL.NO": index + 1,
      Name: doctor.name || "",
      Email: doctor.email || "",
      Phone: doctor.phone || "",
      Specialization: doctor.specialization?.name || "",
      Hospital: doctor.hospital?.name || "",
      Location: doctor.location || "",
    }));

    if (dataToExport.length === 0) {
      alert("No data available to export.");
      return;
    }

    const headers = Object.keys(dataToExport[0]);
    const csvRows = [headers.join(",")];

    for (const row of dataToExport) {
      const values = headers.map((header) => `"${row[header]}"`);
      csvRows.push(values.join(","));
    }

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "doctor_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    { name: "SL.NO", selector: (_, index) => index + 1, width: "80px" },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Email", selector: (row) => row.email },
    { name: "Phone", selector: (row) => row.phone },
    {
  name: "Specialization",
  selector: (row) => row.specialization || "N/A",
  sortable: true,
},
    { name: "Hospital", selector: (row) => row.hospital?.name || "N/A" },
    { name: "Location", selector: (row) => row.location || "N/A" },
    { name: "Targets", selector: (row) => row.targets || "N/A" },
    {
      name: "Actions",
      cell: (row) => (
        <Dropdown
          inline
          label={<HiDotsVertical className="w-5 h-5 text-gray-600 cursor-pointer" />}
          placement="left-start"
          arrowIcon={false}
        >
          <Dropdown.Item onClick={() => handleEdit(row)}>
            <HiPencil className="w-4 h-4 mr-2" /> Edit
          </Dropdown.Item>
         <Dropdown.Item
  onClick={() => handleDeleteClick(row)}
  className="text-red-600"
>
  <HiTrash className="w-4 h-4 mr-2" /> Delete
</Dropdown.Item>

        </Dropdown>
        
      ),
      button: true,
      width: "100px",
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <TextInput
          icon={HiSearch}
          placeholder="Search doctors..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="w-72"
        />

        <div className="text-3xl font-semibold text-blue-800 mb-4 text-center">
          Doctor List
        </div>

        <div className="flex items-center gap-3">
          <Dropdown label="Actions">
            <Dropdown.Item onClick={handleExport}>Export</Dropdown.Item>
            <Dropdown.Item>Import</Dropdown.Item>
          </Dropdown>

          <button
            onClick={() => setShowAddDoctor(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md shadow transition duration-200"
          >
            Add Doctor
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
        data={filteredData}
        pagination
        highlightOnHover
        striped
        customStyles={customStyles}
        progressPending={loading}
        progressComponent={<div className="text-gray-600">Loading doctors...</div>}
        noDataComponent={
          error ? "Unable to display data due to an error." : "No doctor records found."
        }
      />

      <AddDoctorForm
        show={showAddDoctor}
        setShow={setShowAddDoctor}
        fetchDoctors={fetchDoctors}
      />

     <EditDoctorForm
        show={showEditForm}
        setShow={setShowEditForm}
        fetchDoctors={fetchDoctors}
        selectedDoctor={selectedDoctor}
      />
      <DeleteDoctorConfirmation
  isOpen={showDeleteConfirm}
  onClose={() => setShowDeleteConfirm(false)}
  doctor={doctorToDelete}
  onConfirm={handleConfirmDelete}
/>


    </div>
  );
};

export default DoctorTable;
