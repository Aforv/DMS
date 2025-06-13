import React, { useState, useEffect } from "react";
import {
  Label,
  TextInput,
  Button,
  Dropdown,
  Select,
  Drawer,
} from "flowbite-react";
import { HiSearch, HiX } from "react-icons/hi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationModal from "./ConfirmationModal";
import axios from "axios";
import Spinner from "./Spinner";
import InventoryAdjustmentsTable from "./InventoryAdjustmentTable";
import * as XLSX from "xlsx";
import { useAuth } from "../Authentication/AuthContext";

export default function InventoryAdjustments() {
  const [adjustments, setAdjustments] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  let [selectedId, setSelectedId] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [openStatisticsDrawer, setOpenStatisticsDrawer] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    product: "",
    batchNumber: "",
    location: "",
    adjustmentType: "",
    quantity: "",
    reason: "",
    reasonCategory: "",
    approvedby: "",
    status: "",
    previousquantity: "",
    adjustedquantity: "",
    distributor: "",
    sourcelocation: "",
    adjustmentDate: "",
  });

  const { token } = useAuth();

  const fetchAdjustments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://43.250.40.133:5005/api/v1/inventory-adjustments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAdjustments(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch adjustments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdjustments();
    fetchStatistics();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchStatistics = async () => {
    try {
      const res = await axios.get(
        "http://43.250.40.133:5005/api/v1/inventory-adjustments/statistics",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStatistics(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch statistics");
    }
  };

  const handleExportToExcel = () => {
    const exportData = adjustments.map(
      ({
        product,
        batchNumber,
        location,
        adjustmentType,
        quantity,
        reason,
        reasonCategory,
        status,
        createdAt,
      }) => ({
        Product: product._id,
        BatchNumber: batchNumber,
        Location: location,
        AdjustmentType: adjustmentType,
        Quantity: quantity,
        Reason: reason,
        ReasonCategory: reasonCategory,
        Status: status,
        CreatedAt: new Date(createdAt).toLocaleString(),
      })
    );

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "InventoryAdjustments");

    XLSX.writeFile(workbook, "Inventory_Adjustments.xlsx");
  };

  const handleSubmit = async () => {
    setLoading(true);
    setOpenModal(false);

    const url = isEditing
      ? `http://43.250.40.133:5005/api/v1/inventory-adjustments/${editingId}`
      : `http://43.250.40.133:5005/api/v1/inventory-adjustments`;

    const method = isEditing ? "put" : "post";

    try {
      await axios({
        method,
        url,
        data: formData,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(isEditing ? "Adjustment updated!" : "Adjustment added!");
      fetchAdjustments();
      resetForm();
    } catch (err) {
      toast.error(
        isEditing ? "Failed to update adjustment." : "Failed to add adjustment."
      );
    } finally {
      setLoading(false);
    }
  };
  console.log(formData);

  const handleEdit = (adjustment) => {
    setFormData({
      product: adjustment.product,
      batchNumber: adjustment.batchNumber,
      location: adjustment.location,
      adjustmentType: adjustment.adjustmentType,
      quantity: adjustment.quantity,
      reason: adjustment.reason,
      reasonCategory: adjustment.reasonCategory,
      approvedby: adjustment.approvedby,
      status: adjustment.status,
      previousquantity: adjustment.previousquantity,
      adjustedquantity: adjustment.adjustedquantity,
      distributor: adjustment.distributor,
      sourcelocation: adjustment.sourcelocation,
      adjustmentDate: adjustment.adjustmentDate,
    });
    setEditingId(adjustment._id);
    setIsEditing(true);
    setOpenModal(true);
  };

  const openApproveModal = (id) => {
    setSelectedId(id);
    setSelectedAction("approve");
    setIsModalOpen(true);
  };

  const openRejectModal = (id) => {
    setSelectedId(id);
    setSelectedAction("reject");
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedId || !selectedAction) {
      toast.error("No row or action selected.");
      return;
    }
    console.log("selectedId:", selectedId);
    console.log("selectedAction:", selectedAction);

    setIsModalOpen(false);

    const id = selectedId;
    const action = selectedAction.toLowerCase();
    const url = `http://43.250.40.133:5005/api/v1/inventory-adjustments/${id}/${action}`;

    try {
      await axios.put(
        url,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(
        `${action.charAt(0).toUpperCase() + action.slice(1)}d successfully`
      );

      fetchAdjustments();
      fetchStatistics();
    } catch (error) {
      toast.error(`can ${action} only pending adjustment.`);
    } finally {
      setSelectedId(null);
      setSelectedAction(null);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
    setSelectedAction(null);
  };

  const resetForm = () => {
    setFormData({
      product: "",
      batchNumber: "",
      location: "",
      adjustmentType: "",
      quantity: "",
      reason: "",
      reasonCategory: "",
      approvedby: "",
      status: "",
      previousquantity: "",
      adjustedquantity: "",
      distributor: "",
      sourcelocation: "",
      adjustmentDate: "",
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const onCloseModal = () => {
    setOpenModal(false);
    resetForm();
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      {loading && <Spinner />}
      <div className="flex items-center justify-between flex-wrap px-4 py-2">
        <div className="min-w-[180px]">
          <TextInput
            type="text"
            placeholder="Search adjustments..."
            icon={HiSearch}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[180px]"
          />
        </div>

        <div className="flex-1 text-center ml-[-60px]">
          <h2 className="font-bold text-lg">INVENTORY ADJUSTMENTS</h2>{" "}
          {/* Reduced size */}
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => setOpenModal(true)} color="blue">
            Add Adjustment
          </Button>
          <Button onClick={() => setOpenStatisticsDrawer(true)} color="success">
            Statistics
          </Button>
          <Dropdown label="Actions" color="blue">
            <Dropdown.Item onClick={handleExportToExcel}>Export</Dropdown.Item>
            <Dropdown.Item>Import</Dropdown.Item>
          </Dropdown>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        onClose={() => setIsModalOpen(false)}
        message={`Are you sure you want to ${selectedAction} this adjustment?`}
      />

      <Drawer
        open={openStatisticsDrawer}
        onClose={() => setOpenStatisticsDrawer(false)}
        position="right"
        className="w-[80vw] max-w-[40rem]"
      >
        <div className="p-4">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-xl font-bold">Statistics</h2>
            <button onClick={() => setOpenStatisticsDrawer(false)}>
              <HiX className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          <div className="mt-4">
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-100 p-4 rounded">
                <strong>Total Adjustments:</strong>{" "}
                {statistics?.totalAdjustments ?? 0}
              </div>
              <div className="bg-gray-100 p-4 rounded">
                <strong>Financial Impact:</strong> ₹
                {statistics?.totalFinancialImpact ?? 0}
              </div>
              <div className="bg-gray-100 p-4 rounded">
                <strong>Damage Adjustments:</strong>{" "}
                {statistics?.damageAdjustments ?? 0}
              </div>
              <div className="bg-gray-100 p-4 rounded">
                <strong>Missing Adjustments:</strong>{" "}
                {statistics?.missingAdjustments ?? 0}
              </div>
              <div className="bg-gray-100 p-4 rounded">
                <strong>Return Adjustments:</strong>{" "}
                {statistics?.returnAdjustments ?? 0}
              </div>
              <div className="bg-gray-100 p-4 rounded">
                <strong>Processed Adjustments:</strong>{" "}
                {statistics?.processedAdjustments ?? 0}
              </div>
              <div className="bg-gray-100 p-4 rounded">
                <strong>Pending Adjustments:</strong>{" "}
                {statistics?.pendingAdjustments ?? 0}
              </div>
              <div className="bg-gray-100 p-4 rounded col-span-2">
                <strong>Date Range:</strong>{" "}
                {new Date(
                  statistics?.dateRange?.startDate
                ).toLocaleDateString()}{" "}
                -{" "}
                {new Date(statistics?.dateRange?.endDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </Drawer>

      <InventoryAdjustmentsTable
        adjustments={adjustments}
        searchQuery={searchQuery}
        onEdit={handleEdit}
        onApprove={openApproveModal}
        onReject={openRejectModal}
      />

      <Drawer
        open={openModal}
        onClose={onCloseModal}
        className="w-[90vw] max-w-[55vw]"
        position="right"
      >
        <div className="p-4">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-xl font-bold">
              {isEditing
                ? "Edit Inventory Adjustment"
                : "Add Inventory Adjustment"}
            </h2>
            <button onClick={onCloseModal}>
              <HiX className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div>
              <Label htmlFor="product" className="mb-1 block">
                Product
              </Label>
              <Select
                id="product"
                name="product"
                value={formData.product}
                onChange={handleChange}
                className="w-56"
                required
              >
                <option value="">Select product</option>
                <option value="683ebe2c17d6d7ce2fbf3e48">Product 1</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="batchNumber" className="mb-1 block">
                Batch Number
              </Label>
              <TextInput
                id="batchNumber"
                name="batchNumber"
                value={formData.batchNumber}
                onChange={handleChange}
                className="w-56"
                placeholder="Enter batch number"
                type="text"
                required
              />
            </div>
            <div>
              <Label htmlFor="adjustmentDate" className="mb-1 block">
                Adjustment Date
              </Label>
              <TextInput
                id="adjustmentDate"
                name="adjustmentDate"
                value={formData.adjustmentDate}
                onChange={handleChange}
                className="w-56"
                placeholder="Enter adjustment Date"
                type="date"
                required
              />
            </div>

            <div>
              <Label htmlFor="adjustmentType" className="mb-1 block">
                Adjustment Type
              </Label>
              <Select
                id="adjustmentType"
                name="adjustmentType"
                className="w-56"
                value={formData.adjustmentType}
                onChange={handleChange}
                required
              >
                <option value="">Select adjustment type</option>
                <option value="Damage">Damage</option>
                <option value="Return">Return</option>
                <option value="Missing">Missing</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="location" className="mb-1 block">
                Location
              </Label>
              <TextInput
                id="location"
                name="location"
                value={formData.location}
                className="w-56"
                onChange={handleChange}
                placeholder="Enter location"
                type="text"
                required
              />
            </div>

            <div>
              <Label htmlFor="sourcelocation" className="mb-1 block">
                Source Location
              </Label>
              <TextInput
                id="sourcelocation"
                name="sourcelocation"
                value={formData.sourcelocation}
                className="w-56"
                onChange={handleChange}
                placeholder="Enter source location"
                type="text"
                required
              />
            </div>

            <div>
              <Label htmlFor="distributor" className="mb-1 block">
                Distributor
              </Label>
              <TextInput
                id="distributor"
                name="distributor"
                value={formData.distributor}
                className="w-56"
                onChange={handleChange}
                placeholder="Enter Distributor"
                type="text"
                required
              />
            </div>

            <div>
              <Label htmlFor="adjustedquantity" className="mb-1 block">
                Adjusted Quantity
              </Label>
              <TextInput
                id="adjustedquantity"
                name="adjustedquantity"
                value={formData.adjustedquantity}
                className="w-56"
                onChange={handleChange}
                placeholder="Enter Adjusted Quantity"
                type="number"
                required
              />
            </div>

            <div>
              <Label htmlFor="previousquantity" className="mb-1 block">
                Previous Quantity
              </Label>
              <TextInput
                id="previousquantity"
                name="previousquantity"
                value={formData.previousquantity}
                className="w-56"
                onChange={handleChange}
                placeholder="Enter Previous Quantity"
                type="number"
                required
              />
            </div>

           

             <div>
              <Label htmlFor="status" className="mb-1 block">
                Status
              </Label>
              <Select
                id="status"
                name="status"
                className="w-56"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="">Select Status</option>
                <option value="Damage">Pending</option>
                <option value="Return">Completed</option>
                <option value="Missing">Cancelled</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="reason" className="mb-1 block">
                Reason
              </Label>
              <TextInput
                id="reason"
                name="reason"
                value={formData.reason}
                className="w-56"
                onChange={handleChange}
                placeholder="Enter reason"
                type="text"
                required
              />
            </div>

            <div>
              <Label htmlFor="reasonCategory" className="mb-1 block">
                Reason Category
              </Label>
              <Select
                id="reasonCategory"
                name="reasonCategory"
                className="w-56"
                value={formData.reasonCategory}
                onChange={handleChange}
                required
              >
                <option value="">Select reason category</option>
                <option value="Operational">Operational</option>
                <option value="Quality">Quality</option>
                <option value="External">External</option>
                <option value="System">System</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="quantity" className="mb-1 block">
                Quantity
              </Label>
              <TextInput
                id="quantity"
                name="quantity"
                className="w-56"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Enter quantity"
                type="number"
                required
              />
            </div>

            <div>
              <Label htmlFor="approvedby" className="mb-1 block">
                Approved By
              </Label>
              <TextInput
                id="approvedby"
                name="approvedby"
                className="w-56"
                value={formData.approvedby}
                onChange={handleChange}
                placeholder="Enter Approved By"
                type="number"
                required
              />
            </div>
          </div>

          <div className="flex justify-center pt-6">
            <Button onClick={handleSubmit}>
              {isEditing ? "Update" : "Submit"}
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
