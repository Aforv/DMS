import React, { useState, useEffect } from "react";
import {
  Button,
  Label,
  TextInput,
  Checkbox,
  Drawer,
  DrawerHeader,
  FileInput,
} from "flowbite-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DeliveryPersonForm({ onClose, show, onSuccess, deliveryData = null }) {
  const [formData, setFormData] = useState({
    DeliveryStart: false,
    checkedInDateTime: "",
    DeliveredTo: "",
    productImages: [],
    DeliveryEnd: false,
    deliveredDateTime: "",
    deliveredTo: "",
    otPersonPresent: false,
    otPersonName: "",
    receiverName: "",
    receiverEmail: "",
    receiverPhone: "",
    dcDocument: [],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const deliveryPersonName = localStorage.getItem("userName") || "Apollo-HSR Layout";

  useEffect(() => {
    if (show) {
      if (deliveryData) {
        setFormData({
          DeliveryStart: deliveryData.DeliveryStart || false,
          checkedInDateTime: deliveryData.checkedInDateTime || "",
          DeliveredTo: deliveryData.DeliveredTo || "",
          productImages: deliveryData.productImages || [],
          DeliveryEnd: deliveryData.DeliveryEnd || false,
          deliveredDateTime: deliveryData.deliveredDateTime || "",
          deliveredTo: deliveryData.deliveredTo || "",
          otPersonPresent: deliveryData.otPersonPresent || false,
          otPersonName: deliveryData.otPersonName || "",
          receiverName: deliveryData.receiverName || "",
          receiverEmail: deliveryData.receiverEmail || "",
          receiverPhone: deliveryData.receiverPhone || "",
          dcDocument: deliveryData.dcDocument ? [deliveryData.dcDocument] : [],
        });
      } else {
        setFormData({
          DeliveryStart: false,
          checkedInDateTime: "",
          DeliveredTo: "",
          productImages: [],
          DeliveryEnd: false,
          deliveredDateTime: "",
          deliveredTo: "",
          otPersonPresent: false,
          otPersonName: "",
          receiverName: "",
          receiverEmail: "",
          receiverPhone: "",
          dcDocument: [],
        });
      }
    }
  }, [show, deliveryData]);

  const handleDeliveryStart = () => {
    const now = new Date().toISOString().slice(0, 16); // Format for datetime-local
    setFormData((prev) => ({
      ...prev,
      DeliveryStart: true,
      checkedInDateTime: now,
      DeliveredTo: deliveryPersonName,
    }));
  };

  const handleDeliveryEnd = () => {
    const now = new Date().toISOString().slice(0, 16);
    setFormData((prev) => ({
      ...prev,
      DeliveryEnd: true,
      deliveredDateTime: now,
      deliveredTo: deliveryPersonName,
    }));
  };

  const validate = () => {
    const temp = {};
    if (!formData.DeliveryStart || !formData.checkedInDateTime || !formData.DeliveredTo)
      temp.DeliveryStart = "Check-In is required.";
    if (!formData.productImages.length) temp.productImages = "At least one image is required.";
    if (formData.DeliveryEnd) {
      if (!formData.deliveredDateTime) temp.deliveredDateTime = "Delivered date & time missing.";
      if (!formData.deliveredTo) temp.deliveredTo = "Delivered To name missing.";
      if (!formData.otPersonPresent) {
        if (!formData.receiverName) temp.receiverName = "Receiver Name is required.";
        if (!formData.receiverEmail) temp.receiverEmail = "Receiver Email is required.";
        if (!formData.receiverPhone) temp.receiverPhone = "Receiver Phone is required.";
      } else {
        if (!formData.otPersonName) temp.otPersonName = "OT Person Name is required.";
      }
      if (!formData.dcDocument.length) temp.dcDocument = "At least one DC Document is required.";
    }
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    const payload = { ...formData };
    try {
      if (deliveryData && deliveryData._id) {
        await axios.put(`http://43.250.40.133:5005/api/v1/deliveries/${deliveryData._id}`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        toast.success("Delivery updated successfully.");
      } else {
        await axios.post("http://43.250.40.133:5005/api/v1/deliveries", payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        toast.success("Delivery submitted successfully.");
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error("Failed to submit delivery info.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      productImages: [...prev.productImages, ...files],
    }));
  };

  const handleDcDocumentChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file =>
      file.type === "application/pdf" || file.type.includes("image")
    );
    if (validFiles.length > 0) {
      setFormData((prev) => ({ ...prev, dcDocument: [...prev.dcDocument, ...validFiles] }));
    } else {
      toast.error("Only PDF or image files are allowed.");
    }
  };

  const removeImage = (index, type = "product") => {
    setFormData((prev) => {
      if (type === "product") {
        const newImages = [...prev.productImages];
        newImages.splice(index, 1);
        return { ...prev, productImages: newImages };
      } else if (type === "dcDocument") {
        const newFiles = [...prev.dcDocument];
        newFiles.splice(index, 1);
        return { ...prev, dcDocument: newFiles };
      }
      return prev;
    });
  };

  return (
    <>
      <ToastContainer />
      <Drawer open={show} onClose={onClose} position="right" className="w-[90vw] max-w-[800px]">
        <DrawerHeader title={deliveryData ? "Edit Delivery Info" : "Add Delivery Info"} />
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Check In Section */}
          <div className="flex items-center gap-2">
            <Checkbox name="DeliveryStart" checked={formData.DeliveryStart} onChange={handleDeliveryStart} />
            <Label>Delivery-Start</Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Delivery-Start Date & Time</Label>
              <TextInput
                name="checkedInDateTime"
                type="datetime-local"
                value={formData.checkedInDateTime}
                readOnly
              />
            </div>
            <div>
              <Label>Delivered-To(Hospital Location)</Label>
              <TextInput name="DeliveredTo" value={formData.DeliveredTo} readOnly />
            </div>
          </div>

          {/* Upload Product Images */}
          <div>
            <Label>Upload Product Images</Label>
            <FileInput
              multiple
              accept="image/*"
              onChange={handleFileChange}
              disabled={isSubmitting}
            />
            {errors.productImages && (
              <p className="text-sm text-red-600">{errors.productImages}</p>
            )}
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.productImages.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${index}`}
                    className="h-16 w-16 object-cover rounded"
                  />
                  {!isSubmitting && (
                    <button
                      type="button"
                      onClick={() => removeImage(index, "product")}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Delivery Info Button */}
          <Button color="blue" type="submit" disabled={!formData.DeliveryStart || isSubmitting}>
            Submit Delivery Info
          </Button>

          {/* Check Out Section */}
          <div className="flex items-center gap-2 mt-4">
            <Checkbox name="DeliveryEnd" checked={formData.DeliveryEnd} onChange={handleDeliveryEnd} />
            <Label>Delivery-End</Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Delivered Date & Time</Label>
              <TextInput
                name="deliveredDateTime"
                type="datetime-local"
                value={formData.deliveredDateTime}
                readOnly
              />
              {errors.deliveredDateTime && (
                <p className="text-sm text-red-600">{errors.deliveredDateTime}</p>
              )}
            </div>
          </div>

          {/* OT Person Present */}
          <div className="flex items-center gap-2">
            <Checkbox
              name="otPersonPresent"
              checked={formData.otPersonPresent}
              onChange={handleChange}
            />
            <Label>OT Person Present</Label>
          </div>

          {/* Receiver Details */}
          { (
            <div className="space-y-4 border p-4 rounded-md">
              <div>
                <Label>Receiver Name</Label>
                <TextInput
                  name="receiverName"
                  value={formData.receiverName}
                  onChange={handleChange}
                />
                {errors.receiverName && (
                  <p className="text-sm text-red-600">{errors.receiverName}</p>
                )}
              </div>
              <div>
                <Label>Receiver Email</Label>
                <TextInput
                  name="receiverEmail"
                  type="email"
                  value={formData.receiverEmail}
                  onChange={handleChange}
                />
                {errors.receiverEmail && (
                  <p className="text-sm text-red-600">{errors.receiverEmail}</p>
                )}
              </div>
              <div>
                <Label>Receiver Phone</Label>
                <TextInput
                  name="receiverPhone"
                  type="tel"
                  value={formData.receiverPhone}
                  onChange={handleChange}
                />
                {errors.receiverPhone && (
                  <p className="text-sm text-red-600">{errors.receiverPhone}</p>
                )}
              </div>
            </div>
          )}

          {/* Upload DC Document */}
          <div>
            <Label>Upload DC (Stamped & Signed)</Label>
            <FileInput
              accept="image/*"
              onChange={handleDcDocumentChange}
              disabled={isSubmitting}
              multiple
            />
            {errors.dcDocument && (
              <p className="text-sm text-red-600">{errors.dcDocument}</p>
            )}
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.dcDocument.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-dc-${index}`}
                    className="h-16 w-16 object-cover rounded"
                  />
                  {!isSubmitting && (
                    <button
                      type="button"
                      onClick={() => removeImage(index, "dcDocument")}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Final Submit Button */}
          <div className="flex justify-end">
            <Button color="success" type="submit" disabled={isSubmitting}>
              Final Submit
            </Button>
          </div>
        </form>
      </Drawer>
    </>
  );
}

export default DeliveryPersonForm;