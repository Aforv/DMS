import { PencilSquareIcon } from "@heroicons/react/16/solid";
import {
  Button,
  Label,
  TextInput,
  DrawerHeader,
  Drawer,
  Textarea,
} from "flowbite-react";
import { useEffect, useState } from "react";
import axios from "axios";

function Inventory() {
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    _id: null,
    product: "",
    batchNumber: "",
    quantity: "",
    location: "",
    dpValue: "",
    expiryDate: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [dataList, setDataList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const axiosConfig = () => ({
    headers: {
      Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzE4M2UzMDRkYWI3NzA4NDE3ZDM1NyIsImlhdCI6MTc0ODg1MzE0OSwiZXhwIjoxNzUxNDQ1MTQ5fQ.hEqPUqmbs1poYpDaQFz4bkcRUPEB34rZhKWD_riq_ms"}`,
    },
  });

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "http://43.250.40.133:5005/api/v1/inventory",
        axiosConfig()
      );
      if (res.data?.data) {
        setDataList(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching inventory data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validate = () => {
    let tempErrors = {};

   if (
    !formData.product || 
    (typeof formData.product === "string" && formData.product.trim() === "") ||
    (typeof formData.product === "object" && !formData.product.name)
  ) {
    tempErrors.product = "Product is required";
  }
    if (!formData.batchNumber || formData.batchNumber.trim() === "") {
      tempErrors.batchNumber = "Batch Number is required";
    }
    if (!formData.quantity) {
      tempErrors.quantity = "Quantity is required";
    } else if (isNaN(formData.quantity) || Number(formData.quantity) <= 0) {
      tempErrors.quantity = "Quantity must be a positive number";
    }
    if (!formData.location || formData.location.trim() === "") {
      tempErrors.location = "Location is required";
    }
    if (!formData.dpValue) {
      tempErrors.dpValue = "DpValue is required";
    } else if (isNaN(formData.dpValue) || Number(formData.dpValue) <= 0) {
      tempErrors.dpValue = "DpValue must be a positive number";
    }
    if (!formData.expiryDate) {
      tempErrors.expiryDate = "Expiry Date is required";
    } else {
      const today = new Date();
      const expiry = new Date(formData.expiryDate);
      if (expiry < today) {
        tempErrors.expiryDate = "Expiry Date must be today or in the future";
      }
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

    try {
      if (isEdit && editIndex !== null) {
        await axios.put(
          `http://43.250.40.133:5005/api/v1/inventory/${formData._id}`,
          formData,
          axiosConfig()
        );
        alert("Inventory updated successfully!");
      } else {
        await axios.post(
          "http://43.250.40.133:5005/api/v1/inventory",
          formData,
          axiosConfig()
        );
        alert("Inventory added successfully!");
      }
      await fetchData();
    } catch (error) {
      console.error("Error submitting inventory data:", error);
      alert("Something went wrong. Please try again.");
    }

    resetForm();
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
    ]
      .join(" ")
      .toLowerCase();

    return valuesToSearch.includes(searchTerm.toLowerCase());
  });

  const editItem = (index) => {
    const item = dataList[index];
    setFormData({
      _id: item._id,
      product: item.product || "",
      batchNumber: item.batchNumber || "",
      quantity: item.quantity || "",
      location: item.location || "",
      dpValue: item.dpValue || "",
      expiryDate: item.expiryDate || "",
      notes: item.notes || "",
    });
    setEditIndex(index);
    setIsEdit(true);
    setOpenModal(true);
    setErrors({});
  };

  return (
    <>
      <div style={{ margin: "10px" }}>
        <h1 style={{ fontSize: "25px" }}>
          <b>Add Inventory</b>
        </h1>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="w-full max-w-[200px]">
          <TextInput
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div>
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
                <TextInput
                  id="product"
                  name="product"
                  type="text"
                  sizing="sm"
                  value={formData.product}
                  onChange={handleChange}
                  color={errors.product ? "failure" : "gray"}
                />
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

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-6">
        <table className="w-full text-sm text-left text-gray-1000">
          <thead className="text-xs text-gray-700 uppercase bg-blue-100">
            <tr>
              <th className="px-6 py-3">Sl.No</th>
              <th className="px-6 py-3">Product</th>
              <th className="px-6 py-3">Batch No</th>
              <th className="px-6 py-3">Quantity</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3">DpValue</th>
              <th className="px-6 py-3">Expiry Date</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.length > 0 ? (
              filteredList.map((item, index) => (
                <tr
                  key={item._id || item.id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-3 py-2">{item.product?.name}</td>
                  <td className="px-6 py-4">{item.batchNumber}</td>
                  <td className="px-6 py-4">{item.quantity}</td>
                  <td className="px-6 py-4">{item.location}</td>
                  <td className="px-6 py-4">{item.dpValue}</td>
                  <td className="px-6 py-4">{item.expiryDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <Button size="xs" onClick={() => editItem(index)}>
                        <PencilSquareIcon className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="px-6 py-4 text-center text-gray-500"
                >
                  No inventory data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Inventory;
