import React, { useEffect, useState } from "react";
import {
  Button,
  Label,
  TextInput,
  Drawer,
  DrawerHeader,
  DrawerItems,
} from "flowbite-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SellingPriceReview = ({ show, onClose }) => {
  const [data, setData] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [remark, setRemark] = useState("");

  useEffect(() => {
    const storedData = localStorage.getItem("usedProductsApproval");
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  const handleAction = (type) => {
    setActionType(type);
  };

  const handleSubmit = () => {
    if (!remark.trim()) {
      toast.error("Please enter a remark.");
      return;
    }

    const updatedData = {
      ...data,
      status: actionType,
      remark: remark.trim(),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem("usedProductsApproval", JSON.stringify(updatedData));
    setData(updatedData);
    toast.success(`Status updated to ${actionType}`);
    onClose();
  };

  if (!data) {
    return null;
  }

  return (
    <>
      <ToastContainer />
      <Drawer open={show} onClose={onClose} position="right" className="w-[50vw] max-w-[600px]">
        <DrawerHeader title="Selling Price Review" />
        <div className="p-4 space-y-6 overflow-y-auto max-h-[90vh]">
          {/* Status */}
          <div className="text-sm font-medium">
            Status:{" "}
            <span
              className={`px-3 py-1 rounded-full ${
                data.status === "Pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : data.status === "Approved"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {data.status}
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700 border border-gray-200">
              <thead className="bg-gray-100 font-medium">
                <tr>
                  <th className="px-3 py-2">Product</th>
                  <th className="px-3 py-2">Principle</th>
                  <th className="px-3 py-2">Qty</th>
                  <th className="px-3 py-2">DP</th>
                  <th className="px-3 py-2">MRP</th>
                  <th className="px-3 py-2">Selling Price</th>
                </tr>
              </thead>
              <tbody>
                {data.products.map((product) => (
                  <tr key={product.id} className="border-t">
                    <td className="px-3 py-2">{product.name}</td>
                    <td className="px-3 py-2">{product.principleName}</td>
                    <td className="px-3 py-2">{product.qty}</td>
                    <td className="px-3 py-2">₹{product.dp}</td>
                    <td className="px-3 py-2">₹{product.mrp}</td>
                    <td className="px-3 py-2">₹{product.sellingPrice}</td>
                  </tr>
                ))}
                <tr className="font-semibold bg-gray-50 border-t">
                  <td className="px-3 py-2" colSpan={2}>
                    Total
                  </td>
                  <td className="px-3 py-2">{data.totals.totalQty}</td>
                  <td className="px-3 py-2">₹{data.totals.totalDP}</td>
                  <td className="px-3 py-2">₹{data.totals.totalMRP}</td>
                  <td className="px-3 py-2">₹{data.totals.totalSellingPrice}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Remark (readonly if already reviewed) */}
          {data.status !== "Pending" && data.remark && (
            <div>
              <Label>Remark</Label>
              <TextInput value={data.remark} readOnly />
            </div>
          )}

          {/* Action Buttons & Remark Input */}
          {data.status === "Pending" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="remark">Enter Remark</Label>
                <TextInput
                  id="remark"
                  placeholder="Enter your remark"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button color="failure" onClick={() => handleAction("Rejected")}>
                  Reject
                </Button>
                <Button color="success" onClick={() => handleAction("Approved")}>
                  Approve
                </Button>
              </div>

              {actionType && (
                <div className="flex justify-end pt-2">
                  <Button color="blue" onClick={handleSubmit}>
                    Submit {actionType}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
};

export default SellingPriceReview;
