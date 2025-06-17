import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Label,
  Select,
  TextInput,
  Drawer,
  DrawerHeader,
} from "flowbite-react";
import { HiDownload, HiPrinter } from "react-icons/hi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";


const AssignSupplier = ({ show, onClose, hospitalInfo = {}, onAssign }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [deliverBefore, setDeliverBefore] = useState("");

  const contentRef = useRef();

  useEffect(() => {
    // Simulate fetching supplier list from API
    setSuppliers([
      { id: "s1", name: "Supplier One" },
      { id: "s2", name: "Supplier Two" },
      { id: "s3", name: "Supplier Three" },
    ]);
  }, []);

  const handleSubmit = () => {
    if (!selectedSupplier || !deliverBefore) {
      alert("Please select a supplier and delivery time.");
      return;
    }

    const assignment = {
      supplierId: selectedSupplier,
      deliverBefore,
    };

    if (onAssign) onAssign(assignment);
    onClose();
  };

  const handlePrint = () => {
    const printContents = contentRef.current.innerHTML;
    const win = window.open("", "", "width=900,height=700");
    win.document.write("<html><head><title>Delivery Challan</title></head><body>");
    win.document.write(printContents);
    win.document.write("</body></html>");
    win.document.close();
    win.print();
  };

  const handleDownload = async () => {
    const canvas = await html2canvas(contentRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("delivery-challan.pdf");
  };

  return (
    <Drawer open={show} onClose={onClose} position="right" className="w-[50vw] max-w-[600px]">
      <DrawerHeader title="Assign Supplier" />
      
      {/* Buttons */}
      <div className="flex justify-between items-center px-4 pt-2">
        <div className="flex gap-2">
          <Button color="gray" onClick={handlePrint}>
            <HiPrinter className="mr-2" /> Print
          </Button>
          <Button color="gray" onClick={handleDownload}>
            <HiDownload className="mr-2" /> Download DC
          </Button>
        </div>
      </div>

      {/* Form Content */}
      <div ref={contentRef} className="p-4 space-y-5">
        <div>
          <Label>Hospital Name</Label>
          <TextInput readOnly value={hospitalInfo.name || "Apollo"} />
        </div>
        <div>
          <Label>Location</Label>
          <TextInput readOnly value={hospitalInfo.location || "HSR Layout"} />
        </div>

        <div>
          <Label htmlFor="supplier">Select Supplier</Label>
          <Select
            id="supplier"
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
          >
            <option value="">-- Select Supplier --</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="deliverBefore">Deliver Before</Label>
          <TextInput
            type="datetime-local"
            id="deliverBefore"
            value={deliverBefore}
            onChange={(e) => setDeliverBefore(e.target.value)}
          />
        </div>

        <div className="pt-4 text-right">
          <Button onClick={handleSubmit}>Assign</Button>
        </div>
      </div>
    </Drawer>
  );
};

export default AssignSupplier;
