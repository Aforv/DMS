import React, { useState, useEffect } from "react";
import {
  Drawer,
  DrawerHeader,
  Label,
  Select,
  TextInput,
  Checkbox,
  Textarea,
  Button,
} from "flowbite-react";

const TransportDetails = ({ show, onClose }) => {
  const [fullReturn, setFullReturn] = useState(true);
  const [dispatchTo, setDispatchTo] = useState("");
  const [locationDetails, setLocationDetails] = useState({
    name: "",
    location: "",
  });
  const [supplierName, setSupplierName] = useState("");
  const [collectBefore, setCollectBefore] = useState("");
  const [remarks, setRemarks] = useState("");

  const [productList, setProductList] = useState([]);
  const [instrumentList, setInstrumentList] = useState([]);

  useEffect(() => {
    if (show) {
      setSupplierName("John Logistics");
      setCollectBefore("2025-06-20T10:00");

      setProductList([
        {
          id: 1,
          name: "Surgical Gloves",
          principle: "ABC Corp",
          category: "Consumable",
          batchNo: "B001",
          expiry: "2025-12-31",
          sentQty: 100,
          usedQty: 60,
          adjustQty: 40,
        },
        {
          id: 2,
          name: "IV Set",
          principle: "XYZ Pharma",
          category: "Disposable",
          batchNo: "B002",
          expiry: "2026-03-15",
          sentQty: 50,
          usedQty: 20,
          adjustQty: 30,
        },
      ]);

      setInstrumentList([
        {
          id: 1,
          type: "Tray",
          name: "Tray A",
          count: 10,
          adjustQty: 10,
        },
        {
          id: 2,
          type: "Tool",
          name: "Bone Saw",
          count: 20,
          adjustQty: 20,
        },
      ]);
    }
  }, [show]);

  const handleProductChange = (index, value) => {
    const updated = [...productList];
    updated[index].adjustQty = parseInt(value) || 0;
    setProductList(updated);
  };

  const handleInstrumentChange = (index, value) => {
    const updated = [...instrumentList];
    updated[index].adjustQty = parseInt(value) || 0;
    setInstrumentList(updated);
  };

  const handleSubmit = () => {
    const payload = {
      fullReturn,
      dispatchTo,
      locationDetails,
      supplierName,
      collectBefore,
      remarks,
      returnableProducts: fullReturn ? [] : productList,
      instruments: fullReturn ? [] : instrumentList,
    };

    console.log("Transport Details Submitted:", payload);
    onClose();
  };

  return (
    <Drawer
      open={show}
      onClose={onClose}
      position="right"
      className="w-[90vw] max-w-[1000px]"
    >
      <DrawerHeader title="Transport Details" />
      <div className="p-4 space-y-6">
        {/* Full Return */}
        <div>
          <Checkbox
            checked={fullReturn}
            onChange={(e) => setFullReturn(e.target.checked)}
          />
          <Label className="ml-2">Full Products and Instruments</Label>
        </div>

        {/* Dispatch To */}
        <div>
          <Label>Dispatch To</Label>
          <Select
            value={dispatchTo}
            onChange={(e) => setDispatchTo(e.target.value)}
          >
            <option value="">-- Select --</option>
            <option value="office">Office</option>
            <option value="hospital_office">Hospital and Office</option>
            <option value="distributor_office">Distributor and Office</option>
          </Select>
        </div>

        {/* Conditional Location Fields */}
        {dispatchTo === "hospital_office" && (
          <>
            <div>
              <Label>Hospital Name</Label>
              <TextInput
                value={locationDetails.name}
                onChange={(e) =>
                  setLocationDetails((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label>Hospital Location</Label>
              <TextInput
                value={locationDetails.location}
                onChange={(e) =>
                  setLocationDetails((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
              />
            </div>
          </>
        )}

        {dispatchTo === "distributor_office" && (
          <>
            <div>
              <Label>Distributor Name</Label>
              <TextInput
                value={locationDetails.name}
                onChange={(e) =>
                  setLocationDetails((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label>Distributor Location</Label>
              <TextInput
                value={locationDetails.location}
                onChange={(e) =>
                  setLocationDetails((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
              />
            </div>
          </>
        )}

        {/* Supplier & Time */}
        <div>
          <Label>Supplier Name</Label>
          <TextInput
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
          />
        </div>

        <div>
          <Label>Collect Before</Label>
          <TextInput
            type="datetime-local"
            value={collectBefore}
            onChange={(e) => setCollectBefore(e.target.value)}
          />
        </div>

        <div>
          <Label>Remarks</Label>
          <Textarea
            placeholder="Any additional remarks..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>

        {/* Product & Instrument Tables if fullReturn = false */}
        {!fullReturn && (
          <>
            {/* Products */}
            <div>
              <h3 className="font-semibold mb-2">Returnable Products</h3>
              <div className="overflow-auto">
                <table className="w-full text-sm border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th>Product</th>
                      <th>Principle</th>
                      <th>Category</th>
                      <th>Batch No</th>
                      <th>Expiry</th>
                      <th>Sent Qty</th>
                      <th>Used Qty</th>
                      <th>Adjustment Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productList.map((p, i) => (
                      <tr key={p.id} className="border-t">
                        <td>{p.name}</td>
                        <td>{p.principle}</td>
                        <td>{p.category}</td>
                        <td>{p.batchNo}</td>
                        <td>{p.expiry}</td>
                        <td>{p.sentQty}</td>
                        <td>{p.usedQty}</td>
                        <td>
                          <TextInput
                            type="number"
                            value={p.adjustQty}
                            onChange={(e) =>
                              handleProductChange(i, e.target.value)
                            }
                            min={0}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Instruments */}
            <div>
              <h3 className="font-semibold mb-2">Returnable Instruments</h3>
              <div className="overflow-auto">
                <table className="w-full text-sm border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th>Type</th>
                      <th>Name</th>
                      <th>Count</th>
                      <th>Adjustment Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {instrumentList.map((item, i) => (
                      <tr key={item.id} className="border-t">
                        <td>{item.type}</td>
                        <td>{item.name}</td>
                        <td>{item.count}</td>
                        <td>
                          <TextInput
                            type="number"
                            value={item.adjustQty}
                            onChange={(e) =>
                              handleInstrumentChange(i, e.target.value)
                            }
                            min={0}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-6">
          <Button color="gray" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </div>
    </Drawer>
  );
};

export default TransportDetails;
