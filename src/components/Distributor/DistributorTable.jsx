import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { HiDotsVertical, HiSearch, HiPencil, HiTrash } from "react-icons/hi";
import { Dropdown, TextInput } from "flowbite-react";
import AddDistributorForm from "./AddDistributorForm";
import EditDistributorForm from "./EditDistributorForm";
import DeleteDistributorConfirmation from "./DeleteDistributor";

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

const DistributorTable = () => {
  const [distributorData, setDistributorData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterText, setFilterText] = useState("");
  const [showAddDistributor, setShowAddDistributor] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedDistributor, setSelectedDistributor] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [distributorToDelete, setDistributorToDelete] = useState(null);

  // Load from localStorage
  const fetchDistributors = () => {
    try {
      const data = JSON.parse(localStorage.getItem("distributors")) || [];
      setDistributorData(data);
    } catch (err) {
      setError("Failed to load data from localStorage");
    }
  };

  useEffect(() => {
    fetchDistributors();
  }, []);

  const filteredData = distributorData.filter((dist) => {
    const text = filterText.toLowerCase();
    return (
      dist.name?.toLowerCase().includes(text) ||
      dist.email?.toLowerCase().includes(text) ||
      dist.phone?.toLowerCase().includes(text) ||
      dist.location?.toLowerCase().includes(text)
    );
  });

  const handleEdit = (distributor) => {
    setSelectedDistributor(distributor);
    setShowEditForm(true);
  };

  const handleDeleteClick = (distributor) => {
    setDistributorToDelete(distributor);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = (distributorId) => {
    const updated = distributorData.filter((d) => d._id !== distributorId);
    localStorage.setItem("distributors", JSON.stringify(updated));
    fetchDistributors();
  };

  const handleExport = () => {
    const dataToExport = filteredData.map((dist, index) => ({
      "SL.NO": index + 1,
      Name: dist.name || "",
      Email: dist.email || "",
      Phone: dist.phone || "",
      Location: dist.location || "",
      Address: dist.address || "",
      State: dist.state || "",
      Pincode: dist.pincode || "",
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
    link.setAttribute("download", "distributor_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    { name: "SL.NO", selector: (_, index) => index + 1, width: "80px" },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Email", selector: (row) => row.email },
    { name: "Phone", selector: (row) => row.phone },
    { name: "Location", selector: (row) => row.location || "N/A" },
    { name: "Address", selector: (row) => row.address || "N/A" },
    { name: "State", selector: (row) => row.state || "N/A" },
    { name: "Pincode", selector: (row) => row.pincode || "N/A" },
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
      <Dropdown.Item onClick={() => handleDeleteClick(row)} className="text-red-600">
        <HiTrash className="w-4 h-4 mr-2" /> Delete
      </Dropdown.Item>
    </Dropdown>
  ),
  button: true,
  width: "100px",
}
  ];

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <TextInput icon={HiSearch} placeholder="Search distributors..." value={filterText} onChange={(e) => setFilterText(e.target.value)} className="w-72" />

        <div className="text-3xl font-semibold text-blue-800 mb-4 text-center">Distributor List</div>

        <div className="flex items-center gap-3">
          <Dropdown label="Actions">
            <Dropdown.Item onClick={handleExport}>Export</Dropdown.Item>
            <Dropdown.Item>Import</Dropdown.Item>
          </Dropdown>

          <button
            onClick={() => setShowAddDistributor(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md shadow transition duration-200"
          >
            Add Distributor
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
        progressComponent={<div className="text-gray-600">Loading distributors...</div>}
        noDataComponent={
          error ? "Unable to display data due to an error." : "No distributor records found."
        }
      />

      <AddDistributorForm
        show={showAddDistributor}
        setShow={setShowAddDistributor}
        fetchDistributors={fetchDistributors}
      />

      <EditDistributorForm
        show={showEditForm}
        setShow={setShowEditForm}
        fetchDistributors={fetchDistributors}
        selectedDistributor={selectedDistributor}
      />

      <DeleteDistributorConfirmation
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        distributor={distributorToDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default DistributorTable;