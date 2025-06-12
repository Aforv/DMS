// import { useEffect, useState } from "react";
// import DataTable from "react-data-table-component";
// import AddHospitalForm from "./AddHospitalForm";
// import axios from "axios";
// import EditHospitalForm from "./EditHospitalForm";
// import DeleteHospital from "./DeleteHospital";
// import { HiDotsVertical, HiSearch, HiPencil, HiTrash } from "react-icons/hi";
// import { Dropdown, TextInput } from "flowbite-react";
// import { useAuth } from "../Authentication/AuthContext";
// import axiosInstance from "../../utils/axiosInstancenew";
// import AddContactForm from "./AddContactsForm";
// import ViewContactsModal from "./ViewContactsModal";



// const customStyles = {
//   headRow: {
//     style: {
//       backgroundColor: "#b3d9ff",
//       color: "#111827",
//       fontWeight: "bold",
//     },
//   },
//   rows: {
//     style: {
//       backgroundColor: "#fff",
//       borderBottom: "1px solid #e5e7eb",
//     },
//   },
//   pagination: {
//     style: {
//       borderTop: "1px solid #e5e7eb",
//       padding: "16px",
//     },
//   },
// };

// const HospitalTable = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [showContactModal, setShowContactModal] = useState(false);
//   const [showViewContactModal, setShowViewContactModal] = useState(false);
//   const [hospitalData, setHospitalData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [selectedHospital, setSelectedHospital] = useState(null);
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [hospitalToDelete, setHospitalToDelete] = useState(null);
//   const [filterText, setFilterText] = useState("");
//   const [showContactViewModal, setShowContactViewModal] = useState(false);
//   const [selectedHospitalId, setSelectedHospitalId] = useState(null);

  

//   const {token} = useAuth();

//   const fetchHospitals = async () => {
//     try {
//       setError("");
//       const response = await axiosInstance.get("http://43.250.40.133:5005/api/v1/hospitals", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setHospitalData(response.data.data);
//     } catch (err) {
//       console.error("Error fetching hospitals:", err);
//       setError("Failed to fetch hospitals. Please check your network or CORS settings.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchHospitals();
//   }, []);

//   const handleEditClick = (hospital) => {
//     setSelectedHospital(hospital);
//     setEditModalOpen(true);
//   };

//   const handleDeleteClick = (hospital) => {
//     setHospitalToDelete(hospital);
//     setDeleteModalOpen(true);
//   };

//   const confirmDelete = async () => {
//     try {
//       await axiosInstance.delete(
//         `http://43.250.40.133:5005/api/v1/hospitals/${hospitalToDelete._id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setHospitalData((prev) =>
//         prev.filter((hospital) => hospital._id !== hospitalToDelete._id)
//       );
//       setDeleteModalOpen(false);
//       setHospitalToDelete(null);
//     } catch (error) {
//       console.error("Delete failed:", error);
//     }
//   };

//   const filteredData = hospitalData.filter((hospital) => {
//     const text = filterText.toLowerCase();
//     return (
//       hospital.name?.toLowerCase().includes(text) ||
//       hospital.email?.toLowerCase().includes(text) ||
//       hospital.phone?.toLowerCase().includes(text) ||
//       hospital.address?.toLowerCase().includes(text) ||
//       hospital.city?.toLowerCase().includes(text) ||
//       hospital.state?.toLowerCase().includes(text)
//     );
//   });

//   const columns = [
//     { name: "SL.NO", selector: (_, index) => index + 1, width: "80px" },
//     { name: "Name", selector: (row) => row.name, sortable: true },
//     { name: "Email", selector: (row) => row.email },
//     { name: "Phone", selector: (row) => row.phone },
//     {
//       name: "Address",
//       selector: (row) =>
//         `${row.address}, ${row.location}, ${row.city}, ${row.state} - ${row.pincode}`,
//       wrap: true,
//     },
// {
//   name: "Contacts",
//   cell: (row) => (
//     <button
//       onClick={() => {
//         setSelectedHospital(row);
//         setShowViewContactModal(true);
//       }}
//       className="text-blue-600 hover:text-blue-800 font-medium"
//     >
//       View Contacts
//     </button>
//   ),
//   button: true,
//   width: "140px",
// },
//     {
//       name: "Status",
//       cell: (row) => (
//         <span className={row.isActive ? "text-green-600" : "text-red-600"}>
//           {row.isActive ? "Active" : "Inactive"}
//         </span>
//       ),
//     },
    
//     {
//       name: "Actions",
//       cell: (row) => (
//         <Dropdown
//           inline
//           label={<HiDotsVertical className="w-5 h-5 text-gray-600 cursor-pointer" />}
//           placement="left-start"
//           arrowIcon={false}
//         >
//           <Dropdown.Item onClick={() => handleEditClick(row)}>
//             <HiPencil className="w-4 h-4 mr-2" /> Edit
//           </Dropdown.Item>
//           <Dropdown.Item onClick={() => handleDeleteClick(row)} className="text-red-600">
//             <HiTrash className="w-4 h-4 mr-2" /> Delete
//           </Dropdown.Item>
//         </Dropdown>
//       ),
//       button: true,
//       width: "100px",
//     },
//   ];

//   const handleExport = () => {
//   const dataToExport = filteredData.map((hospital, index) => ({
//     "SL.NO": index + 1,
//     Name: hospital.name || "",
//     Email: hospital.email || "",
//     Phone: hospital.phone || "",
//     Address: `${hospital.address || ""}, ${hospital.location || ""}, ${hospital.city || ""}, ${hospital.state || ""} - ${hospital.pincode || ""}`,
//     Status: hospital.isActive ? "Active" : "Inactive",
//   }));

//   if (dataToExport.length === 0) {
//     alert("No data available to export.");
//     return;
//   }

//   const headers = Object.keys(dataToExport[0]);
//   const csvRows = [headers.join(",")];

//   for (const row of dataToExport) {
//     const values = headers.map(header => `"${row[header]}"`);
//     csvRows.push(values.join(","));
//   }

//   const csvContent = csvRows.join("\n");
//   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//   const url = URL.createObjectURL(blob);

//   const link = document.createElement("a");
//   link.href = url;
//   link.setAttribute("download", "hospital_list.csv");
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };


//   return (
//     <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-md">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
//         <div className="flex gap-4">
//           <TextInput
//             icon={HiSearch}
//             placeholder="Search hospitals..."
//             value={filterText}
//             onChange={(e) => setFilterText(e.target.value)}
//             className="w-72"
//           />
//         </div>

//         <div className="text-3xl font-semibold text-blue-800 mb-4 text-center">Hospital List</div>
//         <div className="flex items-center gap-3">

//           <Dropdown label="Actions">
//             <Dropdown.Item onClick={handleExport}>Export</Dropdown.Item>
//             <Dropdown.Item>Import</Dropdown.Item>
//           </Dropdown>
//            <button
//             onClick={() => setShowModal(true)}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md shadow transition duration-200"
//           >
//             Add Hospital
//           </button>

//           <button onClick={() => setShowContactModal(true)}
//                         className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md shadow transition duration-200"
// >
//         Add Contact
//       </button>

//         </div>
//       </div>

//       {error && (
//         <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md border border-red-300">
//           {error}
//         </div>
//       )}

//       <DataTable
//         columns={columns}
//         data={filteredData}
//         pagination
//         highlightOnHover
//         striped
//         customStyles={customStyles}
//         progressPending={loading}
//         progressComponent={<div className="text-gray-600">Loading hospitals...</div>}
//         noDataComponent={
//           error
//             ? "Unable to display data due to an error."
//             : "No hospital records found."
//         }
//       />

//       <AddHospitalForm
//         showModal={showModal}
//         setShowModal={setShowModal}
//         fetchHospitals={fetchHospitals}
//       />

//       <AddContactForm
//         showModal={showContactModal}
//         setShowModal={setShowContactModal}  
//       />



//       <EditHospitalForm
//         show={editModalOpen}
//         onClose={() => setEditModalOpen(false)}
//         hospital={selectedHospital}
//         onUpdate={fetchHospitals}
//       />

//       <DeleteHospital
//         isOpen={deleteModalOpen}
//         onClose={() => setDeleteModalOpen(false)}
//         onConfirm={confirmDelete}
//         hospitalName={hospitalToDelete?.name}
//       />

      
//     </div>
//   );
// };

// export default HospitalTable;


import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import AddHospitalForm from "./AddHospitalForm";
import EditHospitalForm from "./EditHospitalForm";
import DeleteHospital from "./DeleteHospital";
import { HiDotsVertical, HiSearch, HiPencil, HiTrash } from "react-icons/hi";
import { Dropdown, TextInput } from "flowbite-react";
import { useAuth } from "../Authentication/AuthContext";
import axiosInstance from "../../utils/axiosInstancenew";
import AddContactForm from "./AddContactsForm";
import ViewContactsModal from "./ViewContactsModal";

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

const HospitalTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showViewContactModal, setShowViewContactModal] = useState(false);
  const [hospitalData, setHospitalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [hospitalToDelete, setHospitalToDelete] = useState(null);
  const [filterText, setFilterText] = useState("");

  // For view contact modal
  const [selectedHospitalForContactView, setSelectedHospitalForContactView] = useState(null);

  const { token } = useAuth();

  const fetchHospitals = async () => {
    try {
      setError("");
      const response = await axiosInstance.get("http://43.250.40.133:5005/api/v1/hospitals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHospitalData(response.data.data);
    } catch (err) {
      console.error("Error fetching hospitals:", err);
      setError("Failed to fetch hospitals. Please check your network or CORS settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const handleEditClick = (hospital) => {
    setSelectedHospital(hospital);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (hospital) => {
    setHospitalToDelete(hospital);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(
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

  const filteredData = hospitalData.filter((hospital) => {
    const text = filterText.toLowerCase();
    return (
      hospital.name?.toLowerCase().includes(text) ||
      hospital.email?.toLowerCase().includes(text) ||
      hospital.phone?.toLowerCase().includes(text) ||
      hospital.address?.toLowerCase().includes(text) ||
      hospital.city?.toLowerCase().includes(text) ||
      hospital.state?.toLowerCase().includes(text)
    );
  });

  const columns = [
    { name: "SL.NO", selector: (_, index) => index + 1, width: "80px" },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Email", selector: (row) => row.email },
    { name: "Phone", selector: (row) => row.phone },
    {
      name: "Address",
      selector: (row) =>
        `${row.address}, ${row.location || ""}, ${row.city}, ${row.state} - ${row.pincode}`,
      wrap: true,
    },
    {
      name: "Contacts",
      cell: (row) => (
        <button
          onClick={() => {
            setSelectedHospitalForContactView(row); // Set hospital
            setShowViewContactModal(true); // Open modal
          }}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          View Contacts
        </button>
      ),
      button: true,
      width: "140px",
    },
    {
      name: "Status",
      cell: (row) => (
        <span className={row.isActive ? "text-green-600" : "text-red-600"}>
          {row.isActive ? "Active" : "Inactive"}
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
          <Dropdown.Item onClick={() => handleEditClick(row)}>
            <HiPencil className="w-4 h-4 mr-2" /> Edit
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleDeleteClick(row)} className="text-red-600">
            <HiTrash className="w-4 h-4 mr-2" /> Delete
          </Dropdown.Item>
        </Dropdown>
      ),
      button: true,
      width: "100px",
    },
  ];

  const handleExport = () => {
    const dataToExport = filteredData.map((hospital, index) => ({
      "SL.NO": index + 1,
      Name: hospital.name || "",
      Email: hospital.email || "",
      Phone: hospital.phone || "",
      Address: `${hospital.address || ""}, ${hospital.location || ""}, ${hospital.city || ""}, ${hospital.state || ""} - ${hospital.pincode || ""}`,
      Status: hospital.isActive ? "Active" : "Inactive",
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
    link.setAttribute("download", "hospital_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-md">
      {/* Search, Title, Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <div className="flex gap-4">
          <TextInput
            icon={HiSearch}
            placeholder="Search hospitals..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-72"
          />
        </div>

        <div className="text-3xl font-semibold text-blue-800 mb-4 text-center">Hospital List</div>

        <div className="flex items-center gap-3">
          <Dropdown label="Actions">
            <Dropdown.Item onClick={handleExport}>Export</Dropdown.Item>
            <Dropdown.Item>Import</Dropdown.Item>
          </Dropdown>

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md shadow transition duration-200"
          >
            Add Hospital
          </button>

          <button
            onClick={() => setShowContactModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md shadow transition duration-200"
          >
            Add Contact
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md border border-red-300">
          {error}
        </div>
      )}

      {/* Hospital Table */}
      <DataTable
        columns={columns}
        data={filteredData}
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

      {/* Modals */}
      <AddHospitalForm
        showModal={showModal}
        setShowModal={setShowModal}
        fetchHospitals={fetchHospitals}
      />

      <AddContactForm
        showModal={showContactModal}
        setShowModal={setShowContactModal}
      />

      <EditHospitalForm
        show={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        hospital={selectedHospital}
        onUpdate={fetchHospitals}
      />

      <DeleteHospital
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        hospitalName={hospitalToDelete?.name}
      />

      {/* View Contacts Modal */}
      <ViewContactsModal
        showModal={showViewContactModal}
        setShowModal={setShowViewContactModal}
        hospital={selectedHospitalForContactView}
      />
    </div>
  );
};

export default HospitalTable;