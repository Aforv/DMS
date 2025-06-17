import React, { useState } from "react";
import {
  Drawer,
  DrawerHeader,
  TextInput,
  Label,
  Button,
  Checkbox,
} from "flowbite-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SubmitTOHospital({ show, onClose }) {
  const hospital = {
    name: "City Hospital",
    location: "123 Main Street, Downtown",
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    remarks: "",
    clockIn: "",
    clockOut: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClockChange = (type, checked) => {
    const timestamp = checked ? new Date().toISOString() : "";
    setFormData((prev) => ({ ...prev, [type]: timestamp }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Name, Email, and Phone are required.");
      return;
    }

    const submission = {
      ...formData,
      hospital: hospital.name,
      hospitalLocation: hospital.location,
      submissionDate: new Date().toISOString(),
    };

    localStorage.setItem("hospitalContactForm", JSON.stringify(submission));
    toast.success("Contact submitted successfully!");
    onClose();
  };

  return (
    <>
      <ToastContainer />
      <Drawer
        open={show}
        onClose={onClose}
        position="right"
        className="w-[50vw] max-w-[600px]"
      >
        <DrawerHeader title="Hospital Contact Form" />
        <div className="p-6 space-y-5">
          <div>
            <Label>Destination Hospital</Label>
            <div className="text-sm font-medium">
              {hospital.name} - {hospital.location}
            </div>
          </div>

          <div className="flex gap-5">
            <Label className="flex items-center gap-2">
              <Checkbox
                checked={!!formData.clockIn}
                onChange={(e) => handleClockChange("clockIn", e.target.checked)}
              />
              Clock In
            </Label>
            <Label className="flex items-center gap-2">
              <Checkbox
                checked={!!formData.clockOut}
                onChange={(e) => handleClockChange("clockOut", e.target.checked)}
              />
              Clock Out
            </Label>
          </div>
<h2>Submitted To :</h2>
          <div>
            <Label htmlFor="name">Name</Label>
            <TextInput
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter full name"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <TextInput
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter email address"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <TextInput
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <Label htmlFor="remarks">Remarks</Label>
            <TextInput
              id="remarks"
              value={formData.remarks}
              onChange={(e) => handleInputChange("remarks", e.target.value)}
              placeholder="Any additional info..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button color="gray" onClick={onClose}>
              Cancel
            </Button>
            <Button color="blue" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  );
}

export default SubmitTOHospital;