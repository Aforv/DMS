import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { Dropdown } from "flowbite-react";
import { HiDotsVertical, HiPencil, HiTrash } from "react-icons/hi";
import { useAuth } from "../Authentication/AuthContext";
import { TextInput } from "flowbite-react";
import { HiSearch } from "react-icons/hi";
import AddRolesForm from "./AddRoles";
import EditRoleForm from "./EditRoles";
import DeleteRoleConfirmation from "./DeleteRoles";


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

const RolesTable = () => {
  const [rolesData, setRolesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterText, setFilterText] = useState("");
  const { token } = useAuth();
  const [showRoleModal, setShowRoleModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleToDelete, setRoleToDelete] = useState(null);
const [deleteModalOpen, setDeleteModalOpen] = useState(false);


  const filteredRoles = rolesData.filter((role) => {
    return (
      role.name.toLowerCase().includes(filterText.toLowerCase()) ||
      role.description.toLowerCase().includes(filterText.toLowerCase())
    );
  });

  const columns = [
    {
      name: "SL. NO",
      cell: (row, index) => index + 1,
      width: "80px",
    },
    {
      name: "Role Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
    },
// {
//   name: "Permissions",
//   cell: (row) => (
//     <div className="bg-blue-50 p-3 rounded-lg shadow-sm border border-blue-200 max-h-48 overflow-y-auto">
//       {Array.isArray(row.permissions) && row.permissions.length > 0 ? (
//         <ul className="flex flex-wrap gap-2">
//           {row.permissions.map((perm, index) => (
//             <li
//               key={index}
//               className="text-sm bg-white border border-blue-400 text-blue-700 px-3 py-1 rounded-full shadow-sm hover:bg-blue-100 transition"
//             >
//               {perm.name}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <span className="text-gray-500">None</span>
//       )}
//     </div>
//   ),
//   wrap: true,
//   grow: 2,
// },
{
  name: "Permissions",
  cell: (row) => (
    <div className=" p-3 shadow-sm border max-h-28 overflow-y-auto text-sm text-gray-800 pb-2">
      {Array.isArray(row.permissions) && row.permissions.length > 0 ? (
        row.permissions.map((perm) => perm.name).join(", ")
      ) : (
        <span className="text-gray-500">None</span>
      )}
    </div>
  ),
  wrap: true,
  grow: 2,
},
    {
      name: "Actions",
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
            onClick={() => handleEditClick(row)}
            className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <HiPencil className="w-4 h-4" />
            <span>Edit</span>
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => handleDeleteClick(row)}
            className="flex items-center gap-2 text-sm text-red-600 hover:bg-red-100"
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

const handleEditClick = (role) => {
    setSelectedRole(role);
    setShowEditModal(true);
  };

const handleDeleteClick = (role) => {
  setRoleToDelete(role);
  setDeleteModalOpen(true);
};

const confirmDelete = async () => {
  try {
    await axios.delete(
      `http://43.250.40.133:5005/api/v1/roles/${roleToDelete._id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setRolesData((prev) => prev.filter((role) => role._id !== roleToDelete._id));
    setDeleteModalOpen(false);
    setRoleToDelete(null);
  } catch (error) {
    console.error("Delete failed:", error);
  }
};


  const fetchRoles = async () => {
    try {
      setError("");
      setLoading(true); 
      const response = await axios.get(
        "http://43.250.40.133:5005/api/v1/roles?page=1&limit=100",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRolesData(response.data.data); 
    } catch (err) {
      console.error("Error fetching roles:", err);
      setError(
        "Failed to fetch roles. Please check your network or CORS settings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleExport = () => {
    const dataToExport = filteredRoles.map((role, index) => ({
      "SL.NO": index + 1,
      "Role Name": role.name || "N/A",
      Description: role.description || "N/A",
      Permissions: role.permissions?.map((p) => p.name).join(", ") || "N/A",
    }));

    if (dataToExport.length === 0) {
      alert("No roles available to export.");
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
    link.setAttribute("download", "roles_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex justify-start">
          <TextInput
            icon={HiSearch}
            placeholder="Search roles..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-64"
          />
        </div>

        {/* <h2 className="text-xl font-semibold text-gray-800 flex-shrink-0 ml-[-8px]">
          Roles List
        </h2> */}

                <div className="text-3xl font-semibold text-blue-800 mb-4 text-center">Roles List</div>

        <div className="flex items-center gap-3">
          <Dropdown label="Actions">
            <Dropdown.Item onClick={handleExport}>Export</Dropdown.Item>
            <Dropdown.Item>Import</Dropdown.Item>
          </Dropdown>

          <button
              onClick={() => setShowRoleModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md shadow transition duration-200"
          >
            Add Role
          </button>
        </div>
      </div>
        

      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md border border-red-300">
          {error}
        </div>
      )}

<AddRolesForm
  showModal={showRoleModal}
  setShowModal={setShowRoleModal}
  fetchRoles={fetchRoles}
  onClose={() => setShowRoleModal(false)}
/>

<EditRoleForm
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          role={selectedRole}
          fetchRoles={fetchRoles}
        />

<DeleteRoleConfirmation
  isOpen={deleteModalOpen}
  onClose={() => setDeleteModalOpen(false)}
  onConfirm={confirmDelete}
  roleName={roleToDelete?.name}
/>

    

      <DataTable
        columns={columns}
        data={filteredRoles}
        progressPending={loading}
        pagination
        customStyles={customStyles}
        highlightOnHover
        striped
        progressComponent={<div className="text-gray-600">Loading invoices...</div>}
        noDataComponent={
          error
            ? "Unable to display data due to an error."
            : "No invoice records found."
        }      />
    </div>
  );
};

export default RolesTable;

