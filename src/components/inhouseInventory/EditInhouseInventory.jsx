// components/EditInventoryDrawer.jsx
import {
  Button,
  Drawer,
  DrawerHeader,
  Label,
  TextInput,
  Textarea,
} from "flowbite-react";
import React from "react";

const EditinhouseinventoryDrawer = ({
  open,
  onClose,
  onSubmit,
  formData,
  errors,
  handleChange,
  products,
}) => {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      position="right"
      size="sm"
      className="w-[90vw] max-w-[500px]"
    >
      <DrawerHeader title="Edit InhouseInventory" />

      <div className="p-4 space-y-6">
        <form onSubmit={onSubmit} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="product">Product</Label>
              <select
                id="product"
                name="product"
                className="w-full rounded-md text-sm"
                value={formData.product}
                onChange={handleChange}
              >
                <option value="">Select product</option>
                {products.map((prod) => (
                  <option key={prod._id} value={prod._id}>
                    {prod.name}
                  </option>
                ))}
              </select>
              {errors.product && (
                <p className="text-red-600 text-sm mt-1">{errors.product}</p>
              )}
            </div>

            <div>
              <Label htmlFor="batchNumber">Batch No</Label>
              <TextInput
                id="batchNumber"
                name="batchNumber"
                type="text"
                sizing="sm"
                value={formData.batchNumber}
                onChange={handleChange}
              />
              {errors.batchNumber && (
                <p className="text-red-600 text-sm mt-1">{errors.batchNumber}</p>
              )}
            </div>

            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <TextInput
                id="quantity"
                name="quantity"
                type="number"
                sizing="sm"
                value={formData.quantity}
                onChange={handleChange}
                min={1}
              />
              {errors.quantity && (
                <p className="text-red-600 text-sm mt-1">{errors.quantity}</p>
              )}
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <TextInput
                id="location"
                name="location"
                type="text"
                sizing="sm"
                value={formData.location}
                onChange={handleChange}
              />
              {errors.location && (
                <p className="text-red-600 text-sm mt-1">{errors.location}</p>
              )}
            </div>

            <div>
              <Label htmlFor="dpValue">DpValue</Label>
              <TextInput
                id="dpValue"
                name="dpValue"
                type="number"
                sizing="sm"
                value={formData.dpValue}
                onChange={handleChange}
                min={0.01}
                step={0.01}
              />
              {errors.dpValue && (
                <p className="text-red-600 text-sm mt-1">{errors.dpValue}</p>
              )}
            </div>

            <div>
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <TextInput
                id="expiryDate"
                name="expiryDate"
                type="date"
                sizing="sm"
                value={formData.expiryDate}
                onChange={handleChange}
              />
              {errors.expiryDate && (
                <p className="text-red-600 text-sm mt-1">{errors.expiryDate}</p>
              )}
            </div>

            <div>
              <Label htmlFor="binLocation">Bin Location</Label>
              <TextInput
                id="binLocation"
                name="binLocation"
                type="text"
                sizing="sm"
                value={formData.binLocation}
                onChange={handleChange}
              />
              {errors.binLocation && (
                <p className="text-red-600 text-sm mt-1">{errors.binLocation}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="reservationReason">Reservation Reason</Label>
              <Textarea
                id="reservationReason"
                name="reservationReason"
                rows={3}
                value={formData.reservationReason}
                onChange={handleChange}
              />
              {errors.reservationReason && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.reservationReason}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button onClick={onClose} type="button" color="failure">
              Cancel
            </Button>
            <Button color="blue" type="submit">
              Update
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  );
};

export default EditinhouseinventoryDrawer;
