import React, { useState, useEffect } from "react";
import {
  Button,
  Label,
  TextInput,
  Select,
} from "flowbite-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PaymentTypeSelection({ show, onClose }) {
  const [paymentType, setPaymentType] = useState("Cash");

  const totalAmount = "12345.00";
  const assignedTo = "John Doe";
  const paymentStatus = "Pending";

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDCNumber, setInvoiceDCNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");

  const [cashDCNumber, setCashDCNumber] = useState("");
  const [cashRemarks, setCashRemarks] = useState("");

  const handleSubmit = () => {
    const assignmentDate = new Date().toISOString();

    const formData = {
      paymentType,
      assignmentDate,
      paymentStatus,
      assignedTo,
      invoiceDetails:
        paymentType === "Invoice"
          ? {
              invoiceNumber,
              invoiceDCNumber,
              totalAmount,
              invoiceDate,
            }
          : null,
      cashDetails:
        paymentType === "Cash"
          ? {
              cashDCNumber,
              cashRemarks,
            }
          : null,
    };

    localStorage.setItem("paymentFormData", JSON.stringify(formData));
    toast.success("Form submitted successfully!");
    onClose();
  };

  return (
    <>
      <ToastContainer />
    <div
  className={`fixed top-0 right-0 h-full bg-white shadow-lg transition-transform duration-300 ease-in-out z-50 w-[50vw] max-w-[600px] ${
    show ? "translate-x-0" : "translate-x-full"
  }`}
>
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Payment Details Form</h2>
          <button
            className="text-gray-500 hover:text-gray-700 text-xl"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6 overflow-y-auto max-h-[90vh]">
          <div>
            <Label htmlFor="paymentType">Payment Type</Label>
            <Select
              id="paymentType"
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
            >
              <option value="Cash">Cash</option>
              <option value="Invoice">Invoice</option>
            </Select>
          </div>

          {/* Invoice Fields */}
          {paymentType === "Invoice" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <TextInput
                  id="invoiceNumber"
                  placeholder="Enter invoice number"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="invoiceDCNumber">DC Number</Label>
                <TextInput
                  id="invoiceDCNumber"
                  placeholder="Enter DC number"
                  value={invoiceDCNumber}
                  onChange={(e) => setInvoiceDCNumber(e.target.value)}
                />
              </div>

              <div>
                <Label>Total Amount</Label>
                <TextInput value={totalAmount} readOnly />
              </div>

              <div>
                <Label htmlFor="invoiceDate">Invoice Created Date</Label>
                <TextInput
                  id="invoiceDate"
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                />
              </div>

              <div>
                <Label>Payment Status</Label>
                <TextInput value={paymentStatus} readOnly />
              </div>

              <div>
                <Label>Assigned To</Label>
                <TextInput value={assignedTo} readOnly />
              </div>
            </div>
          )}

          {/* Cash Fields */}
          {paymentType === "Cash" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="cashDCNumber">DC Number</Label>
                <TextInput
                  id="cashDCNumber"
                  placeholder="Enter DC number"
                  value={cashDCNumber}
                  onChange={(e) => setCashDCNumber(e.target.value)}
                />
              </div>

              <div>
                <Label>Payment Status</Label>
                <TextInput value={paymentStatus} readOnly />
              </div>

              <div>
                <Label>Assigned To</Label>
                <TextInput value={assignedTo} readOnly />
              </div>

              <div>
                <Label htmlFor="cashRemarks">Remarks</Label>
                <TextInput
                  id="cashRemarks"
                  placeholder="Enter remarks"
                  value={cashRemarks}
                  onChange={(e) => setCashRemarks(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button color="gray" onClick={onClose}>
              Cancel
            </Button>
            <Button color="blue" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PaymentTypeSelection;
