import { Button, Label, TextInput, Select } from "flowbite-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiOutlineX } from "react-icons/hi";
import Snackbar from "@mui/material/Snackbar";
import axios from "axios";

const EditDepartment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("myToken");

  const [openDrawer, setOpenDrawer] = useState(true);
  const [loading, setLoading] = useState(true);

  const [departmentData, setDepartmentData] = useState({
       description: "",
    manager: "",
  });

  const [managers, setManagers] = useState([]);

  // Snackbar States
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const vertical = "bottom";
  const horizontal = "center";

  const showSnackbar = (message) => {
    setSnackMessage(message);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const closeDrawer = () => {
    setOpenDrawer(false);
    navigate(-1);
  };

  // Fetch department data
  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const { data } = await axios.get(
          `http://43.250.40.133:5005/api/v1/departments/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setDepartmentData({
          description: data.data.description || "",
          manager: data.data.manager || "", // Assuming backend sends manager ID
        });
      } catch (error) {
        console.error("Error fetching department:", error);
        showSnackbar("Failed to load department");
        navigate("/departments");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [id, token, navigate]);

  // Fetch manager list
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const { data } = await axios.get(
          `http://43.250.40.133:5005/api/v1/users`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setManagers(data.data); // Assuming response is { data: [...] }
      } catch (error) {
        console.error("Error fetching users:", error);
        showSnackbar("Failed to fetch users");
      }
    };

    fetchManagers();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartmentData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!departmentData.description.trim()) {
    showSnackbar("Description is required");
    return;
  }

  try {
    await axios.put(
      `http://43.250.40.133:5005/api/v1/departments/${id}`,
      {
        description: departmentData.description,
        manager: departmentData.manager,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    showSnackbar("Department updated successfully!");
    navigate("/departments");
  } catch (error) {
    console.error("Update failed:", error);
    showSnackbar("Error updating department");
  }
};

  if (loading) {
    return <div className="text-center mt-10 text-gray-500">Loading department...</div>;
  }

  return (
    openDrawer && (
      <>
        <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-30">
          <div className="w-full max-w-md bg-white h-full shadow-lg p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Edit Department</h3>
              <button onClick={closeDrawer}>
                <HiOutlineX className="w-6 h-6 text-gray-600 hover:text-red-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="description" value="Description" />
                <TextInput
                  id="description"
                  name="description"
                  value={departmentData.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                  required
                />
              </div>

              <div>
                <Label htmlFor="manager" value="Manager" />
                <Select
                  id="manager"
                  name="manager"
                  value={departmentData.manager}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Manager</option>
                  {managers.map((manager) => (
                    <option key={manager._id} value={manager._id}>
                      {manager.name || manager.email}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="flex justify-between mt-4">
                <Button color="gray" onClick={closeDrawer} type="button">
                  Cancel
                </Button>
                <Button type="submit">Update</Button>
              </div>
            </form>
          </div>
        </div>

        {/* Snackbar */}
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={openSnackbar}
          onClose={handleCloseSnackbar}
          message={snackMessage}
          autoHideDuration={3000}
          key={vertical + horizontal}
        />
      </>
    )
  );
};

export default EditDepartment;
