// import {
//   Button,
//   Label,
//   TextInput,
//   DrawerHeader,
//   Drawer,
//   Dropdown,
//   Modal,
// } from "flowbite-react";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import DataTableWithMenu from "./dataTableWithFlowbite";
// import { HiSearch } from "react-icons/hi";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Papa from "papaparse";
// import { useAuth } from "../Authentication/AuthContext";

// function PrinciplesModule() {
//   const [openModal, setOpenModal] = useState(false);
//   const [showMenu, setShowMenu] = useState(false);
//   const [formData, setFormData] = useState({
//     _id: null,
//     principleName: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [dataList, setDataList] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [editIndex, setEditIndex] = useState(null);
//   const [isEdit, setIsEdit] = useState(false);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const {token} = useAuth();

//   const axiosConfig = () => ({
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   const fetchData = async () => {
//     try {
//       const res = await axios.get(
//         "http://43.250.40.133:5005/api/v1/principles",
//         axiosConfig()
//       );
//       if (res.data?.data) setDataList(res.data.data);
//     } catch (error) {
//       console.error("Error fetching principle:", error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const validate = () => {
//     let tempErrors = {};
//     if (!formData.principleName || formData.principleName === "")
//       tempErrors.principleName = "Principle Name is required";
//     setErrors(tempErrors);
//     return Object.keys(tempErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
//   };
// //   const handleDeleteRequest = (item) => {
// //   setSelectedItem(item);
// //   setShowConfirmModal(true);
// // };

//   const submit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;
//     if (!navigator.onLine) {
//       toast.error("You are offline. Please connect to the internet.");
//       return;
//     }

//     try {
//       const payload = { name: formData.principleName };
//       if (isEdit && formData._id) {
//         await axios.put(
//           `http://43.250.40.133:5005/api/v1/principles/${formData._id}`,
//           payload,
//           axiosConfig()
//         );
//         toast.success("Principle updated successfully!");
//       } else {
//         await axios.post(
//           "http://43.250.40.133:5005/api/v1/principles",
//           payload,
//           axiosConfig()
//         );
//         toast.success("Principle added successfully!");
//       }

//       fetchData();
//       resetForm();
//     } catch (error) {
//       console.error("Error submitting form:", error.response?.data || error);
//       toast.error("Failed to submit Principle.");
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       _id: null,
//       principleName: "",
//     });
//     setErrors({});
//     setIsEdit(false);
//     setEditIndex(null);
//     setOpenModal(false);
//   };

//   const filteredList = dataList
//     .filter((item) => {
//       const valuesToSearch = [item.name || ""].join(" ").toLowerCase();
//       return valuesToSearch.includes(searchTerm.toLowerCase());
//     })
//     .map((item) => ({
//       ...item,
//       principleName: item.name || "",
//     }));

//   const editItem = (item) => {
//   setFormData({
//     _id: item._id,
//     principleName: item.name || "",
//   });
//   setIsEdit(true);
//   setOpenModal(true);
//   setErrors({});
// };




//   const handleExport = () => {
//     if (!dataList || dataList.length === 0) {
//       toast.warning("No data to export");
//       return;
//     }

//     const exportData = dataList.map((item) => ({
//       principleName: item.name || "",
//     }));

//     const csv = Papa.unparse(exportData);
//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.setAttribute("href", url);
//     link.setAttribute("download", "inhouse_principle.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handleImport = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     Papa.parse(file, {
//       header: true,
//       skipEmptyLines: true,
//       complete: async function (results) {
//         const importedData = results.data;

//         const formattedData = importedData.map((item) => ({
//           name: item.principleName?.trim?.() || "",
//         }));

//         console.log("Formatted Import Payload:", formattedData);

//         try {
//           await axios.post(
//             "http://43.250.40.133:5005/api/v1/inhouse-principle/import",
//             formattedData,
//             axiosConfig()
//           );
//           toast.success("Import successful!");
//           fetchData();
//         } catch (error) {
//           console.error("Import failed:", error?.response?.data || error);
//           toast.error("Import failed.");
//         }
//       },
//     });
//   };

//     const handleDeleteRequest = (itemId) => {
//     const selected = dataList.find((d) => d._id === itemId);
//     if (selected) {
//       setSelectedItem(selected);
//       setShowConfirmModal(true);
//     }
//   };
//  const confirmDelete = async () => {
//   if (!selectedItem) return;

//   try {
//     await axios.delete(
//       `http://43.250.40.133:5005/api/v1/principles/${selectedItem._id}`,
//       axiosConfig()
//     );
//     toast.success("Principle deleted successfully!");
//     fetchData();
//   } catch (error) {
//     toast.error("Failed to delete.");
//   } finally {
//     setShowConfirmModal(false);
//     setSelectedItem(null);
//   }
// };



//   return (
//     <>
//       <ToastContainer position="top-right" autoClose={3000} />

//       <div className="flex flex-wrap items-center justify-between gap-4 mb-1 p-6">
//         <div className="flex-grow max-w-xs">
//           <TextInput
//             icon={HiSearch}
//             type="text"
//             placeholder="Search Principle..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         <h1 className="text-xl font-bold text-blue-900 flex-1 text-center">
//           Principle List
//         </h1>
//         <div className="flex items-center gap-2 flex-shrink-0">
//           <Dropdown label="Actions">
//             <Dropdown.Item as="label" htmlFor="import-file">
//               Import
//             </Dropdown.Item>
//             <Dropdown.Item onClick={handleExport}>Export</Dropdown.Item>
//           </Dropdown>

//           <input
//             id="import-file"
//             type="file"
//             accept=".csv"
//             onChange={handleImport}
//             className="hidden"
//           />
//         </div>
//         <Button color="lightblue" className="bg-blue-600" style={{color:"white"}} onClick={() => setOpenModal(true)}>Add Principle</Button>
//       </div>

//       <Drawer
//         open={openModal}
//         onClose={resetForm}
//         position="right"
//         size="full"
//         className="w-[90vw] max-w-[400px]"
//       >
//         <DrawerHeader title={isEdit ? "Edit Principle" : "Add Principle"} />
//         <div className="p-4 space-y-6">
//           <form onSubmit={submit} noValidate>
//             <div className="grid grid-cols-1 md:grid-cols-0 gap-6 ">
//               <div>
//                 <Label htmlFor="principleName mb-2">Principle Name</Label>
//                 <TextInput
//                   id="principleName"
//                   name="principleName"
//                   type="text"
//                   sizing="md"
//                   value={formData.principleName}
//                   onChange={handleChange}
//                   color={errors.principleName ? "failure" : "gray"}
//                 />
//                 {errors.principleName && (
//                   <p className="text-red-600 text-sm mt-1">
//                     {errors.principleName}
//                   </p>
//                 )}
//               </div>
//             </div>

//             <div className="flex justify-end gap-4 pt-4">
//               <Button
//                 onClick={resetForm}
//                 type="button"
//                 className="bg-red-600 hover:bg-red-700 text-white"
//               >
//                 Cancel
//               </Button>
//               <Button color="blue" type="submit">
//                 {isEdit ? "Update Principle" : "Add Principle"}
//               </Button>
//             </div>
//           </form>
//         </div>
//       </Drawer>
//       <Modal
//         show={showConfirmModal}
//         size="md"
//         popup
//         onClose={() => setShowConfirmModal(false)}
//       >
//         <Modal.Header />
//         <Modal.Body>
//           <div className="text-center">
//             <h3 className="mb-2 text-lg font-semibold text-red-600 text-left">
//               Confirm Deletion
//             </h3>
//             <p className="text-sm text-gray-700 text-left mb-4">
//               Are you sure you want to delete{"  "}
//               <span className="font-bold text-gray-900">
//                 {selectedItem?.name || "this Principle "} 
//               </span>
//               ?
//             </p>
//             <div className="flex justify-end gap-4">
//               <Button color="gray" onClick={() => setShowConfirmModal(false)}>
//                 Cancel
//               </Button>
//               <Button color="failure" onClick={confirmDelete}>
//                 Delete
//               </Button>
//             </div>
//           </div>
//         </Modal.Body>
//       </Modal>

//       <DataTableWithMenu
//         data={filteredList}
//         onEdit={editItem}
//         handleDeleteRequest={handleDeleteRequest}
//       />
//     </>
//   );
// }

// export default PrinciplesModule;



import {
  Button,
  Label,
  TextInput,
  DrawerHeader,
  Drawer,
  Dropdown,
  Modal,
} from "flowbite-react";
import { useEffect, useState } from "react";
import axios from "axios";
import DataTableWithMenu from "./dataTableWithFlowbite";
import { HiSearch } from "react-icons/hi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Papa from "papaparse";
import { useAuth } from "../Authentication/AuthContext";

function PrinciplesModule() {
  const [openModal, setOpenModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [formData, setFormData] = useState({
    _id: null,
    principleName: "",
    portfolioIds: [],
  });
  const [errors, setErrors] = useState({});
  const [dataList, setDataList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showContactDrawer, setShowContactDrawer] = useState(false);
  const { token } = useAuth();

  const [contactForm, setContactForm] = useState({
    principleId: "",
    portfolioName: "",
    departments: [
      {
        departmentName: "",
        personName: "",
        email: "",
        phone: "",
        address: "",
        location: "",
        pincode: "",
      },
    ],
  });

  const dummyPortfolioList = [
    { id: "1", name: "ordio" },
    { id: "2", name: "cardio" },
    { id: "3", name: "facers" },
    { id: "4", name: "sholders" },
  ];

  const axiosConfig = () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "http://43.250.40.133:5005/api/v1/principles",
        axiosConfig()
      );
      if (res.data?.data) setDataList(res.data.data);
    } catch (error) {
      console.error("Error fetching principle:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validate = () => {
    let tempErrors = {};
    if (!formData.principleName || formData.principleName === "")
      tempErrors.principleName = "Principle Name is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (!navigator.onLine) {
      toast.error("You are offline. Please connect to the internet.");
      return;
    }
    try {
      const payload = { name: formData.principleName };
      if (isEdit && formData._id) {
        await axios.put(
          "http://43.250.40.133:5005/api/v1/principles/${formData._id}",
          payload,
          axiosConfig()
        );
        toast.success("Principle updated successfully!");
      } else {
        await axios.post(
          "http://43.250.40.133:5005/api/v1/principles",
          payload,
          axiosConfig()
        );
        toast.success("Principle added successfully!");
      }
      fetchData();
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error.response?.data || error);
      toast.error("Failed to submit Principle.");
    }
  };

  const resetForm = () => {
    setFormData({
      _id: null,
      principleName: "",
      portfolioIds: [],
    });
    setErrors({});
    setIsEdit(false);
    setOpenModal(false);
  };

  const filteredList = dataList
    .filter((item) => {
      const valuesToSearch = [item.name || ""].join(" ").toLowerCase();
      return valuesToSearch.includes(searchTerm.toLowerCase());
    })
    .map((item) => ({
      ...item,
      principleName: item.name || "",
    }));

  const editItem = (item) => {
    setFormData({
      _id: item._id,
      principleName: item.name || "",
      portfolioIds: [],
    });
    setIsEdit(true);
    setOpenModal(true);
    setErrors({});
  };

  const handleExport = () => {
    if (!dataList || dataList.length === 0) {
      toast.warning("No data to export");
      return;
    }
    const exportData = dataList.map((item) => ({
      principleName: item.name || "",
    }));
    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "inhouse_principle.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async function (results) {
        const importedData = results.data;
        const formattedData = importedData.map((item) => ({
          name: item.principleName?.trim?.() || "",
        }));
        try {
          await axios.post(
            "http://43.250.40.133:5005/api/v1/inhouse-principle/import",
            formattedData,
            axiosConfig()
          );
          toast.success("Import successful!");
          fetchData();
        } catch (error) {
          console.error("Import failed:", error?.response?.data || error);
          toast.error("Import failed.");
        }
      },
    });
  };

  const handleDeleteRequest = (itemId) => {
    const selected = dataList.find((d) => d._id === itemId);
    if (selected) {
      setSelectedItem(selected);
      setShowConfirmModal(true);
    }
  };

  const confirmDelete = async () => {
    if (!selectedItem) return;
    try {
      await axios.delete(
        "http://43.250.40.133:5005/api/v1/principles/${selectedItem._id}",
        axiosConfig()
      );
      toast.success("Principle deleted successfully!");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete.");
    } finally {
      setShowConfirmModal(false);
      setSelectedItem(null);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex flex-wrap items-center justify-between gap-4 mb-1 p-6">
        <div className="flex-grow max-w-xs">
          <TextInput
            icon={HiSearch}
            type="text"
            placeholder="Search Principle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <h1 className="text-xl font-bold text-blue-900 flex-1 text-center">
          Principle List
        </h1>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Dropdown label="Actions">
            <Dropdown.Item as="label" htmlFor="import-file">
              Import
            </Dropdown.Item>
            <Dropdown.Item onClick={handleExport}>Export</Dropdown.Item>
          </Dropdown>
          <input
            id="import-file"
            type="file"
            accept=".csv"
            onChange={handleImport}
            className="hidden"
          />
        </div>
        <Button
          className="bg-blue-600 text-white"
          onClick={() => setOpenModal(true)}
        >
          Add Principle
        </Button>
        <Button
          className="bg-blue-600 text-white"
          onClick={() => setShowContactDrawer(true)}
        >
          Add Contact
        </Button>
      </div>

      {/* Add/Edit Principle Drawer */}
      <Drawer
        open={openModal}
        onClose={resetForm}
        position="right"
        size="full"
        className="w-[90vw] max-w-[400px]"
      >
        <DrawerHeader title={isEdit ? "Edit Principle" : "Add Principle"} />
        <div className="p-4 space-y-6">
          <form onSubmit={submit} noValidate>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <Label htmlFor="principleName">Principle Name</Label>
                <TextInput
                  id="principleName"
                  name="principleName"
                  type="text"
                  sizing="md"
                  value={formData.principleName}
                  onChange={handleChange}
                  color={errors.principleName ? "failure" : "gray"}
                />
                {errors.principleName && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.principleName}
                  </p>
                )}
              </div>
              <div>
                <Label className="mb-2">Select Portfolios</Label>
                <div className="grid grid-cols-2 gap-2 border rounded-md p-3 max-h-40 overflow-y-auto">
                  {dummyPortfolioList.map((portfolio) => (
                    <label
                      key={portfolio.id}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        value={portfolio.name}
                        checked={formData.portfolioIds.includes(portfolio.name)}
                        onChange={(e) => {
                          const { value, checked } = e.target;
                          setFormData((prev) => ({
                            ...prev,
                            portfolioIds: checked
                              ? [...prev.portfolioIds, value]
                              : prev.portfolioIds.filter((id) => id !== value),
                          }));
                        }}
                      />
                      <span className="text-sm">{portfolio.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <Button
                onClick={resetForm}
                type="button"
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Cancel
              </Button>
              <Button color="blue" type="submit">
                {isEdit ? "Update Principle" : "Add Principle"}
              </Button>
            </div>
          </form>
        </div>
      </Drawer>

      {/* Add Contact Drawer */}
      <Drawer
        open={showContactDrawer}
        onClose={() => setShowContactDrawer(false)}
        position="right"
        size="full"
        className="w-[90vw] max-w-[400px]"
      >
        <DrawerHeader title="Add Contact" />
        <form
          className="p-4 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Submitted Contact Data:", contactForm);
            toast.success("Contact added successfully!");
            setShowContactDrawer(false);
            // Reset form after submission
            setContactForm({
              principleId: "",
              portfolioName: "",
              departments: [
                {
                  departmentName: "",
                  personName: "",
                  email: "",
                  phone: "",
                  address: "",
                  location: "",
                  pincode: "",
                },
              ],
            });
          }}
        >
          {/* Principle Dropdown */}
          <select
            value={contactForm.principleId}
            onChange={(e) =>
              setContactForm({ ...contactForm, principleId: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Principle</option>
            {dataList.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Portfolio Dropdown */}
          <select
            value={contactForm.portfolioName}
            onChange={(e) =>
              setContactForm({ ...contactForm, portfolioName: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Portfolio</option>
            {dummyPortfolioList.map((port) => (
              <option key={port.id} value={port.name}>
                {port.name}
              </option>
            ))}
          </select>

          {/* Repeatable Department Inputs */}
          {contactForm.departments.map((dept, index) => (
            <div
              key={index}
              className="border p-3 rounded-md space-y-2 relative bg-gray-50"
            >
              <TextInput
                placeholder="Department Name"
                value={dept.departmentName}
                onChange={(e) => {
                  const updated = [...contactForm.departments];
                  updated[index].departmentName = e.target.value;
                  setContactForm({ ...contactForm, departments: updated });
                }}
              />
              <TextInput
                placeholder="Person Name *"
                value={dept.personName}
                onChange={(e) => {
                  const updated = [...contactForm.departments];
                  updated[index].personName = e.target.value;
                  setContactForm({ ...contactForm, departments: updated });
                }}
                required
              />
              <TextInput
                type="email"
                placeholder="Email *"
                value={dept.email}
                onChange={(e) => {
                  const updated = [...contactForm.departments];
                  updated[index].email = e.target.value;
                  setContactForm({ ...contactForm, departments: updated });
                }}
                required
              />
              <TextInput
                placeholder="Phone"
                value={dept.phone}
                onChange={(e) => {
                  const updated = [...contactForm.departments];
                  updated[index].phone = e.target.value;
                  setContactForm({ ...contactForm, departments: updated });
                }}
              />
              <TextInput
                placeholder="Address"
                value={dept.address}
                onChange={(e) => {
                  const updated = [...contactForm.departments];
                  updated[index].address = e.target.value;
                  setContactForm({ ...contactForm, departments: updated });
                }}
              />
              <TextInput
                placeholder="Location"
                value={dept.location}
                onChange={(e) => {
                  const updated = [...contactForm.departments];
                  updated[index].location = e.target.value;
                  setContactForm({ ...contactForm, departments: updated });
                }}
              />
              <TextInput
                placeholder="Pincode"
                value={dept.pincode}
                onChange={(e) => {
                  const updated = [...contactForm.departments];
                  updated[index].pincode = e.target.value;
                  setContactForm({ ...contactForm, departments: updated });
                }}
              />

              {/* Remove Department Button */}
              {contactForm.departments.length > 1 && (
                <Button
                  size="xs"
                  color="failure"
                  className="absolute top-1 right-1"
                  onClick={() => {
                    const updated = [...contactForm.departments];
                    updated.splice(index, 1);
                    setContactForm({ ...contactForm, departments: updated });
                  }}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}

          {/* Add Department Button */}
          <Button
            type="button"
            onClick={() =>
              setContactForm({
                ...contactForm,
                departments: [
                  ...contactForm.departments,
                  {
                    departmentName: "",
                    personName: "",
                    email: "",
                    phone: "",
                    address: "",
                    location: "",
                    pincode: "",
                  },
                ],
              })
            }
          >
            + Add New
          </Button>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              className="bg-red-600 text-white"
              onClick={() => setShowContactDrawer(false)}
            >
              Cancel
            </Button>
            <Button color="blue" type="submit">
              Add Contact
            </Button>
          </div>
        </form>
      </Drawer>

      {/* Confirmation Modal */}
      <Modal
        show={showConfirmModal}
        size="md"
        popup
        onClose={() => setShowConfirmModal(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold text-red-600 text-left">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-700 text-left mb-4">
              Are you sure you want to delete{" "}
              <span className="font-bold text-gray-900">
                {selectedItem?.name || "this Principle"}
              </span>
              ?
            </p>
            <div className="flex justify-end gap-4">
              <Button color="gray" onClick={() => setShowConfirmModal(false)}>
                Cancel
              </Button>
              <Button color="failure" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <DataTableWithMenu
        data={filteredList}
        onEdit={editItem}
        handleDeleteRequest={handleDeleteRequest}
      />
    </>
  );
}

export default PrinciplesModule;