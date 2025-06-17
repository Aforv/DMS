import React, { useEffect, useState } from "react";
import {
  Button,
  Label,
  TextInput,
  Select,
  Drawer,
  DrawerHeader,
} from "flowbite-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

function InventoryUpdate({ show, onClose, caseData, onSuccess }) {
  const [formData, setFormData] = useState({
    patientName: "",
    ipNo: "",
    usedProduct: "",
    paymentType: "",
    invoice: "",
    collectionStaff: "",
    assignedAt:"",
    cash: "",
  });

  const [products, setProducts] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [errors, setErrors] = useState({});

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  const fetchProducts = async () => {
    if (!caseData?.subcategory) return;

    try {
      const res = await axios.get(
        `http://43.250.40.133:5005/api/v1/products?subcategory=${caseData.subcategory}`,
        axiosConfig
      );
      setProducts(res.data?.data || []);
    } catch (err) {
      toast.error("Failed to load products.");
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await axios.get(
        "http://43.250.40.133:5005/api/v1/staff",
        axiosConfig
      );
      setStaffList(res.data?.data || []);
    } catch (err) {
      toast.error("Failed to load staff list.");
    }
  };

  useEffect(() => {
    if (show) {
      fetchProducts();
      fetchStaff();
      if (caseData) {
        setFormData({
          patientName: caseData.patientName || "",
          ipNo: caseData.ipNo || "",
          usedProduct: caseData.usedProduct || "",
          paymentType: caseData.paymentType || "",
          invoice: caseData.invoice || "",
          collectionStaff: caseData.collectionStaff || "",
          assignedAt:caseData.assignedAt?.slice(0, 10) || "",
          cash: caseData.cash || "",
        });
      }
    }
  }, [show, caseData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const temp = {};
    if (!formData.patientName) temp.patientName = "Required";
    if (!formData.ipNo) temp.ipNo = "Required";
    if (!formData.usedProduct) temp.usedProduct = "Required";
    if (!formData.paymentType) temp.paymentType = "Required";
    if (
      (formData.paymentType === "Cash" || formData.paymentType === "Invoice") &&
      !formData.invoice
    )
      temp.invoice = "Required";
    if (formData.paymentType === "Cash" && !formData.cash)
      temp.cash = "Cash amount required";
    if (!formData.collectionStaff) temp.collectionStaff = "Required";
    if (!formData.assignedAt) temp.assignedAt = "Required";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await axios.put(
        `http://43.250.40.133:5005/api/v1/cases/${caseData._id}`,
        formData,
        axiosConfig
      );
      toast.success("Inventory updated successfully.");
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error("Failed to update inventory.");
    }
  };

  return (
    <>
      <ToastContainer />
      <Drawer open={show} onClose={onClose} position="right" className="w-[90vw] max-w-[800px]">
        <DrawerHeader title="Inventory Update" />

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Name of Patient</Label>
              <TextInput name="patientName" value={formData.patientName} onChange={handleChange} />
              {errors.patientName && <p className="text-sm text-red-600">{errors.patientName}</p>}
            </div>

            <div>
              <Label>IP No.</Label>
              <TextInput name="ipNo" value={formData.ipNo} onChange={handleChange} />
              {errors.ipNo && <p className="text-sm text-red-600">{errors.ipNo}</p>}
            </div>

            <div>
              <Label>Used Product</Label>
              <Select name="usedProduct" value={formData.usedProduct} onChange={handleChange}>
                <option value="">Select</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </Select>
              {errors.usedProduct && <p className="text-sm text-red-600">{errors.usedProduct}</p>}
            </div>

            <div>
              <Label>Payment Type</Label>
              <Select name="paymentType" value={formData.paymentType} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Cash">Cash</option>
                <option value="Invoice">Invoice</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
              </Select>
              {errors.paymentType && <p className="text-sm text-red-600">{errors.paymentType}</p>}
            </div>

            {/* {(formData.paymentType === "Invoice" || formData.paymentType === "Cash") && (
              <div>
                <Label>Invoice</Label>
                <TextInput name="invoice" value={formData.invoice} onChange={handleChange} />
                {errors.invoice && <p className="text-sm text-red-600">{errors.invoice}</p>}
              </div>
            )} */}

            {formData.paymentType === "Cash" && (
              <div>
                <Label>Cash Amount</Label>
                <TextInput name="cash" type="number" value={formData.cash} onChange={handleChange} />
                {errors.cash && <p className="text-sm text-red-600">{errors.cash}</p>}
              </div>
            )}

            <div>
              <Label>collectionStaff</Label>
              <Select name="collectionStaff" value={formData.collectionStaff} onChange={handleChange}>
                <option value="">Select</option>
                {staffList.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </Select>
              {errors.collectionStaff && (
                <p className="text-sm text-red-600">{errors.collectionStaff}</p>
              )}
            </div>
             <div>
                          <Label>AssignedAt</Label>
                          <TextInput
                            name="assignedAt"
                            type="datetime-local"
                            value={formData.assignedAt}
                            onChange={handleChange}
                          />
                          {errors.assignedAt && <p className="text-sm text-red-600">{errors.assignedAt}</p>}
                        </div> 
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" color="gray" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" color="blue">
              Update Inventory
            </Button>
          </div>
        </form>
      </Drawer>
    </>
  );
}

export default InventoryUpdate;
