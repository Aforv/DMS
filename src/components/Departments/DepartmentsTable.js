import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsThreeDotsVertical } from "react-icons/bs";


const DepartmentsTable = () => {
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [dropdownOpenRow, setDropdownOpenRow] = useState(null); // ✅ individual row control
 
  const token = localStorage.getItem("myToken");

  const fetchDepartments = async () => {
    if (!token) {
      console.error("No token found!");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get("http://43.250.40.133:5005/api/v1/departments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data.data || [];
      setDepartments(data);
      setFilteredDepartments(data);
    } catch (err) {
      console.error("Error fetching departments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    const result = departments.filter((item) =>
      item.name?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredDepartments(result);
  }, [search, departments]);

  const columns = [
    {
      name: "#",
      selector: (row, index) => index + 1,
      width: "60px",
    },
    {
      name: "Name",
      selector: (row) => row.name || "N/A",
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description || "N/A",
      wrap: true,
    },
    {
      name: "Manager",
      selector: (row) => row.manager?.name || "N/A",
    },
    {
      name: "Parent Dept.",
      selector: (row) => row.parentDepartment?.name || "N/A",
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
      cell: (row) => {
        const isOpen = dropdownOpenRow === row._id;

        return (
          <div className="relative inline-block text-left">
            <button
              onClick={() =>
                setDropdownOpenRow(isOpen ? null : row._id)
              }
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <BsThreeDotsVertical size={18} />
            </button>

            {isOpen && (
              <div className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <button
                    onClick={() => alert(`Edit ${row.name}`)}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FiEdit2 className="mr-2" /> Edit
                  </button>
                  <button
                    onClick={() => alert(`Delete ${row.name}`)}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <RiDeleteBin6Line className="mr-2" /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#F9FAFB",
        fontWeight: "600",
        fontSize: "14px",
        textTransform: "uppercase",
        color: "#374151",
      },
    },
    rows: {
      style: {
        borderBottom: "1px solid #E5E7EB",
        fontSize: "14px",
      },
    },
    headCells: {
      style: {
        paddingLeft: "16px",
        paddingRight: "16px",
      },
    },
    cells: {
      style: {
        paddingLeft: "16px",
        paddingRight: "16px",
      },
    },
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-5">DEPARTMENTS</h1>

      {/* Search + Add */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
        <input
          type="text"
          placeholder="Search departments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      <button
  onClick={() => setShowModal(true)}
  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
>
  + Add Department
</button>

      </div>

      <DataTable
        columns={columns}
        data={filteredDepartments}
        customStyles={customStyles}
        progressPending={loading}
        pagination
        highlightOnHover
        pointerOnHover
        responsive
        noHeader
      />
   
    </div>
  );
};

export default DepartmentsTable;
