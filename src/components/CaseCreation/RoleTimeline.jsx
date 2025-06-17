import React, { useState } from "react";
import { motion } from "framer-motion";
const flowData = [
  {
    role: "Sales Lead",
    name: "Anita",
    status: "Initiated",
    timestamp: "2025-06-16T09:00:00Z",
    remarks: "Kickstarting process"
  },
  {
    role: "Inventory Manager",
    name: "Ravi",
    status: "Submitted",
    timestamp: "2025-06-16T09:30:00Z",
    products: [
      { name: "Valve X", quantity: 3, added: 3, missing: 0 },
      { name: "Tube Y", quantity: 2, added: 2, missing: 0 }
    ],
    remarks: "All items present"
  },
  {
    role: "Sales Lead",
    name: "Anita",
    status: "Approved",
    timestamp: "2025-06-16T10:00:00Z",
    remarks: "Perfect submission"
  },
  {
    role: "Inventory Manager",
    name: "Ravi",
    status: "Forwarded to Supplier",
    timestamp: "2025-06-16T10:15:00Z"
  },
  {
    role: "Supplier",
    name: "Raj",
    status: "Ready for Dispatch",
    timestamp: "2025-06-16T11:00:00Z"
  },
  {
    role: "Transportation",
    name: "Mohan",
    status: "Out for Delivery",
    timestamp: "2025-06-16T11:30:00Z"
  }
];

const statusColors = {
  Approved: "bg-green-500",
  Rejected: "bg-red-500",
  Pending: "bg-gray-400",
  Submitted: "bg-blue-500",
  "Ready for Dispatch": "bg-yellow-500",
  "Out for Delivery": "bg-purple-500",
  "Forwarded to Supplier": "bg-indigo-500",
  Initiated: "bg-cyan-500",
  Resubmitted: "bg-orange-500"
};

const RoleTimeline = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
 
      {flowData.map((event, index) => {
        const isReached = event.timestamp ? new Date(event.timestamp) <= new Date() : false;
        const color = statusColors[event.status] || "bg-gray-300";
const currentStageIndex = flowData.findLastIndex(e => e.timestamp && new Date(e.timestamp) <= new Date());

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
            className="relative mb-8 pl-8"
          >
            {/* Dot */}
            <div
              className={`w-5 h-5 rounded-full absolute left-0.5 top-1 border-2 border-white shadow z-10
                ${isReached ? color : "bg-gray-300 opacity-50"}`}
            />

           {/* Connecting Line */}
{index < flowData.length - 1 && (
  <div
    className={`absolute align-center justify-start left-2.5 top-4 w-[4px] -z-0 ${
      index < currentStageIndex
        ? "h-full bg-gradient-to-b from-blue-500 to-gray-300"
        : "h-full bg-gray-200"
    }`}
    style={{ zIndex: 0 }}
  />
)}


            {/* Content */}
            <div
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              className={`cursor-pointer ${!isReached ? "opacity-50 pointer-events-none" : ""}`}
            >
              <p className="text-sm font-semibold text-gray-800">
                {event.role} - {event.status}
              </p>
              <p className="text-xs text-gray-500">
                {event.name} • {new Date(event.timestamp).toLocaleString()}
              </p>
            </div>

            {expandedIndex === index && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gray-100 p-3 mt-2 rounded border border-gray-300"
              >
                <p className="text-sm">
                  <strong>Remarks:</strong> {event.remarks || "—"}
                </p>
                {event.products && (
                  <div className="mt-2">
                    <p className="font-semibold text-sm mb-1">Products:</p>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                      {event.products.map((p, i) => (
                        <li key={i}>
                          {p.name} - Qty: {p.quantity}, Added: {p.added ?? 0}, Missing: {p.missing ?? 0}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default RoleTimeline;