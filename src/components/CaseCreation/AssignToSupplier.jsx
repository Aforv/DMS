import React, { useState } from "react";
import {
  Drawer,
  DrawerHeader,
  Select,
  TextInput,
  Label,
  Button,
} from "flowbite-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AssignToSupplier({ show, onClose }) {
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [remarks, setRemarks] = useState("");

  const suppliers = [
    { id: 1, name: "Supplier A" },
    { id: 2, name: "Supplier B" },
    { id: 3, name: "Supplier C" },
  ];

  const handleSubmit = () => {
    if (!selectedSupplier) {
      toast.error("Please select a supplier.");
      return;
    }

    const formData = {
      supplier: selectedSupplier,
      remarks,
      supplierAssignmentDate: new Date().toISOString(),
    };

    localStorage.setItem("assignedSupplier", JSON.stringify(formData));
    toast.success("Supplier assigned successfully!");
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
        <DrawerHeader title="Assign Supplier" />
        <div className="p-6 space-y-6">
          <div>
            <Label htmlFor="supplier">Select Supplier</Label>
            <Select
              id="supplier"
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
            >
              <option value="">-- Select Supplier --</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.name}>
                  {supplier.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="remarks">Remarks</Label>
            <TextInput
              id="remarks"
              placeholder="Enter remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
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

export default AssignToSupplier;