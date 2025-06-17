import React, { useState } from "react";
import {
  Button,
  Label,
  TextInput,
  Textarea,
  Select,
  Drawer,
  DrawerHeader,
} from "flowbite-react";

const InventoryApproval = ({ show, onClose, products = [], onSubmit }) => {
  const [status, setStatus] = useState(""); // approved or hold
  const [remarks, setRemarks] = useState("");
  const [forwardTo, setForwardTo] = useState(""); // hospital or distributor
  const [locationName, setLocationName] = useState("");
  const [locationDetails, setLocationDetails] = useState("");

  const handleSubmit = () => {
    if (!status) {
      alert("Please select Approval or Hold.");
      return;
    }

    if (!remarks.trim()) {
      alert("Remarks are required.");
      return;
    }

    const data = {
      status,
      remarks,
      forwardDetails:
        status === "hold"
          ? {
              type: forwardTo,
              locationName,
              locationDetails,
            }
          : null,
    };

    onSubmit && onSubmit(data);
    onClose && onClose();
  };

  return (
    <Drawer open={show} onClose={onClose} position="right" className="w-[50vw] max-w-[600px]">
      <DrawerHeader title="Inventory Approval" />

      <div className="p-4 space-y-5">
        {/* Product List */}
        <div>
          <h3 className="font-semibold mb-2">Product List</h3>
          <ul className="list-disc ml-5">
            {products.map((p, idx) => (
              <li key={idx}>
                {p.name} — {p.quantity} pcs
              </li>
            ))}
          </ul>
        </div>

        {/* Approval Action */}
        <div>
          <Label htmlFor="status">Action</Label>
          <Select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">-- Select Action --</option>
            <option value="approved">Approve</option>
            <option value="hold">Hold</option>
          </Select>
        </div>

        {/* Remarks */}
        <div>
          <Label htmlFor="remarks">Remarks</Label>
          <Textarea
            id="remarks"
            placeholder="Add your remarks..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>

        {/* Forward Details if Hold */}
        {status === "hold" && (
          <div className="space-y-3">
            <div>
              <Label htmlFor="forwardTo">Forward To</Label>
              <Select
                id="forwardTo"
                value={forwardTo}
                onChange={(e) => setForwardTo(e.target.value)}
              >
                <option value="">-- Select Location Type --</option>
                <option value="hospital">Hospital</option>
                <option value="distributor">Distributor</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="locationName">Location Name</Label>
              <TextInput
                id="locationName"
                placeholder="e.g., Fortis Hospital"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="locationDetails">Details</Label>
              <Textarea
                id="locationDetails"
                placeholder="Enter address or details"
                value={locationDetails}
                onChange={(e) => setLocationDetails(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="pt-4 text-right">
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </div>
    </Drawer>
  );
};

export default InventoryApproval;
