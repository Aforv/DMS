import React, { useState } from "react";
import {
  Button,
  Label,
  TextInput,
  Drawer,
  DrawerHeader,
} from "flowbite-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SellingPrice({ show, onClose }) {
  const initialProducts = [
    {
      id: 1,
      name: "Product A",
      principleName: "ABC Ltd",
      qty: 2,
      dp: 100,
      mrp: 120,
      sellingPrice: "",
    },
    {
      id: 2,
      name: "Product B",
      principleName: "XYZ Pvt",
      qty: 3,
      dp: 150,
      mrp: 170,
      sellingPrice: "",
    },
  ];

  const [products, setProducts] = useState(initialProducts);

  const handleSellingPriceChange = (id, value) => {
    const price = parseFloat(value);
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, sellingPrice: price } : p
      )
    );
  };

  const validateSellingPrice = (product, value) => {
    const price = parseFloat(value);
    if (isNaN(price)) {
      toast.error("Selling Price must be a number");
      return;
    }
    if (price < product.dp) {
      toast.error(`Selling Price can't be less than DP (${product.dp})`);
      handleSellingPriceChange(product.id, product.dp);
    } else if (price > product.mrp) {
      toast.error(`Selling Price can't be more than MRP (${product.mrp})`);
      handleSellingPriceChange(product.id, product.mrp);
    }
  };

  const calculateTotal = (key) =>
    products.reduce((sum, p) => sum + (parseFloat(p[key]) || 0), 0);

  const handleSubmit = () => {
    toast.success("Invoice Approved!");
    console.log("Submitted Products:", products);
    onClose();
  };

  return (
    <>
      <ToastContainer />
      <Drawer open={show} onClose={onClose} position="right" className="w-[50vw] max-w-[600px]">
        <DrawerHeader title="Used Products" />
        <div className="p-4 space-y-6">
          <Label className="mb-2">Product Details</Label>
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
                {products.map((product) => (
                  <tr key={product.id} className="border-t">
                    <td className="px-3 py-2">{product.name}</td>
                    <td className="px-3 py-2">{product.principleName}</td>
                    <td className="px-3 py-2">{product.qty}</td>
                    <td className="px-3 py-2">{product.dp}</td>
                    <td className="px-3 py-2">{product.mrp}</td>
                    <td className="px-3 py-2">
                      <TextInput
                        type="number"
                        className="w-24"
                        min={product.dp}
                        max={product.mrp}
                        value={product.sellingPrice}
                        onChange={(e) =>
                          handleSellingPriceChange(
                            product.id,
                            e.target.value
                          )
                        }
                        onBlur={(e) =>
                          validateSellingPrice(product, e.target.value)
                        }
                      />
                    </td>
                  </tr>
                ))}
                <tr className="font-semibold bg-gray-50 border-t">
                  <td className="px-3 py-2" colSpan={2}>
                    Total
                  </td>
                  <td className="px-3 py-2">{calculateTotal("qty")}</td>
                  <td className="px-3 py-2">₹{calculateTotal("dp")}</td>
                  <td className="px-3 py-2">₹{calculateTotal("mrp")}</td>
                  <td className="px-3 py-2">₹{calculateTotal("sellingPrice")}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-3">
            <Button color="gray" onClick={onClose}>
              Cancel
            </Button>
            <Button color="blue" onClick={handleSubmit}>
              Request Approval
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  );
}

export default SellingPrice;