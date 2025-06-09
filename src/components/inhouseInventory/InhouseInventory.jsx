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
import { HiSearch } from "react-icons/hi";
import DataTablewithMenu from "./DataTablewithMenu";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Papa from "papaparse";
import EditinhouseinventoryDrawer from "./EditInhouseInventory";

function InhouseInventory() {
  const [openModal, setOpenModal] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [products, setProducts] = useState([]);
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
    binLocation: "",
    reservationReason: "",
  });

  const [errors, setErrors] = useState({});
  const [dataList, setDataList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEdit, setIsEdit] = useState(false);


  const axiosConfig = () => ({
    headers: {
      Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzE4M2UzMDRkYWI3NzA4NDE3ZDM1NyIsImlhdCI6MTc0ODg1MzE0OSwiZXhwIjoxNzUxNDQ1MTQ5fQ.hEqPUqmbs1poYpDaQFz4bkcRUPEB34rZhKWD_riq_ms"}`,
    },
  });


  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "http://43.250.40.133:5005/api/v1/products",
        axiosConfig()
      );
      if (res.data?.data) {
        setProducts(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };



  const fetchData = async () => {
    try {
      const res = await axios.get(
        "http://43.250.40.133:5005/api/v1/inhouse-inventory",
        axiosConfig()
      );
      if (res.data?.data) {
        setDataList(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching inventory data:", error);
    }
  };


  const fetchLowStock = async () => {
    try {
      const res = await axios.get(
        "http://43.250.40.133:5005/api/v1/inhouse-inventory/low-stock",
        axiosConfig()
      );
      setDataList(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching low stock items:", error);
    }
  };


  const fetchExpiringSoon = async () => {
    try {
      const res = await axios.get(
        "http://43.250.40.133:5005/api/v1/inhouse-inventory/expiring",
        axiosConfig()
      );
      setDataList(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching expiring items:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchProducts();
  }, []);

  // Validation
  const validate = () => {
    let tempErrors = {};

    if (!formData.product || formData.product.trim() === "")
      tempErrors.product = "Product is required";

    if (!formData.batchNumber || formData.batchNumber.trim() === "")
      tempErrors.batchNumber = "Batch Number is required";

    if (!formData.quantity)
      tempErrors.quantity = "Quantity is required";
    else if (isNaN(formData.quantity) || Number(formData.quantity) <= 0)
      tempErrors.quantity = "Quantity must be a positive number";

    if (!formData.location || formData.location.trim() === "")
      tempErrors.location = "Location is required";

    if (!formData.dpValue)
      tempErrors.dpValue = "DpValue is required";
    else if (isNaN(formData.dpValue) || Number(formData.dpValue) <= 0)
      tempErrors.dpValue = "DpValue must be a positive number";

    if (!formData.expiryDate)
      tempErrors.expiryDate = "Expiry Date is required";
    else {
      const today = new Date();
      const expiry = new Date(formData.expiryDate);
      if (expiry < today.setHours(0, 0, 0, 0)) {
        tempErrors.expiryDate = "Expiry Date must be today or in the future";
      }
    }

    if (!formData.binLocation || formData.binLocation.trim() === "")
      tempErrors.binLocation = "Bin Location is required";

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
          `http://43.250.40.133:5005/api/v1/inhouse-inventory/${formData._id}`,
          formData,
          axiosConfig()
        );
        toast.success("Inventory updated successfully!");
      } else {
        await axios.post(
          "http://43.250.40.133:5005/api/v1/inhouse-inventory",
          formData,
          axiosConfig(),
          console.log(formData)
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

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    let tempErrors = {};

    if (!formData.quantity || Number(formData.quantity) <= 0) {
      tempErrors.quantity = "Quantity must be a positive number";
    }

    if (!formData.binLocation || formData.binLocation.trim() === "") {
      tempErrors.binLocation = "Bin Location is required";
    }

    if (!formData.reservationReason || formData.reservationReason.trim() === "") {
      tempErrors.reservationReason = "Reservation Reason is required";
    }

    setErrors(tempErrors);

    if (Object.keys(tempErrors).length > 0) return;

    try {
      const updateData = {
        quantity: formData.quantity,
        binLocation: formData.binLocation,
        reservationReason: formData.reservationReason,
      };

      await axios.put(
        `http://43.250.40.133:5005/api/v1/inhouse-inventory/${formData._id}`,
        updateData,
        axiosConfig()
      );

      toast.success("Inventory updated successfully");
      setEditDrawerOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Edit error:", error);
      toast.error("Failed to update inventory");
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
      binLocation: "",
      reservationReason: "",
    });
    setErrors({});
    setOpenModal(false);
    setEditDrawerOpen(false);
    setIsEdit(false);
  };


  const editItem = (item) => {
    let tempErrors = {};
    if (!item) return;
    setFormData({
      _id: item._id,
      product: item.product?._id || "",
      batchNumber: item.batchNumber || "",
      quantity: item.quantity || "",
      location: item.location || "",
      dpValue: item.dpValue || "",
      expiryDate: item.expiryDate?.slice(0, 10) || "",
      quantity: item.quantity || "",
      binLocation: item.binLocation || "",
      reservationReason: item.reservationReason || "",

    });


    setEditDrawerOpen(true);
    setErrors({});
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
    ]
      .join(" ")
      .toLowerCase();

    return valuesToSearch.includes(searchTerm.toLowerCase());
  });


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
            "http://43.250.40.133:5005/api/v1/inhouse-inventory/import",
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
      <ToastContainer />
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
  
  <div className="w-full sm:w-auto max-w-[200px]">
    <TextInput
      icon={HiSearch}
      type="text"
      placeholder="Search inventory..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>


  <h1 className="text-2xl font-bold text-center flex-grow text-gray-800">
    Inhouse Inventory List
  </h1>

  
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
        <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            <button
              onClick={() => {
                fetchLowStock();
                setShowMenu(false);
              }}
              className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
            >
              Low Stock
            </button>

            <button
              onClick={() => {
                fetchExpiringSoon();
                setShowMenu(false);
              }}
              className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
            >
              Expiring Soon
            </button>

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

   
    <Button onClick={() => setOpenModal(true)}>Add Inhouse Inventory</Button>
  </div>
</div>



      <Drawer
        open={openModal}
        onClose={resetForm}
        position="right"
        size="full"
        className="w-[90vw] max-w-[500px]"
      >
        <DrawerHeader title={isEdit ? "Edit InhouseInventory" : "Add InhouseInventory"} />

        <div className="p-4 space-y-6">
          <form onSubmit={submit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="product">Product</Label>
                <Select
                  id="product"
                  name="product"
                  sizing="sm"
                  value={formData.product}
                  onChange={handleChange}
                  color={errors.product ? "failure" : "gray"}
                >
                  <option value="">Select product</option>
                  {products.map((prod) => (
                    <option key={prod._id} value={prod._id}>
                      {prod.name}
                    </option>
                  ))}
                </Select>
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
                <Label htmlFor="binLocation">Bin Location</Label>
                <TextInput
                  id="binLocation"
                  name="binLocation"
                  type="text"
                  sizing="sm"
                  value={formData.binLocation}
                  onChange={handleChange}
                  color={errors.binLocation ? "failure" : "gray"}
                />
                {errors.binLocation && (
                  <p className="text-red-600 text-sm mt-1">{errors.binLocation}</p>
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


      <EditinhouseinventoryDrawer
        open={editDrawerOpen}
        onClose={resetForm}
        onSubmit={handleEditSubmit}
        formData={formData}
        errors={errors}
        handleChange={handleChange}
        products={products}
      />




      <DataTablewithMenu data={filteredList} onEdit={editItem} />
    </>
  );
}

export default InhouseInventory;
