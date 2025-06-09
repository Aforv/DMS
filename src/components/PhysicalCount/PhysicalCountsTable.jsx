import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import AddPhysicalCountForm from "./AddPhysicalCountForm";
import EditPhysicalCountForm from "./EditPhysicalCountForm";
// import DeletePhysicalCount from "./DeletePhysicalCount";
import axios from "axios";
import { HiDotsVertical, HiSearch, HiPencil, HiTrash } from "react-icons/hi";
import { Dropdown, TextInput } from "flowbite-react";
import { useAuth } from "../Authentication/AuthContext";

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

const PhysicalCountsTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [filterText, setFilterText] = useState("");

  const { token } = useAuth();

  const fetchData = async () => {
    try {
      setError("");
      const response = await axios.get("http://43.250.40.133:5005/api/v1/physical-counts?page=1&limit=100", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data.data);
    } catch (err) {
      console.error("Error fetching physical counts:", err);
      setError("Failed to fetch data. Please check your network or CORS settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://43.250.40.133:5005/api/v1/physical-counts/${itemToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData((prev) => prev.filter((item) => item._id !== itemToDelete._id));
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const filteredData = data.filter((item) => {
    const text = filterText.toLowerCase();
    return (
      item.countType?.toLowerCase().includes(text) ||
      item.location?.toLowerCase().includes(text) ||
      item.notes?.toLowerCase().includes(text) ||
      item.status?.toLowerCase().includes(text)
    );
  });

  const columns = [
    { name: "SL.NO", selector: (_, index) => index + 1, width: "80px" },
    {
      name: "Count Date",
      selector: (row) => new Date(row.countDate).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Count Type",
      selector: (row) => row.countType || "-",
    },
    {
      name: "Location",
      selector: (row) => row.location || "-",
    },
    {
      name: "Notes",
      selector: (row) => row.notes || "-",
      wrap: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.status === "Completed"
              ? "bg-green-100 text-green-800"
              : row.status === "Planned"
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
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

  const handleExport = () => {
    const dataToExport = filteredData.map((item, index) => ({
      "SL.NO": index + 1,
      "Count Date": new Date(item.countDate).toLocaleDateString(),
      "Count Type": item.countType || "",
      Location: item.location || "",
      Notes: item.notes || "",
      Status: item.status || "",
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
    link.setAttribute("download", "physical_counts.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <div className="flex gap-4">
          <TextInput
            icon={HiSearch}
            placeholder="Search physical counts..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-72"
          />
        </div>

        <div className="text-3xl font-semibold text-blue-800 mb-4 text-center">Physical Counts</div>

        <div className="flex items-center gap-3">
          <Dropdown label="Actions">
            <Dropdown.Item onClick={handleExport}>Export</Dropdown.Item>
            <Dropdown.Item>Import</Dropdown.Item>
          </Dropdown>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md shadow transition duration-200"
          >
            Add Physical Count
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
        progressComponent={<div className="text-gray-600">Loading data...</div>}
        noDataComponent={
          error ? "Unable to display data due to an error." : "No records found."
        }
      />

      {/* Modals */}
      <AddPhysicalCountForm
        showModal={showModal}
        setShowModal={setShowModal}
        fetchData={fetchData}
      />

      <EditPhysicalCountForm
        show={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        item={selectedItem}
        onUpdate={fetchData}
      />

      {/* <DeletePhysicalCount
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={itemToDelete?.location}
      /> */}
    </div>
  );
};

export default PhysicalCountsTable;

