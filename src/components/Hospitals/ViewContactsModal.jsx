import React from "react";
import DataTable from "react-data-table-component";

const ViewContactsModal = ({ showModal, setShowModal, hospital }) => {
  if (!showModal || !hospital) return null;

  // Get all contacts from localStorage
  const contacts = JSON.parse(localStorage.getItem("hospitalContacts")) || [];

  // Filter contacts by hospital._id
  const hospitalContacts = contacts.filter(
    (contact) => contact.hospitalId === hospital._id
  );

  // Table columns
  const columns = [
    {
      name: "Department",
      selector: (row) => row.department || "--",
      sortable: true,
    },
    {
      name: "Person Name",
      selector: (row) => row.personName || "--",
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email || "--",
    },
    {
      name: "Phone",
      selector: (row) => row.phone || "--",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <div
        className="bg-white w-full max-w-3xl p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Contacts for {hospital.name}</h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-600 hover:text-gray-900 text-2xl"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Hospital Info */}
        <div className="mb-6 border-b pb-4">
          <p className="font-medium">Hospital Address:</p>
          <p className="text-sm text-gray-700">
            {hospital.address}, {hospital.city}, {hospital.state} - {hospital.pincode}
          </p>
          <p className="text-sm text-gray-700 mt-1">
            <strong>Email:</strong> {hospital.email}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Phone:</strong> {hospital.phone}
          </p>
        </div>

        {/* Contacts Table */}
        {hospitalContacts.length > 0 ? (
          <DataTable
            columns={columns}
            data={hospitalContacts}
            pagination
            highlightOnHover
            striped
            noDataComponent="No contacts found for this hospital."
          />
        ) : (
          <div className="text-center py-6 text-gray-500">
            No contacts found for <strong>{hospital.name}</strong>.
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewContactsModal;