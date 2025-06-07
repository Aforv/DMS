import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { TextInput, Dropdown } from "flowbite-react";
import {
    HiSearch,
    HiTrash,
    HiPencil,
    HiDotsVertical,
} from "react-icons/hi";
import axios from "axios";

const DoctorTable = () => {
    const [filterText, setFilterText] = useState("");
    const [doctors, setDoctors] = useState([]);
    const [showAddDoctor, setShowAddDoctor] = useState(false);


    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzE4M2UzMDRkYWI3NzA4NDE3ZDM1NyIsImlhdCI6MTc0OTI2OTY4MiwiZXhwIjoxNzUxODYxNjgyfQ.VnXafM7C6nt5QOJbTx9OqC8h9q7R2I__qRequKQ2Klc";
    // Replace with JWT token

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await axios.get(
                    "http://43.250.40.133:5005/api/v1/doctors?page=1&limit=10",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setDoctors(res.data.data || []);
            } catch (err) {
                console.error("Error fetching doctors:", err);
            }
        };

        fetchDoctors();
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this doctor?")) {
            setDoctors((prev) => prev.filter((doc) => doc._id !== id));
        }
    };

    const handleEdit = (doctor) => {
        alert(`Edit doctor: ${doctor.name}`);
    };

    const filteredItems = doctors.filter((item) =>
        [item.name, item.email, item.specialization]
            .join(" ")
            .toLowerCase()
            .includes(filterText.toLowerCase())
    );

    const columns = [
        {
            name: "Name",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "Email",
            selector: (row) => row.email,
            sortable: true,
        },
        {
            name: "Phone",
            selector: (row) => row.phone,
            sortable: true,
        },
        {
            name: "Specialization",
            selector: (row) => row.specialization,
            sortable: true,
        },
        {
            name: "Hospital",
            selector: (row) => row.hospital,
        },
        {
            name: "Location",
            selector: (row) => row.location,
        },
        {
            name: "",
            cell: (row) => (
                <Dropdown
                    inline
                    label={
                        <HiDotsVertical className="w-5 h-5 text-gray-600 cursor-pointer" />
                    }
                    placement="left-start"
                    arrowIcon={false}
                >
                    <Dropdown.Item onClick={() => handleEdit(row)}>
                        <HiPencil className="w-4 h-4 mr-2" />
                        Edit
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleDelete(row._id)}>
                        <HiTrash className="w-4 h-4 mr-2 text-red-600" />
                        Delete
                    </Dropdown.Item>
                </Dropdown>
            ),
            width: "100px",
        },
    ];

    const customStyles = {
        headRow: {
            style: {
                backgroundColor: "lightblue",
                borderBottomWidth: "1px",
                fontWeight: 600,
            },
        },
        headCells: {
            style: {
                fontSize: "14px",
                color: "#111827",
                paddingLeft: "16px",
                paddingRight: "16px",
            },
        },
        rows: {
            style: {
                fontSize: "14px",
                color: "#374151",
                backgroundColor: "white",
            },
        },
        pagination: {
            style: {
                borderTop: "1px solid #e5e7eb",
                padding: "16px",
            },
        },
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="grid grid-cols-3 items-center mb-4">

                <div className="flex justify-start">
                    <TextInput
                        icon={HiSearch}
                        placeholder="Search doctors..."
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        className="w-64"
                    />
                </div>

                <div className="flex justify-center">
                    <h2 className="text-lg font-semibold text-gray-800">Doctor List</h2>
                </div>


                <div className="flex justify-end">
                    <button
                        onClick={() => setShowAddDoctor(true)}
                        className="font-medium py-2 px-4 rounded"
                        style={{
                            backgroundColor: "lightblue",
                            color: "black",
                        }}
                    >
                        Add Doctor
                    </button>

                </div>
            </div>

            <DataTable
                columns={columns}
                data={filteredItems}
                pagination
                highlightOnHover
                striped
                responsive
                customStyles={customStyles}
                paginationPerPage={5}
                paginationRowsPerPageOptions={[5, 10, 15]}
            />
        </div>
    );
};

export default DoctorTable;
