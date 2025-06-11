import React from 'react';
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
import { HiSearch, HiTrash } from "react-icons/hi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CaseTable from './CaseTable';
import DeleteCase from './DeleteCase';

function AddCaseData() {
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    _id: null,
    caseNumber: "",
    patientName: "",
    patientAge: "",
    patientGender: "",
    surgeryDate: "",
    hospital: "",
    doctor: "",
    principle: "",
    category: "",
    subcategory: "",
    dpValue: "",
    sellingPrice: "",
    status: "",
    editNote: "",
    notes: "",
    products: [],
  });

  const [errors, setErrors] = useState({});
  const [dataList, setDataList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [principles, setPrinciples] = useState([]);
  const [products, setProducts] = useState([]);


  const axiosConfig = () => ({
    headers: {
      Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzE4M2UzMDRkYWI3NzA4NDE3ZDM1NyIsImlhdCI6MTc0OTEyOTA2NCwiZXhwIjoxNzUxNzIxMDY0fQ.CUIQgfi6wN15fTDCN0bT8ycSD6v6S_72Ive9Zu8sgZY"}`,
    },
  });

  const fetchData = async () => {
    try {
      const res = await axios.get("http://43.250.40.133:5005/api/v1/cases", axiosConfig());
      const mapped = (res.data?.data || []).map((item) => ({
        ...item,
        hospitalName: item.hospital?.name || item.hospital,
        doctorName: item.doctor?.name || item.doctor,
        principalName: item.principle?.name || item.principle,
        category: item.category?.name || item.category,
        subcategory: item.subcategory?.name || item.subcategory,
      }));
      setDataList(mapped);
    } catch (err) {
      toast.error("Failed to load cases.");
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [hospitalsRes, doctorsRes, categoriesRes, subcategoriesRes, principlesRes, productsRes] = await Promise.all([
        axios.get("http://43.250.40.133:5005/api/v1/hospitals", axiosConfig()),
        axios.get("http://43.250.40.133:5005/api/v1/doctors", axiosConfig()),
        axios.get("http://43.250.40.133:5005/api/v1/categories", axiosConfig()),
        axios.get("http://43.250.40.133:5005/api/v1/subcategories", axiosConfig()),
        axios.get("http://43.250.40.133:5005/api/v1/principles", axiosConfig()),
        axios.get("http://43.250.40.133:5005/api/v1/products", axiosConfig()),
      ]);

      setHospitals(hospitalsRes.data.data || []);
      setDoctors(doctorsRes.data.data || []);
      setCategories(categoriesRes.data.data || []);
      setSubcategories(subcategoriesRes.data.data || []);
      setPrinciples(principlesRes.data.data || []);
      setProducts(productsRes.data.data || []);
    } catch (error) {
      console.error("Dropdown fetch error:", error);
      toast.error("Failed to load dropdown data.");
    }
  };

  useEffect(() => {
    fetchData();
    fetchDropdownData();
  }, []);

  const validate = () => {
    const tempErrors = {};
    if (!formData.caseNumber) tempErrors.caseNumber = "Required";
    if (!formData.patientName) tempErrors.patientName = "Required";
    if (!formData.patientAge || isNaN(formData.patientAge)) tempErrors.patientAge = "Valid Age required";
    if (!formData.patientGender) tempErrors.patientGender = "Required";
    if (!formData.surgeryDate) tempErrors.surgeryDate = "Required";
    if (!formData.hospital) tempErrors.hospital = "Required";
    if (!formData.doctor) tempErrors.doctor = "Required";
    if (!formData.principle) tempErrors.principle = "Required";
    if (!formData.category) tempErrors.category = "Required";
    if (!formData.dpValue) tempErrors.dpValue = "Required";
    if (!formData.sellingPrice) tempErrors.sellingPrice = "Required";
    if (!formData.products.length) tempErrors.products = "At least one product required";
    else {
      formData.products.forEach((p, i) => {
        if (!p.product || !p.quantity || !p.unit_price || !p.dp_value) {
          tempErrors.products = `All product fields required (row ${i + 1})`;
        }
      });
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };


  const handleChange = (e) => {
    const { name, value, options, multiple } = e.target;

    if (multiple) {
      const values = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          values.push(options[i].value);
        }
      }
      setFormData((prev) => ({ ...prev, [name]: values }));
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      caseNumber: formData.caseNumber,
      patientName: formData.patientName,
      patientAge: parseInt(formData.patientAge),
      patientGender: formData.patientGender,
      surgeryDate: formData.surgeryDate,
      hospital: formData.hospital,
      doctor: formData.doctor,
      principle: formData.principle,
      category: formData.category,
      subcategory: formData.subcategory,
      dpValue: parseFloat(formData.dpValue),
      sellingPrice: parseFloat(formData.sellingPrice),
      notes: formData.notes,
      products: formData.products.map((p) => ({
        product: p.product,
        quantity: parseInt(p.quantity),
        unit_price: parseFloat(p.unit_price),
        dp_value: parseFloat(p.dp_value),
        batch_number: p.batch_number,
      })),
    };



    try {
      if (isEdit && formData._id) {
        const updatePayload = {
          status: formData.status,
          sellingPrice: parseFloat(formData.sellingPrice),
          notes: formData.notes,
        };
        await axios.put(`http://43.250.40.133:5005/api/v1/cases/${formData._id}`, updatePayload, axiosConfig());
        toast.success("Case updated.");
      } else {
        await axios.post("http://43.250.40.133:5005/api/v1/cases", payload, axiosConfig());
        toast.success("Case created.");
      }

      fetchData();
      resetForm();
    } catch (err) {
      console.error("Submit error:", err?.response?.data || err.message);
      toast.error("Failed to save case.");
    }
  };



  const deleteCase = async (id) => {

    try {
      await axios.delete(`http://43.250.40.133:5005/api/v1/cases/${formData._id}`, axiosConfig());
      toast.success("Case deleted.");
      fetchData();
    } catch {
      toast.error("Delete failed.");
    }
  };

  const updateStatus = async (_id, status) => {
    console.log("Attempting status update for:", _id);
    try {
      await axios.put(
        `http://43.250.40.133:5005/api/v1/cases/${_id}/status`,
        {
          status,
          notes: "Updated from UI"
        },
        axiosConfig()
      );
      toast.success("Status updated.");
      fetchData();
    } catch (err) {
      console.error("Status update failed:", err.response?.data || err.message);
      toast.error("Status update failed.");
    }
  };

  const downloadInvoice = async (id) => {
    try {
      const res = await axios.get(`http://43.250.40.133:5005/api/v1/cases/${formData._id}/invoice`, {
        ...axiosConfig(),
        responseType: "blob",
      });
      const url = URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `case-${id}-invoice.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch {
      toast.error("Invoice download failed.");
    }
  };

  const addProduct = () => {
    setFormData((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        { product: "", quantity: 1, unit_price: "", dp_value: "", batch_number: "" },
      ],
    }));
  };

  const removeProduct = (index) => {
    const updated = [...formData.products];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, products: updated }));
  };

  const updateProductField = (index, field, value) => {
    const updated = [...formData.products];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, products: updated }));
  };


  const resetForm = () => {
    setFormData({
      _id: null,
      caseNumber: "",
      patientName: "",
      patientAge: "",
      patientGender: "",
      surgeryDate: "",
      hospital: "",
      doctor: "",
      principle: "",
      category: "",
      subcategory: "",
      dpValue: "",
      sellingPrice: "",
      note: "",
      products: [],
    });
    setErrors({});
    setIsEdit(false);
    setOpenModal(false);
  };


  const filteredList = dataList.filter((item) => {
    const valuesToSearch = [
      item.caseNumber,
      item.patientName,
      item.patientGender,
      item.hospital,
      item.doctor,
      item.category,
      item.subcategory || item.subcategories || item.subcategory?.name || "",
      item.dpValue?.toString(),
      item.sellingPrice?.toString(),
      item.surgeryDate ? item.surgeryDate.slice(0, 10) : "",
      item.notes

    ]
      .join(" ")
      .toLowerCase();
    return valuesToSearch.includes(searchTerm.toLowerCase());
  });

  const editItem = (item) => {
    setFormData({
      _id: item._id,
      caseNumber: item.caseNumber || "",
      patientName: item.patientName || "",
      patientAge: item.patientAge || "",
      patientGender: item.patientGender || "",
      surgeryDate: item.surgeryDate?.slice(0, 10) || "",
      hospital: item.hospital?._id || item.hospital,
      doctor: item.doctor?._id || item.doctor,
      principle: item.principle?._id || item.principle,
      category: item.category?._id || item.category,
      subcategory: item.subcategory?._id || item.subcategory,
      dpValue: item.dpValue || "",
      sellingPrice: item.sellingPrice || "",
      status: item.status || "Pending",
      editNote: item.notes || "",
      notes: item.notes || "",
      products: (item.products || []).map((p) => ({
        product: p.product?._id || p.product,
        quantity: p.quantity,
        unit_price: p.unit_price,
        dp_value: p.dp_value,
        batch_number: p.batch_number,
      })),
    });
    setIsEdit(true);
    setOpenModal(true);
  };

  const openAddDrawer = () => {
    setFormData({
      _id: null,
      caseNumber: "",
      patientName: "",
      patientAge: "",
      patientGender: "",
      surgeryDate: "",
      hospital: "",
      doctor: "",
      principle: "",
      category: "",
      subcategory: "",
      dpValue: "",
      sellingPrice: "",
      notes: "",
      products: [],
    });
    setIsEdit(false);
    setOpenModal(true);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex flex-wrap items-center justify-between gap-1 mb-2">


        <Drawer
          open={openModal}
          onClose={resetForm}
          position="right"
          size="full"
          className="w-[90vw] max-w-[900px]"
        >
          <DrawerHeader title={isEdit ? "Edit Case" : "Add Case"} />
          <form onSubmit={submit} className="p-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                ["Case Number", "caseNumber"],
                ["Patient Name", "patientName"],
                ["Patient Age", "patientAge", "number"],
                ["Surgery Date", "surgeryDate", "date"],
                ["DP Value", "dpValue", "number"],
                ["Selling Price", "sellingPrice", "number"],
              ].map(([label, name, type = "text"]) => (
                <div key={name}>
                  <Label>{label}</Label>
                  <TextInput
                    type={type}
                    value={formData[name]}
                    onChange={(e) =>
                      setFormData({ ...formData, [name]: e.target.value })
                    }
                  />
                  {errors[name] && (
                    <p className="text-red-600 text-sm">{errors[name]}</p>
                  )}
                </div>
              ))}

              <div>
                <Label>Gender</Label>
                <Select
                  value={formData.patientGender}
                  onChange={(e) =>
                    setFormData({ ...formData, patientGender: e.target.value })
                  }
                >
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                </Select>
              </div>

              {[
                ["hospital", hospitals],
                ["doctor", doctors],
                ["principle", principles],
                ["category", categories],
                ["subcategory", subcategories],
              ].map(([key, list]) => (
                <div key={key}>
                  <Label>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                  <Select
                    value={formData[key]}
                    onChange={(e) =>
                      setFormData({ ...formData, [key]: e.target.value })
                    }
                  >
                    <option value="">Select</option>
                    {list.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name}
                      </option>
                    ))}
                  </Select>
                </div>
              ))}
            </div>

            <div>
              <Label>Products</Label>
              {formData.products.map((p, i) => (
                <div key={i} className="grid grid-cols-6 gap-2 mt-2">
                  <Select
                    value={p.product}
                    onChange={(e) =>
                      updateProductField(i, "product", e.target.value)
                    }
                  >
                    <option value="">Select</option>
                    {products.map((prod) => (
                      <option key={prod._id} value={prod._id}>
                        {prod.name}
                      </option>
                    ))}
                  </Select>
                  <TextInput
                    type="number"
                    placeholder="Qty"
                    value={p.quantity}
                    onChange={(e) =>
                      updateProductField(i, "quantity", e.target.value)
                    }
                  />
                  <TextInput
                    type="number"
                    placeholder="Unit Price"
                    value={p.unit_price}
                    onChange={(e) =>
                      updateProductField(i, "unit_price", e.target.value)
                    }
                  />
                  <TextInput
                    type="number"
                    placeholder="DP Value"
                    value={p.dp_value}
                    onChange={(e) =>
                      updateProductField(i, "dp_value", e.target.value)
                    }
                  />
                  <TextInput
                    placeholder="Batch "
                    value={p.batch_number}
                    onChange={(e) =>
                      updateProductField(i, "batch_number", e.target.value)
                    }
                  />
                  <Button
                    color="failure"
                    onClick={() => removeProduct(i)}
                    className="w-10 h-10"
                  >
                    <HiTrash className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              <Button onClick={addProduct} className="mt-3">
                + Add Product
              </Button>
              {errors.products && (
                <p className="text-red-600 text-sm">{errors.products}</p>
              )}
            </div>

            {isEdit && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Status</Label>
                    <Select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                    >
                      <option value="">Select Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </Select>
                  </div>

                  <div>
                    <Label>Selling Price</Label>
                    <TextInput
                      type="number"
                      value={formData.sellingPrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sellingPrice: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <Label>Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" color="gray" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" color="success">
                {isEdit ? "Update" : "Add"} Case
              </Button>
            </div>
          </form>
        </Drawer>

        <CaseTable
          data={filteredList}
          onEdit={editItem}
          onDelete={deleteCase}
          onAdd={openAddDrawer}
          onStatusUpdate={updateStatus}
          onInvoiceDownload={downloadInvoice}
        />
      </div>
    </>
  );
}
export default AddCaseData;
