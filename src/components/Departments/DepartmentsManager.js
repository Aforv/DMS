import {
  Button,
  Label,
  TextInput,
  DrawerHeader,
  Drawer,
  Textarea,
  Select,
  Dropdown,
} from "flowbite-react";
import { useEffect, useState } from "react";
import axios from "axios";
import DataTableWithMenu from "./DataTableWithMenu";
import { HiSearch } from "react-icons/hi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DepartmentsManager() {
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    _id: null,
    name: "",
    description: "",
    manager: "",
    parentDepartment: "",
  });

  const [errors, setErrors] = useState({});
  const [dataList, setDataList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [userList, setUserList] = useState([]);
  const [departmentsList, setDepartmentsList] = useState([]);

  const axiosConfig = () => ({
    headers: {
      Authorization: `Bearer ${
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzE4M2UzMDRkYWI3NzA4NDE3ZDM1NyIsImlhdCI6MTc0ODg1MzE0OSwiZXhwIjoxNzUxNDQ1MTQ5fQ.hEqPUqmbs1poYpDaQFz4bkcRUPEB34rZhKWD_riq_ms"
      }`,
    },
  });

  const handleExport = () => {
    // Placeholder export logic
    console.log("Export clicked");
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "http://43.250.40.133:5005/api/v1/departments",
        axiosConfig()
      );
      if (res.data?.data) setDataList(res.data.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to fetch departments.");
    }
  };

  const fetchUsersAndDepartments = async () => {
    try {
      const [usersRes, deptsRes] = await Promise.all([
        axios.get("http://43.250.40.133:5005/api/v1/users", axiosConfig()),
        axios.get("http://43.250.40.133:5005/api/v1/departments", axiosConfig()),
      ]);
      setUserList(usersRes.data?.data || []);
      setDepartmentsList(deptsRes.data?.data || []);
    } catch (err) {
      console.error("Error fetching users or departments:", err);
      toast.error("Failed to fetch users or departments.");
    }
  };

  useEffect(() => {
    fetchData();
    fetchUsersAndDepartments();
  }, []);

  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Department name is required";
    if (!formData.description.trim())
      tempErrors.description = "Description is required";
    if (!formData.manager) tempErrors.manager = "Manager is required";
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
      if (isEdit && formData._id) {
        await axios.put(
          `http://43.250.40.133:5005/api/v1/departments/${formData._id}`,
          formData,
          axiosConfig()
        );
        toast.success("Department updated successfully!");
      } else {
        await axios.post(
          "http://43.250.40.133:5005/api/v1/departments",
          formData,
          axiosConfig()
        );
        toast.success("Department added successfully!");
      }
      fetchData();
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error.response?.data || error);
      toast.error("Failed to submit department.");
    }
  };

  const resetForm = () => {
    setFormData({
      _id: null,
      name: "",
      description: "",
      manager: "",
      parentDepartment: "",
    });
    setErrors({});
    setIsEdit(false);
    setOpenModal(false);
  };

  const editItem = (item) => {
    if (!item) return;
    setFormData({
      _id: item._id,
      name: item.name || "",
      description: item.description || "",
      manager: item.manager?._id || "",
      parentDepartment: item.parentDepartment?._id || "",
    });
    setIsEdit(true);
    setOpenModal(true);
  };

  // New: Delete function calling the DELETE API and updating UI
  const handleDelete = async (id) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this department?")) return;

    try {
      await axios.delete(
        `http://43.250.40.133:5005/api/v1/departments/${id}`,
        axiosConfig()
      );
      toast.success("Department deleted successfully!");
      fetchData();
    } catch (error) {
      console.error("Error deleting department:", error.response?.data || error);
      toast.error("Failed to delete department.");
    }
  };

  const filteredList = dataList.filter((item) => {
    return (
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
        <div className="flex-grow max-w-[250px]">
          <TextInput
            icon={HiSearch}
            type="text"
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <h1 className="text-xl font-bold whitespace-nowrap">Departments</h1>
        <div className="flex items-center gap-3">
          <Dropdown label="Actions">
            <Dropdown.Item onClick={handleExport}>Export</Dropdown.Item>
            <Dropdown.Item>Import</Dropdown.Item>
          </Dropdown>
          <Button  color="blue" onClick={() => setOpenModal(true)}>Add Department</Button>
        </div>
      </div>

      <Drawer
        open={openModal}
        onClose={resetForm}
        position="right"
        size="full"
        className="w-[90vw] max-w-[500px]"
      >
        <DrawerHeader title={isEdit ? "Edit Department" : "Add Department"} />
        <div className="p-4 space-y-6">
          <form onSubmit={submit} noValidate>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">Department Name</Label>
                <TextInput
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  color={errors.name ? "failure" : "gray"}
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                />
                {errors.description && (
                  <p className="text-red-600 text-sm mt-1">{errors.description}</p>
                )}
              </div>
              <div>
                <Label htmlFor="manager">Manager</Label>
                <select
                  id="manager"
                  name="manager"
                  value={formData.manager}
                  onChange={handleChange}
                  className={`w-full border text-sm rounded-lg p-2.5 ${
                    errors.manager ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Manager</option>
                  {userList.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name}
                    </option>
                  ))}
                </select>
                {errors.manager && (
                  <p className="text-red-600 text-sm mt-1">{errors.manager}</p>
                )}
              </div>
              <div>
                <Label htmlFor="parentDepartment">Parent Department</Label>
                <select
                  id="parentDepartment"
                  name="parentDepartment"
                  value={formData.parentDepartment}
                  onChange={handleChange}
                  className="w-full border text-sm rounded-lg p-2.5 border-gray-300"
                >
                  <option value="">Select Parent Department</option>
                  {departmentsList.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
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
                {isEdit ? "Update Department" : "Add Department"}
              </Button>
            </div>
          </form>
        </div>
      </Drawer>

      <DataTableWithMenu
        data={filteredList}
        onEdit={editItem}
        onDelete={handleDelete} // Pass delete handler here
      />
    </>
  );
}

export default DepartmentsManager;




