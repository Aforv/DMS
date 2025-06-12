import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialContact = () => ({
  department: "",
  personName: "",
  email: "",
  phone: "",
});

const AddContactForm = ({ showModal, setShowModal }) => {
  const [contacts, setContacts] = useState([initialContact()]);
  const [selectedHospitalId, setSelectedHospitalId] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingHospitals, setIsLoadingHospitals] = useState(false);

  // Fetch hospitals on modal open or component mount
  const fetchHospitals = async () => {
    setIsLoadingHospitals(true);
    try {
      const res = await fetch("http://43.250.40.133:5005/api/v1/hospitals", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to load hospitals");

      const data = await res.json();
      setHospitals(data.data || []);
    } catch (err) {
      toast.error("Failed to load hospitals");
    } finally {
      setIsLoadingHospitals(false);
    }
  };

  useEffect(() => {
    if (showModal) {
      fetchHospitals();
    }
  }, [showModal]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedContacts = [...contacts];
    updatedContacts[index][name] = value.trimStart();
    setContacts(updatedContacts);
  };

  const addContact = () => {
    setContacts((prev) => [...prev, initialContact()]);
  };

  const removeContact = (index) => {
    if (contacts.length === 1) return; // prevent empty form
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate all required fields
    const isValid = contacts.every(
      (contact) =>
        contact.personName && contact.email && contact.phone
    );

    if (!isValid) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    if (!selectedHospitalId) {
      toast.error("Please select a hospital.");
      setLoading(false);
      return;
    }

    // Filter out empty contacts
    const validContacts = contacts.filter(
      (contact) => contact.personName && contact.email && contact.phone
    );

    // Retrieve existing data from localStorage
    const storedData = JSON.parse(localStorage.getItem("hospitalContacts")) || [];

    // Find if hospital already exists
    const hospitalIndex = storedData.findIndex(
      (item) => item.hospitalId === selectedHospitalId
    );

    if (hospitalIndex > -1) {
      // Append new contacts to existing hospital
      storedData[hospitalIndex].contacts.push(...validContacts);
    } else {
      // Add new hospital entry
      storedData.push({
        hospitalId: selectedHospitalId,
        contacts: validContacts,
      });
    }

    // Save back to localStorage
    localStorage.setItem("hospitalContacts", JSON.stringify(storedData));

    toast.success("Contacts saved successfully!");
    setContacts([initialContact()]);
    setSelectedHospitalId("");
    setLoading(false);
    setShowModal(false);
  };

  return (
    <>
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex justify-end items-center bg-black bg-opacity-40"
          onClick={() => setShowModal(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black bg-opacity-40" />

          {/* Drawer */}
          <div
            className="relative bg-white w-full sm:max-w-md h-screen shadow-xl transform transition-transform duration-300 ease-in-out translate-x-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              &times;
            </button>

            {/* Form */}
            <form onSubmit={handleSubmit} className="h-full overflow-y-auto p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                Add Contacts
              </h2>

              {/* Hospital Selection Dropdown */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Hospital *
                </label>
                {isLoadingHospitals ? (
                  <p>Loading hospitals...</p>
                ) : (
                  <select
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedHospitalId}
                    onChange={(e) => setSelectedHospitalId(e.target.value)}
                    required
                  >
                    <option value="">-- Select Hospital --</option>
                    {hospitals.map((hospital) => (
                      <option key={hospital._id} value={hospital._id}>
                        {hospital.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Contact Fields */}
              {contacts.map((contact, index) => (
                <div key={index} className="mb-4 border p-4 rounded-md relative">
                  <button
                    type="button"
                    className="absolute top-2 right-2 text-red-500"
                    onClick={() => removeContact(index)}
                  >
                    &times;
                  </button>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Department Name</label>
                      <input
                        name="department"
                        value={contact.department}
                        onChange={(e) => handleChange(index, e)}
                        className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Person Name *</label>
                      <input
                        name="personName"
                        value={contact.personName}
                        onChange={(e) => handleChange(index, e)}
                        required
                        className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email *</label>
                      <input
                        name="email"
                        type="email"
                        value={contact.email}
                        onChange={(e) => handleChange(index, e)}
                        required
                        className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone *</label>
                      <input
                        name="phone"
                        type="tel"
                        value={contact.phone}
                        onChange={(e) => handleChange(index, e)}
                        required
                        className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addContact}
                className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                + Add Another Contact
              </button>

              <div className="pt-6 text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2 rounded-md font-semibold text-white transition ${
                    loading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 shadow"
                  }`}
                >
                  {loading ? "Saving..." : "Save Contacts"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddContactForm;