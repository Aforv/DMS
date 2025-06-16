
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { HiDotsVertical, HiSearch, HiPencil, HiTrash } from "react-icons/hi";
import { Dropdown, TextInput } from "flowbite-react";
import EditPortfolioForm from "./EditForm";
import DeletePortfolioModal from "./DeleteForm";
import AddPortfolioForm from "./AddPortfolioForm";

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

const PortfolioTable = () => {
  const [portfolioData, setPortfolioData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [portfolioToDelete, setPortfolioToDelete] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("portfolioData")) || [];
    setPortfolioData(stored);
  }, []);

  const filteredData = portfolioData.filter((item) =>
    item.name?.toLowerCase().includes(filterText.toLowerCase())
  );

  const columns = [
    { name: "SL.NO", selector: (_, index) => index + 1, width: "80px" },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Description", selector: (row) => row.description || "N/A" },
    {
      name: "Actions",
      cell: (row) => (
        <Dropdown
          inline
          label={<HiDotsVertical className="w-5 h-5 text-gray-600 cursor-pointer" />}
          placement="left-start"
          arrowIcon={false}
        >
          <Dropdown.Item onClick={() => { setSelectedPortfolio(row); setShowEditForm(true); }}>
            <HiPencil className="w-4 h-4 mr-2" /> Edit
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => { setPortfolioToDelete(row); setShowDeleteModal(true); }}
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
          placeholder="Search portfolios..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="w-72"
        />

        <div className="text-3xl font-semibold text-blue-800 mb-4 text-center">
          Portfolio List
        </div>

        <div className="flex items-center gap-3">
          <Dropdown label="Actions">
            <Dropdown.Item onClick={() => alert("Export logic to be added")}>Export</Dropdown.Item>
            <Dropdown.Item disabled>Import</Dropdown.Item>
          </Dropdown>

          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md shadow transition duration-200"
          >
            Add Portfolio
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        striped
        highlightOnHover
        responsive
        customStyles={customStyles}
        paginationPerPage={5}
        paginationRowsPerPageOptions={[5, 10, 15]}
        noDataComponent="No portfolio records found."
      />

      <AddPortfolioForm
        show={showAddForm}
        setShow={setShowAddForm}
        setPortfolioData={setPortfolioData}
      />
      <EditPortfolioForm
        show={showEditForm}
        setShow={setShowEditForm}
        selectedPortfolio={selectedPortfolio}
        portfolioData={portfolioData}
        setPortfolioData={setPortfolioData}
      />
      <DeletePortfolioModal
        show={showDeleteModal}
        setShow={setShowDeleteModal}
        portfolioToDelete={portfolioToDelete}
        portfolioData={portfolioData}
        setPortfolioData={setPortfolioData}
      />
    </div>
  );
};

export default PortfolioTable;

