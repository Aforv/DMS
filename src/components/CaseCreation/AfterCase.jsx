// AfterCase.jsx
import React, { useEffect, useState } from "react";
import RoleTimeline from "./RoleTimeline"
import {
  Button,
  Label,
  TextInput,
  Select,
  Drawer,
  DrawerHeader,
} from "flowbite-react";
import { toast } from "react-toastify";

function AfterCase({ onClose, show, onSuccess, editData = null }) {
  const [formData, setFormData] = useState({
    caseNumber: "",
    patientName: "",
    ipNo: "",
    patientAge: "",
    surgeryDate: "",
    products: [],
    transportMode: "collect",
    supplierName: "",
    collectBefore: "",
    finalInventory: [],
  });

  const [dropdowns, setDropdowns] = useState({ products: [] });
  const [showInventoryPreview, setShowInventoryPreview] = useState(false);
  const [showUsedModal, setShowUsedModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const dummyDropdowns = {
    products: [
      {
        _id: "prod1",
        name: "Surgical Gloves",
        qty: 10,
        principle: "OrthoTech",
        batchNo: "B1234",
        code: "SG-001",
        expiryDate: "2025-12-31",
      },
      {
        _id: "prod2",
        name: "Scalpel",
        qty: 5,
        principle: "SurgiCore",
        batchNo: "B5678",
        code: "SC-002",
        expiryDate: "2026-01-15",
      },
      {
        _id: "prod3",
        name: "Bandage Roll",
        qty: 8,
        principle: "MediWrap",
        batchNo: "B9123",
        code: "BR-003",
        expiryDate: "2025-08-20",
      },
    ],
  };

  useEffect(() => {
    if (show) {
      setDropdowns(dummyDropdowns);
      if (editData) {
        setFormData({ ...editData });
      }
    }
  }, [show, editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (productId, checked, usedCount = 1) => {
    setFormData((prev) => {
      let updated = [...prev.products];
      const selectedProduct = dropdowns.products.find((p) => p._id === productId);
      if (!selectedProduct) return prev;

      const safeUsedCount = Math.min(selectedProduct.qty, Math.max(0, usedCount || 0));
      const existingIndex = updated.findIndex((p) => p.productId === productId);

      const newProduct = {
        productId,
        name: selectedProduct.name,
        sentCount: selectedProduct.qty,
        usedCount: safeUsedCount,
        principle: selectedProduct.principle,
        batchNo: selectedProduct.batchNo,
        code: selectedProduct.code,
        expiryDate: selectedProduct.expiryDate,
      };

      if (checked) {
        if (existingIndex > -1) updated[existingIndex] = newProduct;
        else updated.push(newProduct);
      } else {
        updated = updated.filter((p) => p.productId !== productId);
      }

      return { ...prev, products: updated };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    toast.success("Case saved successfully!");
    onSuccess?.();
    onClose();
  };

  const getRemainingQty = (product) => {
    const selected = formData.products.find(p => p.productId === product._id);
    return selected ? product.qty - selected.usedCount : product.qty;
  };

  const historyData = {
    lead: "John Lead",
    hospital: "Apollo",
    doctor: "Dr. A Kumar",
    principle: "OrthoTech",
    category: "Surgical",
    subcategory: "Consumables",
    products: dummyDropdowns.products,
  };

  return (
   <Drawer open={show} onClose={onClose} position="right" className={` transition-all duration-300   border-roverflow-y-auto h-full ${
            showSidebar ? "w-[80vw] max-w-[1300px] " : "w-[90vw] max-w-[1100px]"
          }`}>
      <DrawerHeader title="After Case Details" />
      <div className="relative flex h-full">
        {/* Sidebar */}
        <div
          className={`transition-all duration-300 bg-gray-100 border-roverflow-y-auto h-full ${
            showSidebar ? "w-90  p-4 " : "w-0 overflow-hidden"
          }`}
        >
          <div className="text-sm font-medium mb-2">History</div>
          <div className="space-y-1 text-xs">
            <div><b>Lead:</b> {historyData.lead}</div>
            <div><b>Hospital:</b> {historyData.hospital}</div>
            <div><b>Doctor:</b> {historyData.doctor}</div>
            <div><b>Principle:</b> {historyData.principle}</div>
            <div><b>Category:</b> {historyData.category}</div>
            <div><b>Subcategory:</b> {historyData.subcategory}</div>
          </div>
          <div className="mt-4">
            <div className="text-sm font-semibold mb-1">Products Sent</div>
            <ul className="text-xs list-disc ml-4">
              {historyData.products.map((p) => (
                <li key={p._id}>{p.name} - {p.qty}</li>
              ))}
            </ul>
          </div>
          <RoleTimeline />
        </div>

        {/* Main Form */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex justify-end px-4 pt-2">
            <Button size="xs" color="gray" onClick={() => setShowSidebar((prev) => !prev)}>
              {showSidebar ? "Hide History" : "View History"}
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="p-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "caseNumber",
                "patientName",
                "ipNo",
                "patientAge",
              ].map((name) => (
                <div key={name}>
                  <Label>{name.replace(/([A-Z])/g, " $1")}</Label>
                  <TextInput name={name} value={formData[name]} onChange={handleChange} />
                </div>
              ))}
              <div>
                <Label>Actual Surgery Date</Label>
                <TextInput
                  type="datetime-local"
                  name="surgeryDate"
                  value={formData.surgeryDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="overflow-auto border rounded-md">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-2 py-2">Product</th>
                    <th className="px-2 py-2">Sent Qty</th>
                    <th className="px-2 py-2">Used Qty</th>
                    <th className="px-2 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dropdowns.products.map((product) => {
                    const existing = formData.products.find(
                      (p) => p.productId === product._id
                    );
                    return (
                      <tr key={product._id} className="bg-white border-b">
                        <td className="px-2 py-2">{product.name}</td>
                        <td className="px-2 py-2">{product.qty}</td>
                        <td className="px-2 py-2">
                          <TextInput
                            type="number"
                            min="0"
                            max={product.qty}
                            value={existing?.usedCount || ""}
                            onChange={(e) => {
                              const inputVal = parseInt(e.target.value || "0", 10);
                              const safeVal = Math.min(
                                product.qty,
                                Math.max(0, isNaN(inputVal) ? 0 : inputVal)
                              );
                              handleProductChange(product._id, true, safeVal);
                            }}
                            disabled={!existing}
                            className="w-24"
                          />
                        </td>
                        <td className="px-2 py-2">
                          {existing ? (
                            <Button
                              size="xs"
                              color="failure"
                              onClick={() => handleProductChange(product._id, false)}
                            >
                              Remove
                            </Button>
                          ) : (
                            <Button
                              size="xs"
                              onClick={() => handleProductChange(product._id, true, 1)}
                            >
                              Select
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between mt-4">
              <Button onClick={() => setShowInventoryPreview(true)}>
                Preview Final Inventory
              </Button>
              <Button color="light" onClick={() => setShowUsedModal(true)}>
                View Used Products
              </Button>
            </div>

            {showInventoryPreview && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-4 w-full max-w-4xl shadow-md overflow-auto max-h-[90vh]">
                  <h3 className="text-lg font-semibold mb-3">
                    Final Inventory - Products To Be Returned
                  </h3>
                  <table className="w-full text-sm text-left text-gray-600">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-2 py-2">Product</th>
                        <th className="px-2 py-2">Batch No</th>
                        <th className="px-2 py-2">Expiry Date</th>
                        <th className="px-2 py-2">Quantity to Return</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dropdowns.products.map((product) => (
                        <tr key={product._id} className="bg-white border-b">
                          <td className="px-2 py-2">{product.name}</td>
                          <td className="px-2 py-2">{product.batchNo}</td>
                          <td className="px-2 py-2">{product.expiryDate}</td>
                          <td className="px-2 py-2">{getRemainingQty(product)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex justify-end mt-4">
                    <Button size="sm" onClick={() => setShowInventoryPreview(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            )}


            <div className="flex justify-end gap-2">
              <Button type="button" color="gray" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </div>
      </div>

      {showUsedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-md shadow-md">
            <h3 className="text-lg font-semibold mb-2">Used Products</h3>
            <ul className="list-disc ml-5 space-y-1 text-sm">
              {formData.products.map((p) => (
                <li key={p.productId}>
                  {p.name} - Sent: {p.sentCount}, Used: {p.usedCount}
                </li>
              ))}
            </ul>
            <div className="flex justify-end mt-4">
              <Button size="sm" onClick={() => setShowUsedModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
}

export default AfterCase;
