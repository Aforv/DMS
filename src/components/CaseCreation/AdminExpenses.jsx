// // AdminExpenses.jsx
// import React, { useState, useEffect } from "react";
// import {
//   Drawer,
//   DrawerHeader,
//   Label,
//   TextInput,
//   Button,
//   Textarea,
// } from "flowbite-react";

// const AdminExpenses = ({ show, onClose }) => {
//   const [formData, setFormData] = useState({
//     bdCharges: "",
//     transportCharges: "",
//     miscExpenses: "",
//     remarks: "",
//   });

//   useEffect(() => {
//     if (show) {
//       // Load dummy or existing data if needed
//       setFormData({
//         bdCharges: "",
//         transportCharges: "",
//         miscExpenses: "",
//         remarks: "",
//       });
//     }
//   }, [show]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = () => {
//     console.log("Submitted Admin Expenses:", formData);
//     onClose();
//   };

//   return (
//     <Drawer
//       open={show}
//       onClose={onClose}
//       position="right"
//       className="w-[800px] max-w-full"
//     >
//       <DrawerHeader title="Admin - BD & Other Expenses" />
//       <div className="p-4 space-y-4">
//         <div>
//           <Label>BD Charges</Label>
//           <TextInput
//             type="number"
//             name="bdCharges"
//             value={formData.bdCharges}
//             onChange={handleChange}
//             placeholder="Enter BD Charges"
//           />
//         </div>
//         <div>
//           <Label>Transport Charges</Label>
//           <TextInput
//             type="number"
//             name="transportCharges"
//             value={formData.transportCharges}
//             onChange={handleChange}
//             placeholder="Enter Transport Charges"
//           />
//         </div>
//         <div>
//           <Label>Miscellaneous Expenses</Label>
//           <TextInput
//             type="number"
//             name="miscExpenses"
//             value={formData.miscExpenses}
//             onChange={handleChange}
//             placeholder="Other Expenses"
//           />
//         </div>
//         <div>
//           <Label>Remarks</Label>
//           <Textarea
//             name="remarks"
//             rows={3}
//             value={formData.remarks}
//             onChange={handleChange}
//             placeholder="Additional remarks or notes"
//           />
//         </div>
//         <div className="flex justify-end gap-2">
//           <Button color="gray" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button color="blue" onClick={handleSubmit}>
//             Save
//           </Button>
//         </div>
//       </div>
//     </Drawer>
//   );
// };

// export default AdminExpenses;


// AdminExpenses.jsx
import React, { useState, useEffect } from "react";
import {
  Drawer,
  DrawerHeader,
  Label,
  TextInput,
  Button,
  Textarea,
} from "flowbite-react";

const AdminExpenses = ({ show, onClose, caseData = { totalDP: 2000, totalSellingPrice: 2100 } }) => {
  const [formData, setFormData] = useState({
    bdCharges: "",
    bdPaidAt: "",
    bdPaidBy: "",
    supplierCost: "",
    otherExpenses: "",
    remarks: "",
  });

  const getNetProfit = () => {
    const totalDp = parseFloat(caseData.totalDP || 200);
    const totalSp = parseFloat(caseData.totalSellingPrice || 210);
    const bd = parseFloat(formData.bdCharges || 0);
    const supplier = parseFloat(formData.supplierCost || 0);
    const other = parseFloat(formData.otherExpenses || 0);
    const totalExpenses = bd + supplier + other;
    const netProfit = totalSp - totalDp - totalExpenses;
    const netPercentage = totalSp ? ((netProfit * 100) / totalSp).toFixed(2) : 0;
    return {
      netProfit: netProfit.toFixed(2),
      netPercentage,
    };
  };

  const { netProfit, netPercentage } = getNetProfit();

  useEffect(() => {
    if (show) {
      setFormData({
        bdCharges: "",
        bdPaidAt: "",
        bdPaidBy: "",
        supplierCost: "",
        otherExpenses: "",
        remarks: "",
      });
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("Submitted Admin Expenses:", formData);
    onClose();
  };

  return (
    <Drawer
      open={show}
      onClose={onClose}
      position="right"
      className="w-[800px] max-w-full"
    >
      <DrawerHeader title="Admin - BD & Other Expenses" />
      <div className="p-4 space-y-4">
        <div>
          <Label>BD Charges</Label>
          <TextInput
            type="number"
            name="bdCharges"
            value={formData.bdCharges}
            onChange={handleChange}
            placeholder="Enter BD Charges"
          />
        </div>
        <div>
          <Label>BD Paid At</Label>
          <TextInput
            type="datetime-local"
            name="bdPaidAt"
            value={formData.bdPaidAt}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label>BD Paid By</Label>
          <TextInput
            name="bdPaidBy"
            value={formData.bdPaidBy}
            onChange={handleChange}
            placeholder="Enter name"
          />
        </div>
        <div>
          <Label>Transport Charges</Label>
          <TextInput
            type="number"
            name="supplierCost"
            value={formData.supplierCost}
            onChange={handleChange}
            placeholder="Enter Supplier Cost"
          />
        </div>
        <div>
          <Label>Other Expenses</Label>
          <TextInput
            type="number"
            name="otherExpenses"
            value={formData.otherExpenses}
            onChange={handleChange}
            placeholder="Enter Other Expenses"
          />
        </div>
        <div>
          <Label>Remarks</Label>
          <Textarea
            name="remarks"
            rows={3}
            value={formData.remarks}
            onChange={handleChange}
            placeholder="Additional remarks or notes"
          />
        </div>
        <div className="bg-gray-100 p-3 rounded-md">
          <p><strong>Total DP:</strong> ₹{caseData.totalDP}</p>
          <p><strong>Total Selling Price:</strong> ₹{caseData.totalSellingPrice}</p>
          <p><strong>Net Profit:</strong> ₹{netProfit}</p>
          <p><strong>Net %:</strong> {netPercentage}%</p>
        </div>
        <div className="flex justify-end gap-2">
          <Button color="gray" onClick={onClose}>
            Cancel
          </Button>
          <Button color="blue" onClick={handleSubmit}>
            Save
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default AdminExpenses;
