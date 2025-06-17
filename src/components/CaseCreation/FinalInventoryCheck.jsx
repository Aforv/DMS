import React, { useState } from "react";
import {
  Drawer,
  DrawerHeader,
  Label,
  Select,
  Button,
  FileInput,
  TextInput,
} from "flowbite-react";

const dummyProducts = [
  {
    _id: "1",
    name: "Scalpel",
    principle: "P001",
    batchNo: "B001",
    productCode: "PC001",
    expiry: "2025-12-31",
    sentQty: 5,
    usedQty: 3,
  },
  {
    _id: "2",
    name: "Forceps",
    principle: "P002",
    batchNo: "B002",
    productCode: "PC002",
    expiry: "2026-06-15",
    sentQty: 4,
    usedQty: 4,
  },
  {
    _id: "3",
    name: "Syringe",
    principle: "P003",
    batchNo: "B003",
    productCode: "PC003",
    expiry: "2025-09-10",
    sentQty: 6,
    usedQty: 2,
  },
];

function FinalInventoryCheck({ show, onClose, onSubmit }) {
  const [isFullStack, setIsFullStack] = useState(true);
  const [images, setImages] = useState([]);
  const [unusedDetails, setUnusedDetails] = useState({});

  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleDetailChange = (id, field, value) => {
    setUnusedDetails((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSubmit = () => {
    const result = {
      isFullStack,
      unusedDetails,
      images,
    };
    onSubmit(result);
    onClose();
  };

  return (
    <Drawer open={show} onClose={onClose} position="right" className="w-[90vw] max-w-[1000px]">
      <DrawerHeader title="Final Inventory Check" />

      <div className="p-4 space-y-6">
        <div>
          <Label>Is Full Stack?</Label>
          <Select
            value={isFullStack ? "yes" : "no"}
            onChange={(e) => setIsFullStack(e.target.value === "yes")}
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </Select>
        </div>

        {/* Used Products Table */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Used Products</h3>
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Used Quantity</th>
                <th className="border p-2">Principle ID</th>
              </tr>
            </thead>
            <tbody>
              {dummyProducts
                .filter((p) => p.usedQty > 0)
                .map((p) => (
                  <tr key={p._id}>
                    <td className="border p-2">{p.name}</td>
                    <td className="border p-2">{p.usedQty}</td>
                    <td className="border p-2">{p.principle}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* sent Products Table */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Returned Products</h3>
          <table className="w-full border text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="border p-2">Principle</th>
                <th className="border p-2">Product</th>
                <th className="border p-2">Batch No</th>
                <th className="border p-2">Product Code</th>
                <th className="border p-2">Expiry Date</th>
                <th className="border p-2">sent Qty</th>
                {!isFullStack && <th className="border p-2">Missing Qty</th>}
                {!isFullStack && <th className="border p-2">Reason</th>}
                {!isFullStack && <th className="border p-2">Remarks</th>}
              </tr>
            </thead>
            <tbody>
              {dummyProducts.map((p) => {
                const sent = p.sentQty - p.usedQty;
                return (
                  <tr key={p._id}>
                    <td className="border p-2">{p.principle}</td>
                    <td className="border p-2">{p.name}</td>
                    <td className="border p-2">{p.batchNo}</td>
                    <td className="border p-2">{p.productCode}</td>
                    <td className="border p-2">{p.expiry}</td>
                    <td className="border p-2">{sent}</td>
                    {!isFullStack && (
                      <>
                        <td className="border p-2">
                          <TextInput
                            type="number"
                            min="0"
                            value={unusedDetails[p._id]?.qty || ""}
                            onChange={(e) => handleDetailChange(p._id, "qty", e.target.value)}
                          />
                        </td>
                        <td className="border p-2">
                          <Select
                            value={unusedDetails[p._id]?.reason || ""}
                            onChange={(e) => handleDetailChange(p._id, "reason", e.target.value)}
                          >
                            <option value="">Select</option>
                            <option value="missing">Missing</option>
                            <option value="damaged">Damaged</option>
                            <option value="other">Other</option>
                          </Select>
                        </td>
                        <td className="border p-2">
                          <TextInput
                            value={unusedDetails[p._id]?.remarks || ""}
                            onChange={(e) => handleDetailChange(p._id, "remarks", e.target.value)}
                          />
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!isFullStack && (
          <div>
            <Label className="mb-2">Upload Images</Label>
            <FileInput multiple onChange={handleFileChange} />
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button color="gray" onClick={onClose}>Cancel</Button>
          <Button color="blue" onClick={handleSubmit}>Submit</Button>
        </div>
      </div>
    </Drawer>
  );
}

export default FinalInventoryCheck;
