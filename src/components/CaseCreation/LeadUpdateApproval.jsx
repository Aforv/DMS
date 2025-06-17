import React, { useEffect, useState } from "react";
import {
  Button,
  Label,
  TextInput,
  Textarea,
  Drawer,
  DrawerHeader,
} from "flowbite-react";
import { toast } from "react-toastify";
import { HiTrash } from "react-icons/hi";

const LeadUpdateApproval = ({ editData, onClose, onSuccess }) => {
  const [requiredProducts, setRequiredProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [approvalMode, setApprovalMode] = useState("");
  const [approvalRemarks, setApprovalRemarks] = useState("");
  const [searchText, setSearchText] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedAddType, setSelectedAddType] = useState(""); // Dropdown state
  const [showDropdown, setShowDropdown] = useState(false); // Show dropdown only in pending

  // Tool/Tray States
  const [newToolName, setNewToolName] = useState("");
  const [newToolQty, setNewToolQty] = useState(1);
  const [newTrayName, setNewTrayName] = useState("");
  const [newTrayQty, setNewTrayQty] = useState(1);
  const [toolTrays, setToolTrays] = useState([]);
  const [newToolTrays, setNewToolTrays] = useState([]);

  const productList = [
    { name: "Ortho Screw 35mm", arranged: 10, principle: "OrthoTech", batchNo: "B1234", code: "OT-001" },
    { name: "Surgical Implant Kit A", arranged: 5, principle: "SurgiCore", batchNo: "S5678", code: "SC-002" },
    { name: "Bone Plate 12H", arranged: 8, principle: "MedFix", batchNo: "BPL-223", code: "MF-003" },
    { name: "K-Wire 2.5mm", arranged: 15, principle: "PinTech", batchNo: "KW-299", code: "PT-004" },
    { name: "Cortical Screw 4.5mm", arranged: 12, principle: "BonePro", batchNo: "CS-876", code: "BP-005" },
    { name: "Cannulated Screw", arranged: 6, principle: "IntraSurg", batchNo: "CN-554", code: "IS-006" },
    { name: "External Fixator", arranged: 9, principle: "FixMech", batchNo: "EF-912", code: "FM-007" },
    { name: "Spinal Rod 300mm", arranged: 3, principle: "SpineTech", batchNo: "SR-021", code: "ST-008" },
    { name: "Locking Plate 5H", arranged: 7, principle: "PlateCo", batchNo: "LP-734", code: "PC-009" },
    { name: "Femoral Nail", arranged: 4, principle: "OrthoMax", batchNo: "FN-102", code: "OM-010" },
    { name: "Proximal Humerus Plate", arranged: 6, principle: "HumeTech", batchNo: "PHP-980", code: "HT-011" },
    { name: "Pelvic Clamp", arranged: 2, principle: "PelviFix", batchNo: "PC-445", code: "PF-012" },
    { name: "Suture Anchor", arranged: 11, principle: "AnchorMed", batchNo: "SA-876", code: "AM-013" },
    { name: "Tibial Plate 8H", arranged: 5, principle: "KneeCare", batchNo: "TP-110", code: "KC-014" },
    { name: "LCP Dorsal Plate", arranged: 3, principle: "BoneAlign", batchNo: "LDP-645", code: "BA-015" },
  ];

  const toolTrayList = [
    { toolName: "Drill Set", toolQty: 10, trayName: "Standard Surgical Tray", trayQty: 5 },
    { toolName: "Wire Cutter", toolQty: 9, trayName: "Implant Insertion Tool", trayQty: 8 },
  ];

  useEffect(() => {
    setToolTrays(
      toolTrayList.map((t) => ({
        ...t,
        adjustedToolQty: t.toolQty,
        adjustedTrayQty: t.trayQty,
      }))
    );
  }, []);

  // Handlers
  const handleToolQtyChange = (index, delta) => {
    setToolTrays((prev) =>
      prev.map((tt, i) =>
        i === index ? { ...tt, adjustedToolQty: Math.max(0, tt.adjustedToolQty + delta) } : tt
      )
    );
  };

  const handleTrayQtyChange = (index, delta) => {
    setToolTrays((prev) =>
      prev.map((tt, i) =>
        i === index ? { ...tt, adjustedTrayQty: Math.max(0, tt.adjustedTrayQty + delta) } : tt
      )
    );
  };

  const handleQtyChange = (index, value, list, setList) => {
    const parsed = Math.max(0, parseInt(value || 0));
    setList((prev) => {
      const updated = [...prev];
      const arranged = updated[index]?.arranged || 0;
      updated[index].qty = Math.min(parsed, arranged);
      return updated;
    });
  };

  const adjustNewToolQty = (index, delta, type) => {
    setNewToolTrays((prev) =>
      prev.map((tt, i) =>
        i === index
          ? {
              ...tt,
              [`adjusted${type.charAt(0).toUpperCase() + type.slice(1)}Qty`]: Math.max(
                0,
                tt[`adjusted${type.charAt(0).toUpperCase() + type.slice(1)}Qty`] + delta
              ),
            }
          : tt
      )
    );
  };

  const removeNewTool = (index) => {
    setNewToolTrays((prev) => prev.filter((_, i) => i !== index));
  };

  const handleApproveSubmit = () => {
    const allProducts = [...requiredProducts, ...newProducts];
    console.log("Submitted for approval:", {
      remarks: approvalRemarks,
      approvedProducts: allProducts,
      toolTrays: [...toolTrays, ...newToolTrays],
    });
    toast.success("Case approved successfully");
    onSuccess?.();
    onClose();
  };

  const handleDeleteProduct = (indexToDelete) => {
    setNewProducts((prev) => prev.filter((_, i) => i !== indexToDelete));
  };

  const handleAddNewTool = () => {
    if (!newToolName.trim()) {
      toast.error("Please enter a valid Tool name.");
      return;
    }
    const newTool = {
      toolName: newToolName,
      toolQty: parseInt(newToolQty),
      adjustedToolQty: parseInt(newToolQty),
    };
    setNewToolTrays((prev) => [...prev, newTool]);
    setNewToolName("");
    setNewToolQty(1);
    toast.success("Tool added to pending list!");
  };

  const handleAddNewTray = () => {
    if (!newTrayName.trim()) {
      toast.error("Please enter a valid Tray name.");
      return;
    }
    const newTray = {
      trayName: newTrayName,
      trayQty: parseInt(newTrayQty),
      adjustedTrayQty: parseInt(newTrayQty),
    };
    setNewToolTrays((prev) => [...prev, newTray]);
    setNewTrayName("");
    setNewTrayQty(1);
    toast.success("Tray added to pending list!");
  };

  // Editable Products Setup
  const [editableProducts, setEditableProducts] = useState([]);
  useEffect(() => {
    const mergedList = [...productList].map((p) => ({
      ...p,
      adjustedQty: p.arranged || 0,
    }));
    setEditableProducts(mergedList);
  }, [productList]);

  useEffect(() => {
    if (editData) {
      setRequiredProducts(editData.requiredProducts || []);
    } else {
      setRequiredProducts([
        {
          name: "Ortho Screw 35mm",
          qty: 2,
          arranged: 10,
          principle: "OrthoTech",
          batchNo: "B1234",
          code: "OT-001",
        },
        {
          name: "Bone Plate 12H",
          qty: 1,
          arranged: 8,
          principle: "MedFix",
          batchNo: "BPL-223",
          code: "MF-003",
        },
      ]);
    }
  }, [editData]);

  const handleQtyChange1 = (index, delta) => {
    setEditableProducts((prev) =>
      prev.map((prod, idx) =>
        idx === index
          ? { ...prod, adjustedQty: Math.max(0, (prod.adjustedQty || 0) + delta) }
          : prod
      )
    );
  };

  return (
    <Drawer open={true} onClose={onClose} position="right" className="w-[90vw] max-w-[900px]">
      <DrawerHeader title="Lead Update Approval" />
      <div className="p-4 space-y-4">
        {/* Products List */}
        <div>
          <Label>Products List</Label>
          <div className="overflow-auto border rounded-md">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Principle</th>
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2">Batch No</th>
                  <th className="px-4 py-2">Available Qty</th>
                  {approvalMode === "pending" && <th className="px-4 py-2">Adjust Qty</th>}
                </tr>
              </thead>
              <tbody>
                {editableProducts.map((product, index) => (
                  <tr key={index} className="bg-white border-b">
                    <td className="px-4 py-2">{product.principle}</td>
                    <td className="px-4 py-2">{product.name} ({product.code})</td>
                    <td className="px-4 py-2">{product.batchNo}</td>
                    <td className="px-4 py-2">{product.arranged}</td>
                    {approvalMode === "pending" && (
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <Button size="xs" onClick={() => handleQtyChange1(index, -1)}>-</Button>
                          <span>{product.adjustedQty}</span>
                          <Button size="xs" onClick={() => handleQtyChange1(index, 1)}>+</Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tools & Trays Table */}
        <div>
          <Label>Tools & Trays List</Label>
          <div className="overflow-auto border rounded-md">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Tool Name</th>
                  <th className="px-4 py-2">Tool Qty</th>
                  <th className="px-4 py-2">Adjust Tool Qty</th>
                  <th className="px-4 py-2">Tray Name</th>
                  <th className="px-4 py-2">Tray Qty</th>
                  <th className="px-4 py-2">Adjust Tray Qty</th>
                </tr>
              </thead>
              <tbody>
                {toolTrays.map((tt, index) => (
                  <tr key={index} className="bg-white border-b">
                    <td className="px-4 py-2">{tt.toolName}</td>
                    <td className="px-4 py-2">{tt.toolQty}</td>
                    <td className="px-4 py-2">
                      {approvalMode === "pending" ? (
                        <div className="flex items-center gap-2">
                          <Button size="xs" onClick={() => handleToolQtyChange(index, -1)}>-</Button>
                          <span>{tt.adjustedToolQty}</span>
                          <Button size="xs" onClick={() => handleToolQtyChange(index, 1)}>+</Button>
                        </div>
                      ) : (
                        <span className="text-gray-600">--</span>
                      )}
                    </td>
                    <td className="px-4 py-2">{tt.trayName}</td>
                    <td className="px-4 py-2">{tt.trayQty}</td>
                    <td className="px-4 py-2">
                      {approvalMode === "pending" ? (
                        <div className="flex items-center gap-2">
                          <Button size="xs" onClick={() => handleTrayQtyChange(index, -1)}>-</Button>
                          <span>{tt.adjustedTrayQty}</span>
                          <Button size="xs" onClick={() => handleTrayQtyChange(index, 1)}>+</Button>
                        </div>
                      ) : (
                        <span className="text-gray-600">--</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Approval Buttons */}
        <div className="flex gap-2">
          <Button color="success" onClick={() => setApprovalMode("approve")}>
            Approve
          </Button>
          <Button
            color="warning"
            onClick={() => {
              setApprovalMode("pending");
              setShowDropdown(true);
            }}
          >
            Pending
          </Button>
        </div>

        {/* Conditional Dropdown & Form Rendering */}
        {approvalMode === "pending" && showDropdown && (
          <>
            {/* Dropdown Selection for Add Type */}
            <div className="mt-4">
              <Label htmlFor="addType">Select Item to Add</Label>
              <select
                id="addType"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => {
                  const type = e.target.value;
                  setSelectedAddType(type);
                }}
                defaultValue=""
              >
                <option value="">-- Select --</option>
                <option value="product">Product</option>
                <option value="tool">Tool</option>
                <option value="tray">Tray</option>
              </select>
            </div>

            {/* Product Search Form */}
            {selectedAddType === "product" && (
              <div className="space-y-2 mt-2">
                <TextInput
                  placeholder="Search product name or principle"
                  value={searchText}
                  onChange={(e) => {
                    const val = e.target.value.toLowerCase();
                    setSearchText(val);
                    const matches = productList.filter(
                      (p) =>
                        p.name.toLowerCase().includes(val) ||
                        (p.principle?.toLowerCase() || "").includes(val)
                    );
                    setFilteredProducts(matches);
                  }}
                />
                <div className="max-h-64 overflow-auto border rounded-md p-2">
                  {filteredProducts.map((product, i) => {
                    const alreadyAdded =
                      requiredProducts.some((p) => p.name === product.name) ||
                      newProducts.some((p) => p.name === product.name);
                    return (
                      <div key={i} className="flex justify-between items-center border-b py-1">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.principle}</p>
                        </div>
                        {!alreadyAdded ? (
                          <Button
                            size="xs"
                            onClick={() =>
                              setNewProducts((prev) => [
                                ...prev,
                                {
                                  name: product.name,
                                  qty: 1,
                                  arranged: product.arranged,
                                  principle: product.principle,
                                  batchNo: product.batchNo,
                                  code: product.code,
                                },
                              ])
                            }
                          >
                            Add
                          </Button>
                        ) : (
                          <span className="text-green-600 text-sm">Added</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tool Input Form */}
            {selectedAddType === "tool" && (
              <div className="space-y-2 mt-2 border p-4 rounded-md bg-gray-50">
                <h3 className="font-semibold text-sm">Add New Tool</h3>
                <TextInput
                  placeholder="Tool Name"
                  value={newToolName}
                  onChange={(e) => setNewToolName(e.target.value)}
                />
                <TextInput
                  type="number"
                  min={1}
                  placeholder="Quantity"
                  value={newToolQty}
                  onChange={(e) =>
                    setNewToolQty(Math.max(1, parseInt(e.target.value) || 1))
                  }
                />
                <Button color="indigo" size="sm" onClick={handleAddNewTool}>
                  Add Tool
                </Button>
              </div>
            )}

            {/* Tray Input Form */}
            {selectedAddType === "tray" && (
              <div className="space-y-2 mt-2 border p-4 rounded-md bg-gray-50">
                <h3 className="font-semibold text-sm">Add New Tray</h3>
                <TextInput
                  placeholder="Tray Name"
                  value={newTrayName}
                  onChange={(e) => setNewTrayName(e.target.value)}
                />
                <TextInput
                  type="number"
                  min={1}
                  placeholder="Quantity"
                  value={newTrayQty}
                  onChange={(e) =>
                    setNewTrayQty(Math.max(1, parseInt(e.target.value) || 1))
                  }
                />
                <Button color="indigo" size="sm" onClick={handleAddNewTray}>
                  Add Tray
                </Button>
              </div>
            )}

            {/* Newly Added Tools & Trays Table */}
            {newToolTrays.length > 0 && (
              <div className="mt-4 overflow-auto border rounded-md">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-blue-100">
                    <tr>
                      <th className="px-4 py-2">Item Name</th>
                      <th className="px-4 py-2">Quantity</th>
                      <th className="px-4 py-2">Adjust Qty</th>
                      <th className="px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newToolTrays.map((item, index) => (
                      <tr key={index} className="bg-white border-b">
                        <td className="px-4 py-2">{item.toolName || item.trayName}</td>
                        <td className="px-4 py-2">{item.toolQty || item.trayQty}</td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            <Button size="xs" onClick={() => adjustNewToolQty(index, -1, item.toolName ? 'tool' : 'tray')}>-</Button>
                            <span>{item.adjustedToolQty || item.adjustedTrayQty}</span>
                            <Button size="xs" onClick={() => adjustNewToolQty(index, 1, item.toolName ? 'tool' : 'tray')}>+</Button>
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => removeNewTool(index)}
                            className="text-red-500 hover:text-red-700"
                            title="Delete Item"
                          >
                            <HiTrash className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Newly Added Products */}
            {newProducts.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Newly Added Products</h3>
                <div className="overflow-auto border rounded-md mt-2">
                  <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-blue-100">
                      <tr>
                        <th className="px-4 py-2">Principle</th>
                        <th className="px-4 py-2">Product</th>
                        <th className="px-4 py-2">Batch No</th>
                        <th className="px-4 py-2">Available Qty</th>
                        <th className="px-4 py-2">Required Qty</th>
                        <th className="px-4 py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newProducts.map((product, index) => (
                        <tr key={index} className="bg-white border-b">
                          <td className="px-4 py-2">{product.principle}</td>
                          <td className="px-4 py-2">{product.name} ({product.code})</td>
                          <td className="px-4 py-2">{product.batchNo}</td>
                          <td className="px-4 py-2">{product.arranged}</td>
                          <td className="px-4 py-2">
                            <TextInput
                              type="number"
                              min={0}
                              value={product.qty || ""}
                              onFocus={(e) => e.target.select()}
                              onChange={(e) => handleQtyChange(index, e.target.value, newProducts, setNewProducts)}
                            />
                          </td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() => handleDeleteProduct(index)}
                              className="text-red-500 hover:text-red-700"
                              title="Delete Product"
                            >
                              <HiTrash className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Remarks & Submit */}
        <div className="mt-4">
          <Label>Remarks</Label>
          <Textarea rows={3} value={approvalRemarks} onChange={(e) => setApprovalRemarks(e.target.value)} />
          <Button className="mt-2" color="blue" onClick={handleApproveSubmit}>
            Submit
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default LeadUpdateApproval;