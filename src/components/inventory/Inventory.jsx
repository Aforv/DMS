import {
  Button,
  Label,
  TextInput,
  DrawerHeader,
  Drawer,
  Textarea,
  Select,
} from "flowbite-react";
import { useEffect, useState } from "react";
import axios from "axios";
import DataTableWithMenu from "./DataTableWithFlowbite";
import { HiSearch } from "react-icons/hi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Papa from "papaparse";
import { useAuth } from "../Authentication/AuthContext";


function Inventory() {
  const [openModal, setOpenModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [formData, setFormData] = useState({
    _id: null,
    product: "",
    batchNumber: "",
    quantity: "",
    location: "",
    dpValue: "",
    expiryDate: "",
    notes: "",
    binlocation :  "",
    avaliableQuantity : "",
    reservedQuantity : "",
    receivedDate : "",
    status : ""
  });

  const [errors, setErrors] = useState({});
  const [dataList, setDataList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [productList, setProductList] = useState([]); 
  const {token} = useAuth()

  const axiosConfig = () => ({
    headers: {
      Authorization: `Bearer ${token}`
    },
  });

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "http://43.250.40.133:5005/api/v1/inventory",
        axiosConfig()
      );
      if (res.data?.data) setDataList(res.data.data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "http://43.250.40.133:5005/api/v1/products",
        axiosConfig()
      );
      if (res.data?.data) setProductList(res.data.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchProducts(); 
  }, []);

 const validate = () => {
  let tempErrors = {};

  if (!formData.product || formData.product.trim() === "") {
    tempErrors.product = "Product is required";
  }
  if (!formData.batchNumber || formData.batchNumber.trim() === "") {
    tempErrors.batchNumber = "Batch Number is required";
  }
  if (formData.quantity === "") {
    tempErrors.quantity = "Quantity is required";
  } else if (isNaN(formData.quantity) || Number(formData.quantity) <= 0) {
    tempErrors.quantity = "Quantity must be a positive number";
  }
  if (formData.avaliableQuantity === "") {
    tempErrors.avaliableQuantity = "Available Quantity is required";
  } else if (isNaN(formData.avaliableQuantity) || Number(formData.avaliableQuantity) < 0) {
    tempErrors.avaliableQuantity = "Available Quantity must be 0 or more";
  }
  if (formData.reservedQuantity === "") {
    tempErrors.reservedQuantity = "Reserved Quantity is required";
  } else if (isNaN(formData.reservedQuantity) || Number(formData.reservedQuantity) < 0) {
    tempErrors.reservedQuantity = "Reserved Quantity must be 0 or more";
  }
  if (!formData.location || formData.location.trim() === "") {
    tempErrors.location = "Location is required";
  }
  if (!formData.binlocation || formData.binlocation.trim() === "") {
    tempErrors.binlocation = "Bin Location is required";
  }
  if (formData.dpValue === "") {
    tempErrors.dpValue = "DP Value is required";
  } else if (isNaN(formData.dpValue) || Number(formData.dpValue) <= 0) {
    tempErrors.dpValue = "DP Value must be a positive number";
  }
  if (!formData.expiryDate) {
    tempErrors.expiryDate = "Expiry Date is required";
  } else {
    const expiry = new Date(formData.expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    if (expiry < today) {
      tempErrors.expiryDate = "Expiry Date must be today or in the future";
    }
  }
  if (!formData.receivedDate) {
    tempErrors.receivedDate = "Received Date is required";
  }
  if (!formData.status || formData.status.trim() === "") {
    tempErrors.status = "Status is required";
  }

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
          `http://43.250.40.133:5005/api/v1/inventory/${formData._id}`,
          formData,
          axiosConfig()
        );
        toast.success("Inventory updated successfully!");
      } else {
        await axios.post(
          "http://43.250.40.133:5005/api/v1/inventory",
          formData,
          axiosConfig()
        );
        toast.success("Inventory added successfully!");
      }

      fetchData();
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error.response?.data || error);
      toast.error("Failed to submit inventory.");
    }
  };

  const resetForm = () => {
    setFormData({
      _id: null,
      product: "",
      batchNumber: "",
      quantity: "",
      location: "",
      dpValue: "",
      expiryDate: "",
      notes: "",
      binlocation :  "",
    avaliableQuantity : "",
    reservedQuantity : "",
    receivedDate : "",
    status : ""

    });
    setErrors({});
    setIsEdit(false);
    setEditIndex(null);
    setOpenModal(false);
  };

  const filteredList = dataList.filter((item) => {
    const valuesToSearch = [
      item.product?.name || "",
      item.batchNumber || "",
      item.quantity?.toString() || "",
      item.location || "",
      item.dpValue?.toString() || "",
      item.expiryDate || "",
      item.notes || "",
      item.binlocation ||  "",
      item.avaliableQuantity || "",
      item.reservedQuantity || "",
      item.receivedDate || "",
      item.status || ""
    ]
      .join(" ")
      .toLowerCase();
    return valuesToSearch.includes(searchTerm.toLowerCase());
  });

  const editItem = (item) => {
    if (!item) return;
    setFormData({
      _id: item._id,
      product: item.product?._id || "",
      batchNumber: item.batchNumber || "",
      quantity: item.quantity || "",
      location: item.location || "",
      dpValue: item.dpValue || "",
      expiryDate: item.expiryDate?.slice(0, 10) || "",
      notes: item.notes || "",
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
        Product: item.product?.name || "",
        BatchNumber: item.batchNumber,
        Quantity: item.quantity,
        Location: item.location,
        DPValue: item.dpValue,
        ExpiryDate: item.expiryDate?.slice(0, 10),
        Notes: item.notes,
      }));
  
      const csv = Papa.unparse(exportData);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "inhouse_inventory.csv");
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
  
  
          try {
            await axios.post(
              "http://43.250.40.133:5005/api/v1/inventory/import",
              importedData,
              axiosConfig()
            );
            toast.success("Import successful!");
            fetchData();
          } catch (error) {
            console.error("Import failed:", error);
            toast.error("Import failed.");
          }
        },
      });
    };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
   <div className="flex flex-wrap items-center justify-between gap-1 mb-2">

  <div className="flex-grow max-w-[250px]">
    <TextInput
      icon={HiSearch}
      type="text"
      placeholder="Search inventory..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>

  <h1 className="text-xl font-bold whitespace-nowrap">Inventory List</h1>

  <div className="flex gap-2 items-center">
    
    <div
      className="relative inline-block text-left"
      onBlur={() => setShowMenu(false)}
      tabIndex={0}
    >
      <Button
        color="blue"
        onClick={() => setShowMenu((prev) => !prev)}
        aria-expanded={showMenu}
      >
        Actions
      </Button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-20 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            <button
              onClick={() => {
                handleExport();
                setShowMenu(false);
              }}
              className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
            >
              Export
            </button>

            <label
              htmlFor="file-upload"
              className="block w-full px-4 py-2 text-sm text-left cursor-pointer hover:bg-gray-100"
            >
              Import
              <input
                type="file"
                id="file-upload"
                accept=".csv"
                onChange={(e) => {
                  handleImport(e);
                  setShowMenu(false);
                }}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}
    </div>

    <Button onClick={() => setOpenModal(true)}>Add Inventory</Button>
  </div>
</div>


      <Drawer
        open={openModal}
        onClose={resetForm}
        position="right"
        size="full"
        className="w-[90vw] max-w-[500px]"
      >
        <DrawerHeader title={isEdit ? "Edit Inventory" : "Add Inventory"} />
        <div className="p-4 space-y-6">
          <form onSubmit={submit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <Label htmlFor="product">Product</Label>
                <select
                  id="product"
                  name="product"
                  value={formData.product}
                  onChange={handleChange}
                  className={`w-full border text-sm rounded-lg p-2.5 ${
                    errors.product ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select a product</option>
                  {productList.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                {errors.product && (
                  <p className="text-red-600 text-sm mt-1">{errors.product}</p>
                )}
              </div>

              <div>
                <Label htmlFor="batchNumber">Batch No</Label>
                <TextInput
                  id="batchNumber"
                  name="batchNumber"
                  type="text"
                  sizing="sm"
                  value={formData.batchNumber}
                  onChange={handleChange}
                  color={errors.batchNumber ? "failure" : "gray"}
                />
                {errors.batchNumber && (
                  <p className="text-red-600 text-sm mt-1">{errors.batchNumber}</p>
                )}
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <TextInput
                  id="location"
                  name="location"
                  type="text"
                  sizing="sm"
                  value={formData.location}
                  onChange={handleChange}
                  color={errors.location ? "failure" : "gray"}
                />
                {errors.location && (
                  <p className="text-red-600 text-sm mt-1">{errors.location}</p>
                )}
              </div>
               <div>
                <Label htmlFor="binloacation">Bin Location</Label>
                <TextInput
                  id="binlocation"
                  name="binlocation"
                  type="text"
                  sizing="sm"
                  value={formData.binlocation}
                  onChange={handleChange}
                  color={errors.binlocation ? "failure" : "gray"}
                />
                {errors.binlocation && (
                  <p className="text-red-600 text-sm mt-1">{errors.binlocation}</p>
                )}
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <TextInput
                  id="quantity"
                  name="quantity"
                  type="number"
                  sizing="sm"
                  value={formData.quantity}
                  onChange={handleChange}
                  color={errors.quantity ? "failure" : "gray"}
                  min={1}
                />
                {errors.quantity && (
                  <p className="text-red-600 text-sm mt-1">{errors.quantity}</p>
                )}
              </div>

              <div>
                <Label htmlFor="avaliableQuantity">AvaliableQuantity</Label>
                <TextInput
                  id="avaliableQuantity"
                  name="avaliableQuantity"
                  type="number"
                  sizing="sm"
                  value={formData.avaliableQuantity}
                  onChange={handleChange}
                  color={errors.avaliableQuantity ? "failure" : "gray"}
                  min={1}
                />
                {errors.avaliableQuantity && (
                  <p className="text-red-600 text-sm mt-1">{errors.avaliableQuantity}</p>
                )}
              </div>

              <div>
                <Label htmlFor="reservedQuantity">ReservedQuantity</Label>
                <TextInput
                  id="reservedQuantity"
                  name="reservedQuantity"
                  type="number"
                  sizing="sm"
                  value={formData.reservedQuantity}
                  onChange={handleChange}
                  color={errors.reservedQuantity ? "failure" : "gray"}
                  min={1}
                />
                {errors.reservedQuantity && (
                  <p className="text-red-600 text-sm mt-1">{errors.reservedQuantity}</p>
                )}
              </div>

              <div>
                <Label htmlFor="dpValue">DpValue</Label>
                <TextInput
                  id="dpValue"
                  name="dpValue"
                  type="number"
                  sizing="sm"
                  value={formData.dpValue}
                  onChange={handleChange}
                  color={errors.dpValue ? "failure" : "gray"}
                  min={0.01}
                  step={0.01}
                />
                {errors.dpValue && (
                  <p className="text-red-600 text-sm mt-1">{errors.dpValue}</p>
                )}
              </div>

              <div>
                <Label htmlFor="receivedDate">Received Date</Label>
                <TextInput
                  id="receivedDate"
                  name="receivedDate"
                  type="date"
                  sizing="sm"
                  value={formData.receivedDate}
                  onChange={handleChange}
                  color={errors.receivedDate ? "failure" : "gray"}
                />
                {errors.receivedDate && (
                  <p className="text-red-600 text-sm mt-1">{errors.receivedDate}</p>
                )}
              </div>

              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <TextInput
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  sizing="sm"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  color={errors.expiryDate ? "failure" : "gray"}
                />
                {errors.expiryDate && (
                  <p className="text-red-600 text-sm mt-1">{errors.expiryDate}</p>
                )}
              </div>

              <div>
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="">Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </Select>
                {errors.status && (
                  <p className="text-red-600 text-sm mt-1">{errors.status}</p>
                )}
              </div>


              <div className="md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="notes..."
                />
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
                {isEdit ? "Update Inventory" : "Add Inventory"}
              </Button>
            </div>
          </form>
        </div>
      </Drawer>

      <DataTableWithMenu data={filteredList} onEdit={editItem} />
    </>
  );
}

export default Inventory;
