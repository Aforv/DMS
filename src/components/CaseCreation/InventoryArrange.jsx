import {
  Drawer,
  Button,
  TextInput,
  DrawerHeader,
   Modal, 
   Label
} from "flowbite-react";
 
import { useEffect, useState, useRef } from "react";

const InventoryArrange = ({ show, onClose, onSuccess }) => {
  const [productList, setProductList] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [productEntry, setProductEntry] = useState({ productName: "", quantity: 1, reason: "" });
  const [trayItems, setTrayItems] = useState([]);
  const [trayEntry, setTrayEntry] = useState({ trayName: "", count: 0 });
  const [trayIndex, settrayIndex] = useState(1);
  const [toolItems, setToolItems] = useState([]);
  const [toolEntry, setToolEntry] = useState({ toolName: "", count: 0 });
  const [selectedTools, setSelectedTools] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]); // will hold objects like { type: 'Tray'|'Tool', index: number }
const [entryType, setEntryType] = useState('Product'); // default to Product
  const [images, setImages] = useState([]);
  const [selectedProductIndices, setSelectedProductIndices] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [status, setStatus] = useState("Rejected");
  const [selectedTrays, setSelectedTrays] = useState([]); 



const handleCheckboxChange = (product) => {
  const isSelected = selectedProducts.some((p) => p.productName === product.productName);
  if (isSelected) {
    setSelectedProducts((prev) => prev.filter((p) => p.productName !== product.productName));
  } else {
    setSelectedProducts((prev) => [...prev, { ...product, qty: product.quantity || 1 }]);
  }
};


  const handleQtyChange = (name, value) => {
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.name === name ? { ...p, qty: Math.max(1, parseInt(value || 0)) } : p
      )
    );
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("inventoryProducts"));
    if (saved?.length) {
      setProductList(saved);
    } else {
      const dummy = [
        { productName: "Ortho Screw 35mm", quantity: 4,availablequantity: 10, batchNo: "OS35-001",expiryDate: "2025-12-31",arranged :3,principlename: "OrthoTech",category: "Orthopedic" },  
        { productName: "Surgical Implant Kit", quantity: 1, availablequantity: 5, batchNo: "SIK-001", expiryDate: "2024-11-30" , arranged :2 ,principlename: "SurgiPro", category: "Surgical" },
        { productName: "Titanium Spine Plate", quantity: 2, availablequantity: 8 , batchNo: "TSP-001", expiryDate: "2025-01-15", arranged :1 ,principlename: "TitaniumMed" , category: "Spine" },
        { productName: "Dental Implant Abutment", quantity: 3, availablequantity: 6, batchNo: "DIA-001", expiryDate: "2024-10-20", arranged :4 ,principlename: "DentalCare", category: "Dental" },
        { productName: "Hip Replacement Cup", quantity: 1, availablequantity: 4 , batchNo: "HRC-001", expiryDate: "2025-03-10", arranged :2 ,principlename: "HipJoint", category: "Orthopedic" },
        { productName: "Shoulder Prosthesis", quantity: 2, availablequantity: 7 , batchNo: "SP-001",  expiryDate: "2024-09-05", arranged :3 ,principlename: "ShoulderFix", category: "Orthopedic" },
        { productName: "Intramedullary Nail", quantity: 5, availablequantity  : 12, batchNo: "IMN-001", expiryDate: "2025-06-30", arranged :5 ,principlename: "NailTech", category: "Orthopedic" },
        { productName: "Cranial Fixation Plate", quantity: 2, availablequantity: 9, batchNo: "CFP-001" , expiryDate: "2024-08-15", arranged :1,principlename: "CranialCare", category: "Cranial" },
        { productName: "Bone Screw Self-Tapping", quantity: 6, availablequantity: 15, batchNo: "BSST-001", expiryDate: "2025-02-28", arranged :4,principlename: "BoneScrewPro", category: "Orthopedic" },
        { productName: "Knee Spacer Block", quantity: 1, availablequantity: 3 , batchNo: "KSB-001", expiryDate: "2024-07-20", arranged :2,principlename: "KneeTech", category: "Orthopedic" } 
      ];
      setProductList(dummy);
      localStorage.setItem("inventoryProducts", JSON.stringify(dummy));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("inventoryProducts", JSON.stringify(productList));
  }, [productList]);

  const handleAddProduct = () => {
    if (!productEntry.productName || !productEntry.quantity) return;
    setNewProducts((prev) => [...prev, productEntry]);
    setProductEntry({ productName: "", quantity: 1, reason: "" });
  };
  const toggleSelectedProduct = (index) => {
    setSelectedProductIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };
  const handleBulkDelete = () => {
    setNewProducts((prev) => prev.filter((_, i) => !selectedProductIndices.includes(i)));
    setSelectedProductIndices([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allProducts = [...productList, ...newProducts];
    localStorage.setItem("inventoryProducts", JSON.stringify(allProducts));
    console.log({ allProducts, trayItems, toolItems, images });
    setProductList(allProducts);
    setNewProducts([]);
    onSuccess && onSuccess();
    onClose();
  };
  
  const handleProductChange = (e) => {
    setProductEntry({ ...productEntry, [e.target.name]: e.target.value });
  };
const mergedItems = [
  ...trayItems.map((item, index) => ({ ...item, type: 'Tray', index })),
  ...toolItems.map((item, index) => ({ ...item, type: 'Tool', index })),
];
const toggleSelectItem = (type, index) => {
  const exists = selectedItems.some((sel) => sel.type === type && sel.index === index);
  if (exists) {
    setSelectedItems(prev => prev.filter((sel) => !(sel.type === type && sel.index === index)));
  } else {
    setSelectedItems(prev => [...prev, { type, index }]);
  }
};
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages]);
  };
  const handleDeleteSelected = () => {
  // Remove items from trayItems
  const trayIndicesToRemove = selectedItems.filter(item => item.type === 'Tray').map(item => item.index);
  const newTrayItems = trayItems.filter((_, idx) => !trayIndicesToRemove.includes(idx));
  setTrayItems(newTrayItems);

  // Remove items from toolItems
  const toolIndicesToRemove = selectedItems.filter(item => item.type === 'Tool').map(item => item.index);
  const newToolItems = toolItems.filter((_, idx) => !toolIndicesToRemove.includes(idx));
  setToolItems(newToolItems);

  setSelectedItems([]); // clear selection after deletion
};

  const removeImage = (indexToRemove) => {
    setImages(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[indexToRemove].preview);
      updated.splice(indexToRemove, 1);
      return updated;
    });
  };
 
  return (
    <Drawer open={show} onClose={onClose} position="right" className="w-[90vw] max-w-[900px]">
      <DrawerHeader title="Inventory Manager Module" />
      <div className="flex justify-between items-center px-4 mt-[-16px]">
  <span className="text-sm font-medium text-gray-600">Status:</span>
  <span
    className={`text-xs font-semibold px-3 py-1 rounded-full ${
      status === "Approved"
        ? "bg-green-100 text-green-700"
        : status === "Rejected"
        ? "bg-red-100 text-red-700"
        : "bg-yellow-100 text-yellow-700"
    }`}
  >
    {status}
  </span>
</div>
       <div className="p-4 overflow-y-auto h-[90vh] space-y-6">
        
        {/* Table: Existing Products */}
         <div className="mt-6">
      <h2 className="font-semibold text-lg mb-2">Arranaged Products</h2>

      <div className="overflow-auto border rounded-md">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th className="px-4 py-2">Select</th>
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Principle Name</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Batch No</th>
              <th className="px-4 py-2">Expiry Date</th>
              <th className="px-4 py-2">Available Qty</th>
              <th className="px-4 py-2">Arranged Qty</th>
              <th className="px-4 py-2">Required Qty</th>
            </tr>
          </thead>
          <tbody>
           {productList.map((product, index) => {
  const isSelected = selectedProducts.some((p) => p.productName === product.productName);
  return (
    <tr key={index} className="border-t hover:bg-gray-50">
      <td className="px-4 py-2">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => handleCheckboxChange(product)}
        />
      </td>
      <td className="px-4 py-2">{product.productName}</td>
      <td className="px-4 py-2">{product.principlename || "N/A"}</td>
      <td className="px-4 py-2">{product.category || "N/A"}</td>
      <td className="px-4 py-2">{product.batchNo || "NA-001"}</td>
      <td className="px-4 py-2">{product.expiryDate || "N/A"}</td>
      <td className="px-4 py-2">{product.availablequantity}</td>
      <td className="px-4 py-2">{product.arranged || "N/A"}</td>
      <td className="px-4 py-2">
         <TextInput
                      type="number"
                      min={1}
                      max={product.availablequantity}
                      value={product.quantity}
                      disabled={!isSelected}
                      onChange={(e) => handleQtyChange(product.name, e.target.value)}
                      className="w-20"
                    />
      </td>
     

    </tr>
  );
})}
          </tbody>
        </table>
      </div>

      <div className="flex gap-2 mt-3 justify-end">
        <Button color="purple" size="sm" onClick={() => setShowPreview(true)}>
          Preview Selected Products
        </Button>
      </div>
<div className="mt-6">
  <h2 className="font-semibold text-lg mb-2">Add Entry</h2>
  <div className="flex items-end gap-2 mb-4">
    {/* Dropdown to select type */}
    <select
      className="border rounded px-3 py-2"
      value={entryType}
      onChange={(e) => setEntryType(e.target.value)}
    >
      <option value="Product">Product</option>
      <option value="Tray">Tray</option>
      <option value="Tool">Tool</option>
    </select>

    {/* Conditional inputs based on entryType */}
    {entryType === 'Product' && (
      <>
        <TextInput
          placeholder="Product Name"
          className="w-48"
          value={productEntry.productName}
          onChange={(e) =>
            setProductEntry({ ...productEntry, productName: e.target.value })
          }
        />
        <TextInput
          type="number"
          placeholder="Quantity"
          className="w-24"
          value={productEntry.quantity}
          onChange={(e) =>
            setProductEntry({ ...productEntry, quantity: +e.target.value })
          }
        />
        <TextInput
          placeholder="Reason"
          className="w-48"
          value={productEntry.reason}
          onChange={(e) =>
            setProductEntry({ ...productEntry, reason: e.target.value })
          }
        />
      </>
    )}

    {entryType === 'Tray' && (
      <>
        <TextInput
          placeholder="Tray Name"
          className="w-48"
          value={trayEntry.trayName}
          onChange={(e) =>
            setTrayEntry({ ...trayEntry, trayName: e.target.value })
          }
        />
        <TextInput
          type="number"
          placeholder="Count"
          className="w-24"
          value={trayEntry.count}
          onChange={(e) =>
            setTrayEntry({ ...trayEntry, count: +e.target.value })
          }
        />
      </>
    )}

    {entryType === 'Tool' && (
      <>
        <TextInput
          placeholder="Tool Name"
          className="w-48"
          value={toolEntry.toolName}
          onChange={(e) =>
            setToolEntry({ ...toolEntry, toolName: e.target.value })
          }
        />
        <TextInput
          type="number"
          placeholder="Count"
          className="w-24"
          value={toolEntry.count}
          onChange={(e) =>
            setToolEntry({ ...toolEntry, count: +e.target.value })
          }
        />
      </>
    )}

    {/* Add Button */}
    <Button
      onClick={() => {
        if (entryType === 'Product') {
          if (!productEntry.productName || !productEntry.quantity) return;
          setNewProducts((prev) => [...prev, { ...productEntry }]);
          setProductEntry({ productName: "", quantity: 1, reason: "" });
        } else if (entryType === 'Tray') {
          const newTrayName =
            trayEntry.trayName?.trim() ||
            (() => {
              const existingNames = trayItems.map((t) => t.trayName);
              let nextIndex = 1;
              while (existingNames.includes(`Tray${nextIndex}`))
                nextIndex++;
              return `Tray${nextIndex}`;
            })();
          setTrayItems([...trayItems, { trayName: newTrayName, count: trayEntry.count || 0 }]);
          setTrayEntry({ trayName: "", count: 0 });
        } else if (entryType === 'Tool') {
          const toolName = toolEntry.toolName?.trim();
          if (!toolName) {
            // fallback to auto-name
            const existingNames = toolItems.map((t) => t.toolName);
            let nextIndex = 1;
            while (existingNames.includes(`Tool${nextIndex}`)) nextIndex++;
            setToolItems([...toolItems, { toolName: `Tool${nextIndex}`, count: toolEntry.count || 0 }]);
            setToolEntry({ toolName: "", count: 0 });
          } else {
            setToolItems([...toolItems, { toolName, count: toolEntry.count || 0 }]);
            setToolEntry({ toolName: "", count: 0 });
          }
        }
      }}
      className="ml-2"
    >
      + Add
    </Button>
  </div>
</div>
      {/* Preview Modal */}
      <Modal show={showPreview} onClose={() => setShowPreview(false)}>
        <Modal.Header>Selected Products Preview</Modal.Header>
        <Modal.Body>
          {selectedProducts.length === 0 ? (
            <p>No products selected.</p>
          ) : (
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2">Batch No</th>
                  <th className="px-4 py-2">Expiry Date</th>
                  <th className="px-4 py-2">Available</th>
                  <th className="px-4 py-2">Required Qty</th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((product, index) => (
                  <tr key={index} className="bg-white border-b">
                    <td className="px-4 py-2">{product.productName}</td>
                    <td className="px-4 py-2">{product.batchNo || "NA-001"}</td>
                    <td className="px-4 py-2">{product.expiryDate || "N/A"}</td>
                    <td className="px-4 py-2">{product.availablequantity}</td>
                    <td className="px-4 py-2">{product.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setShowPreview(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
         {/* Newly Added Products */}
        <div className="mt-6">
  <h2 className="font-semibold text-lg mb-2">Newly Added Products</h2>

  {newProducts.length === 0 ? (
    <p className="text-sm italic text-gray-500">No new products added.</p>
  ) : (
    <>
      <div className="overflow-auto border rounded-md mb-3">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th className="px-4 py-2">Select</th>
              <th className="px-4 py-2">Product</th>
               <th className="px-4 py-2">Principle</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Reason</th>
             
            </tr>
          </thead>
          <tbody>
            {newProducts.map((item, index) => {
                            const isSelected = selectedProductIndices.includes(index);

  return (
                <tr key={index} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    className="accent-blue-500"
                    checked={selectedProductIndices.includes(index)}
                    onChange={() => toggleSelectedProduct(index)}
                  />
                </td>
                <td className="px-4 py-2">{item.productName}</td>
                <td className="px-4 py-2">{item.principlename || "Principle"}</td>
                <td className="px-4 py-2">{item.category || "Category"}</td>
                <td className="px-4 py-2">
  <TextInput
                      type="number"
                      min={1}
                       value={item.quantity}
                      disabled={!isSelected}
                      // onChange={(e) => handleQtyChange(product.name, e.target.value)}
                      className="w-20"
                    />

                </td>
                <td className="px-4 py-2">{item.reason || "—"}</td>
              </tr>
  )
})}
          </tbody>
        </table>
      </div>

      {selectedProductIndices.length > 0 && (
        <div className="text-right">
          <button
            onClick={handleBulkDelete}
            className="bg-red-600 text-white px-4 py-2 rounded text-sm"
          >
            🗑 Delete Selected
          </button>
        </div>
      )}
    </>
  )}
</div>


    
{/* Tool and tray management */}
<div className="mt-6">
  <h2 className="font-semibold text-lg mb-2">Tray & Tool Items</h2>
  {mergedItems.length === 0 ? (
    <p className="text-sm italic text-gray-500">No tray/tool items available.</p>
  ) : (
    <div className="overflow-auto border rounded-md mb-4">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th className="px-4 py-2">Select</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Count</th>
          </tr>
        </thead>
        <tbody>
   {mergedItems.map((item) => {
  const isSelected = selectedItems.some(
    (sel) => sel.type === item.type && sel.index === item.index
  );
  return (
    <tr key={`${item.type}-${item.index}`} className="border-t hover:bg-gray-50">
      <td className="px-4 py-2">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => toggleSelectItem(item.type, item.index)}
        />
      </td>
      <td className="px-4 py-2">{item.type}</td>
      <td className="px-4 py-2">{item.trayName || item.toolName}</td>
      <td className="px-4 py-2">
        <TextInput
          type="number"
          className="w-20"
          value={item.count}
          disabled={!isSelected}
          onChange={(e) => {
            const newCount = +e.target.value;
            if (item.type === 'Tray') {
              setTrayItems((prev) =>
                prev.map((tray, idx) =>
                  idx === item.index ? { ...tray, count: newCount } : tray
                )
              );
            } else if (item.type === 'Tool') {
              setToolItems((prev) =>
                prev.map((tool, idx) =>
                  idx === item.index ? { ...tool, count: newCount } : tool
                )
              );
            }
          }}
        />
      </td>
    </tr>
  );
})}
        </tbody>
      </table>
    </div>
  )}
  {selectedItems.length > 0 && (
    <div className="flex justify-end mb-4">
      <Button color="red" size="sm" onClick={handleDeleteSelected}>
        Delete Selected
      </Button>
    </div>
  )}
</div>




        {/* Image Upload */}
        <div>
          <h2 className="font-semibold mb-2">Upload Arrangement Photos</h2>
          <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="border p-2 rounded w-full" />
          {images.length > 0 && (
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
              {images.map((img, index) => (
                <div key={index} className="relative border p-2 rounded shadow-sm group">
                  <img src={img.preview} alt={`Preview ${index}`} className="w-full h-32 object-cover rounded" />
                  <button onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded hidden group-hover:block">✕</button>
                  <p className="mt-1 text-xs text-center truncate">{img.file.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="text-center mt-4">
          <Button onClick={handleSubmit} color="dark">Submit</Button>
        </div>
      </div>
    </Drawer>
  );
};
 

export default InventoryArrange;