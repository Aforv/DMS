import React, { useState } from "react";
import {
  Drawer,
  DrawerHeader,
  TextInput,
  Label,
  Button,
  Checkbox
} from "flowbite-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CollectorForm({ show, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    remarks: "",
    collectedBy: "",
  });
  const handleClockChange = (type, checked) => {
    const timestamp = checked ? new Date().toISOString() : "";
    setFormData((prev) => ({ ...prev, [type]: timestamp }));
  };
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    const { name, email, phone, collectedBy } = formData;

    if (!name || !email || !phone || !collectedBy) {
      toast.error("Please fill all required fields.");
      return;
    }

    const submission = {
      ...formData,
      collectedDate: new Date().toISOString(),
    };

    localStorage.setItem("collectorFormData", JSON.stringify(submission));
    toast.success("Collection data submitted!");
    onClose();
  };

  return (
    <>
      <ToastContainer />
      <Drawer open={show} onClose={onClose} position="right" className="w-[50vw] max-w-[600px]">
        <DrawerHeader title="Collector Form" />
        <div className="p-6 space-y-5">
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
                 
           <div className="py-3 space-y-5">
              <Label  >Collected from: </Label>
           </div>
        
          <div>
            <Label htmlFor="name">Name</Label>
            <TextInput
              id="name"
              placeholder="Enter name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <TextInput
              id="email"
              type="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <TextInput
              id="phone"
              type="tel"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="remarks">Remarks</Label>
            <TextInput
              id="remarks"
              placeholder="Enter any remarks"
              value={formData.remarks}
              onChange={(e) => handleChange("remarks", e.target.value)}
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

export default CollectorForm;