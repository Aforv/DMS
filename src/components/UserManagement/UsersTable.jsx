// src/components/UserTable.jsx

import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Dropdown, TextInput } from "flowbite-react";
import { HiDotsVertical, HiSearch, HiPencil, HiTrash } from "react-icons/hi";
import { useAuth } from "../Authentication/AuthContext";
import AddUserForm from "./AddUserForm";
import axiosInstance from "../../utils/axiosInstancenew";



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

const UsersTable = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(
        "http://43.250.40.133:5005/api/v1/users?page=1&limit=100",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(response.data.data);
    } catch (err) {
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(
        `http://43.250.40.133:5005/api/v1/users/${userToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers((prev) => prev.filter((u) => u._id !== userToDelete._id));
      setDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const filteredUsers = users.filter((user) =>
    [user.name, user.email]
      .some((field) => field?.toLowerCase().includes(filterText.toLowerCase()))
  );

  const handleExport = () => {
    const dataToExport = filteredUsers.map((user, index) => ({
      "SL.NO": index + 1,
      Name: user.name,
      Email: user.email,
      Status: user.status,
      Roles: user.roles.join(", "),
    }));

    if (dataToExport.length === 0) return alert("No data to export.");

    const headers = Object.keys(dataToExport[0]);
    const csv = [headers.join(",")];

    for (const row of dataToExport) {
      csv.push(headers.map((h) => `"${row[h]}"`).join(","));
    }

    const blob = new Blob([csv.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", "user_list.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const columns = [
    { name: "SL.NO", selector: (_, index) => index + 1, width: "80px" },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Email", selector: (row) => row.email },
    {
      name: "Roles",
      selector: (row) => row.roles?.join(", "),
      wrap: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <span className={row.status === "active" ? "text-green-600" : "text-red-600"}>
          {row.status}
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

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <TextInput
          icon={HiSearch}
          placeholder="Search users..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="w-72"
        />

        <div className="text-3xl font-semibold text-blue-800 mb-4 text-center">
          Users List
        </div>

        <div className="flex items-center gap-3">
          <Dropdown label="Actions">
            <Dropdown.Item onClick={handleExport}>Export</Dropdown.Item>
            <Dropdown.Item>Import</Dropdown.Item>
          </Dropdown>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md shadow transition duration-200"
          >
            Add User
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
        data={filteredUsers}
        pagination
        highlightOnHover
        striped
        customStyles={customStyles}
        progressPending={loading}
        progressComponent={<div className="text-gray-600">Loading users...</div>}
        noDataComponent={error ? "Error loading users." : "No users found."}
      />

     <AddUserForm showModal={showAddModal} setShowModal={setShowAddModal} onSuccess={fetchUsers} />
       {/* <EditUserForm show={editModalOpen} onClose={() => setEditModalOpen(false)} user={selectedUser} onUpdate={fetchUsers} />
      <DeleteUser isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={confirmDelete} userName={userToDelete?.name} /> */}
    </div>
  );
};

export default UsersTable;
