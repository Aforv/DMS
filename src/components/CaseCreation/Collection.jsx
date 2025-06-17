import React, { useState, useEffect } from "react";
import {
  Button,
  Label,
  TextInput,
  Checkbox,
  Drawer,
  DrawerHeader,
  FileInput,
} from "flowbite-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CollectedPersonForm = ({ onClose, show, onSuccess }) => {
  const [formData, setFormData] = useState({
    DeliveryStartOffice: false,
    DeliveryStartOfficeDateTime: "",
    DeliveryStartHospital: false,
    DeliveryStartHospitalDateTime: "",
    fullStock: false,
    missing: false,
    damaged: false,
    availableProducts: false,
    other: false,

    // Missing Items
    missingProducts: "",
    missingInstruments: "",
    missingReason: "",
    missingImages: [],

    // Damaged Items
    damagedProducts: "",
    damagedInstruments: "",
    damagedReason: "",
    damagedImages: [],

    // Other Items
    otherProducts: "",
    otherInstruments: "",
    otherReason: "",
    otherImages: [],

    // Available Products
    availableProductsCount: "",

    // Final Dispatch
    finalDispatchDeliveryStartOffice: false,
    finalDispatchDeliveryStartHospital: false,
    finalDispatchDateTimeOffice: "",
    finalDispatchDateTimeHospital: "",
    finalImages: [],

    // New Fields
    dispatchAnotherHospital: false,
    hospitalNameLocation: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [approvalRequested, setApprovalRequested] = useState(false);
  const [finalDispatchEnabled, setFinalDispatchEnabled] = useState(false);

  const totalDispatchedProducts = 20;
  const totalDispatchedInstruments = 120;

  const handleDeliveryStart = (location) => {
    const now = new Date().toISOString().slice(0, 16);
    setFormData((prev) => ({
      ...prev,
      [location]: true,
      [`${location}DateTime`]: now,
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => {
      let updated = { ...prev, [name]: val };
      if (name === "fullStock" && checked) {
        updated.missing = false;
        updated.damaged = false;
        updated.other = false;
        updated.availableProducts = false; // Hide Available Products
      }
      return updated;
    });
    if (type !== "checkbox") {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e, field) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ...files],
    }));
  };

  const removeImage = (field, index) => {
    setFormData((prev) => {
      const updated = { ...prev };
      updated[field].splice(index, 1);
      return updated;
    });
  };

  const validate = () => {
    const temp = {};
    if (!formData.DeliveryStartOffice || !formData.DeliveryStartOfficeDateTime) {
      temp.DeliveryStartOffice = "Office Check-In is required.";
    }
    if (!formData.DeliveryStartHospital || !formData.DeliveryStartHospitalDateTime) {
      temp.DeliveryStartHospital = "Hospital Check-In is required.";
    }

    if (formData.fullStock) {
      if (formData.finalImages.length === 0) {
        temp.finalImages = "Upload images to confirm Full Stock return.";
      }
    } else {
      if (!(formData.missing || formData.damaged || formData.other)) {
        temp.stackVerification = "Select at least one issue or mark as Full Stock.";
      }

      if (formData.missing) {
        if (!formData.missingProducts || isNaN(formData.missingProducts))
          temp.missingProducts = "Enter valid count.";
        if (!formData.missingInstruments || isNaN(formData.missingInstruments))
          temp.missingInstruments = "Enter valid count.";
        if (!formData.missingReason) temp.missingReason = "Reason is required.";
        if (formData.missingImages.length === 0)
          temp.missingImages = "At least one image required.";
      }

      if (formData.damaged) {
        if (!formData.damagedProducts || isNaN(formData.damagedProducts))
          temp.damagedProducts = "Enter valid count.";
        if (!formData.damagedInstruments || isNaN(formData.damagedInstruments))
          temp.damagedInstruments = "Enter valid count.";
        if (!formData.damagedReason) temp.damagedReason = "Reason is required.";
        if (formData.damagedImages.length === 0)
          temp.damagedImages = "At least one image required.";
      }

      if (formData.other) {
        if (!formData.otherProducts || isNaN(formData.otherProducts))
          temp.otherProducts = "Enter valid count.";
        if (!formData.otherInstruments || isNaN(formData.otherInstruments))
          temp.otherInstruments = "Enter valid count.";
        if (!formData.otherReason) temp.otherReason = "Reason is required.";
        if (formData.otherImages.length === 0)
          temp.otherImages = "At least one image required.";
      }

      const totalAffectedProducts =
        parseInt(formData.missingProducts || 0) +
        parseInt(formData.damagedProducts || 0) +
        parseInt(formData.otherProducts || 0);
      const totalAffectedInstruments =
        parseInt(formData.missingInstruments || 0) +
        parseInt(formData.damagedInstruments || 0) +
        parseInt(formData.otherInstruments || 0);

      if (
        totalAffectedProducts > totalDispatchedProducts ||
        totalAffectedInstruments > totalDispatchedInstruments
      ) {
        temp.countMismatch = "Total affected items exceed dispatched quantity.";
      }
    }

    if (
      (formData.finalDispatchDeliveryStartOffice || formData.finalDispatchDeliveryStartHospital) &&
      formData.finalImages.length === 0
    ) {
      temp.finalImages = "Upload final dispatch images.";
    }

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Submitted Form Data:", formData);
      toast.success("Return process submitted successfully.");
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error("Failed to submit return data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = () => {
    toast.info("Approval Request Sent");
    setApprovalRequested(true);

    setTimeout(() => {
      setFinalDispatchEnabled(true);
      toast.success("Approval Done");
    }, 10000); 
  };

  const handleFinalDispatch = (location) => {
    const now = new Date().toISOString().slice(0, 16);
    setFormData((prev) => ({
      ...prev,
      [location]: true,
      [`finalDispatchDateTime${location.replace("finalDispatchDeliveryStart", "")}`]: now,
    }));
  };

  return (
    <>
      <ToastContainer />
      <Drawer open={show} onClose={onClose} position="right" className="w-[90vw] max-w-[800px]">
        <DrawerHeader title="Delivery Person - Return Process" />
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Step 1: Supplier Check-In at Office */}

          
          <div className="flex items-center gap-2">
            <Checkbox
              name="DeliveryStartOffice"
              checked={formData.DeliveryStartOffice}
              onChange={() => handleDeliveryStart("DeliveryStartOffice")}
            />
            <Label>Delivery Start at Office</Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Started Date & Time</Label>
              <TextInput
                name="DeliveryStartOfficeDateTime"
                type="datetime-local"
                value={formData.DeliveryStartOfficeDateTime}
                readOnly
              />
            </div>
          </div>

          {/* Step 2: Supplier Check-In at Hospital */}
          <div className="flex items-center gap-2">
            <Checkbox
              name="DeliveryStartHospital"
              checked={formData.DeliveryStartHospital}
              onChange={() => handleDeliveryStart("DeliveryStartHospital")}
            />
            <Label> Reached Hospital</Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Reached Date & Time</Label>
              <TextInput
                name="DeliveryStartHospitalDateTime"
                type="datetime-local"
                value={formData.DeliveryStartHospitalDateTime}
                readOnly
              />
            </div>
          </div>

          {/* Step 3: Stack Verification */}
          <fieldset className="border p-4 rounded-md">
            <legend className="font-semibold">Stack Verification</legend>
              <p className="text-sm text-orange-600 mb-3">
                ⚠️ Please verify the stock before proceeding with the return process.
              </p>
               <p className="text-sm text-blue-500 mb-3">
                Supplied Products quantity: 100 / Used Products quantity: 20 / Returend Products quantity: 80
              </p>
               <p className="text-sm text-blue-500 mb-3">
                Supplied Instruments quantity: 50 / Other quantity: 20 
              </p>
            <div className="flex flex-wrap gap-4 mb-4">
              <label className="flex items-center gap-2">
                <Checkbox
                  name="fullStock"
                  checked={formData.fullStock}
                  onChange={handleChange}
                />
                <span>Full Stock</span>
              </label>
              {!formData.fullStock && (
                <>
                  <label className="flex items-center gap-2">
                    <Checkbox name="missing" checked={formData.missing} onChange={handleChange} />
                    <span>Missing</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <Checkbox name="damaged" checked={formData.damaged} onChange={handleChange} />
                    <span>Damaged</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <Checkbox name="other" checked={formData.other} onChange={handleChange} />
                    <span>Other Reason</span>
                  </label>
                </>
              )}

              {/* Only show "Available Products" if not Full Stock */}
              {!formData.fullStock && (
                <label className="flex items-center gap-2">
                  <Checkbox
                    name="availableProducts"
                    checked={formData.availableProducts}
                    onChange={handleChange}
                  />
                  <span>Available Products</span>
                </label>
              )}
            </div>

          

            {/* Conditional Fields Based on Selected Issues */}
            {(formData.missing || formData.damaged || formData.other) && (
              <div className="mt-4 space-y-4">
                {formData.missing && (
                  <div className="border p-3 rounded-md">
                    <h4 className="font-medium text-sm mb-2">Missing Items</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label>Products</Label>
                        <TextInput
                          name="missingProducts"
                          type="number"
                          value={formData.missingProducts}
                          onChange={handleChange}
                        />
                        {errors.missingProducts && (
                          <p className="text-xs text-red-500">{errors.missingProducts}</p>
                        )}
                      </div>
                      <div>
                        <Label>Instruments</Label>
                        <TextInput
                          name="missingInstruments"
                          type="number"
                          value={formData.missingInstruments}
                          onChange={handleChange}
                        />
                        {errors.missingInstruments && (
                          <p className="text-xs text-red-500">{errors.missingInstruments}</p>
                        )}
                      </div>
                      <div className="sm:col-span-2">
                        <Label>Reason</Label>
                        <TextInput
                          name="missingReason"
                          value={formData.missingReason}
                          onChange={handleChange}
                        />
                        {errors.missingReason && (
                          <p className="text-xs text-red-500">{errors.missingReason}</p>
                        )}
                      </div>
                      <div className="sm:col-span-2">
                        <Label>Upload Images</Label>
                        <FileInput
                          multiple
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "missingImages")}
                        />
                        {errors.missingImages && (
                          <p className="text-xs text-red-500">{errors.missingImages}</p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-2">
                          {formData.missingImages.map((file, i) => (
                            <div key={i} className="relative">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`preview-${i}`}
                                className="h-16 w-16 object-cover rounded"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage("missingImages", i)}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {formData.damaged && (
                  <div className="border p-3 rounded-md">
                    <h4 className="font-medium text-sm mb-2">Damaged Items</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label>Products</Label>
                        <TextInput
                          name="damagedProducts"
                          type="number"
                          value={formData.damagedProducts}
                          onChange={handleChange}
                        />
                        {errors.damagedProducts && (
                          <p className="text-xs text-red-500">{errors.damagedProducts}</p>
                        )}
                      </div>
                      <div>
                        <Label>Instruments</Label>
                        <TextInput
                          name="damagedInstruments"
                          type="number"
                          value={formData.damagedInstruments}
                          onChange={handleChange}
                        />
                        {errors.damagedInstruments && (
                          <p className="text-xs text-red-500">{errors.damagedInstruments}</p>
                        )}
                      </div>
                      <div className="sm:col-span-2">
                        <Label>Reason</Label>
                        <TextInput
                          name="damagedReason"
                          value={formData.damagedReason}
                          onChange={handleChange}
                        />
                        {errors.damagedReason && (
                          <p className="text-xs text-red-500">{errors.damagedReason}</p>
                        )}
                      </div>
                      <div className="sm:col-span-2">
                        <Label>Upload Images</Label>
                        <FileInput
                          multiple
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "damagedImages")}
                        />
                        {errors.damagedImages && (
                          <p className="text-xs text-red-500">{errors.damagedImages}</p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-2">
                          {formData.damagedImages.map((file, i) => (
                            <div key={i} className="relative">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`preview-${i}`}
                                className="h-16 w-16 object-cover rounded"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage("damagedImages", i)}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {formData.other && (
                  <div className="border p-3 rounded-md">
                    <h4 className="font-medium text-sm mb-2">Other Issue</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label>Products</Label>
                        <TextInput
                          name="otherProducts"
                          type="number"
                          value={formData.otherProducts}
                          onChange={handleChange}
                        />
                        {errors.otherProducts && (
                          <p className="text-xs text-red-500">{errors.otherProducts}</p>
                        )}
                      </div>
                      <div>
                        <Label>Instruments</Label>
                        <TextInput
                          name="otherInstruments"
                          type="number"
                          value={formData.otherInstruments}
                          onChange={handleChange}
                        />
                        {errors.otherInstruments && (
                          <p className="text-xs text-red-500">{errors.otherInstruments}</p>
                        )}
                      </div>
                      <div className="sm:col-span-2">
                        <Label>Reason</Label>
                        <TextInput
                          name="otherReason"
                          value={formData.otherReason}
                          onChange={handleChange}
                        />
                        {errors.otherReason && (
                          <p className="text-xs text-red-500">{errors.otherReason}</p>
                        )}
                      </div>
                      <div className="sm:col-span-2">
                        <Label>Upload Images</Label>
                        <FileInput
                          multiple
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "otherImages")}
                        />
                        {errors.otherImages && (
                          <p className="text-xs text-red-500">{errors.otherImages}</p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-2">
                          {formData.otherImages.map((file, i) => (
                            <div key={i} className="relative">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`preview-${i}`}
                                className="h-16 w-16 object-cover rounded"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage("otherImages", i)}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {formData.availableProducts && (
                  <div className="border p-3 rounded-md">
                    <h4 className="font-medium text-sm mb-2">Available Products Count</h4>
                    <TextInput
                      name="availableProductsCount"
                      type="number"
                      value={formData.availableProductsCount}
                      onChange={handleChange}
                    />
                  </div>
                )}
              </div>
            )}

            {errors.stackVerification && (
              <p className="text-sm text-red-500">{errors.stackVerification}</p>
            )}
            {approvalRequested && (
              <p className="text-sm text-blue-500 mt-2">
                ⚠️ Approval request has been sent to Inventory.
              </p>
            )}
          </fieldset>

            {/* Approval Button */}
            { (
              <Button color="success" size="sm" onClick={handleApprove} className="mt-3">
                Send Approval
              </Button>
            )}

                    {/* Optional: Dispatch to Another Hospital */}


{approvalRequested && (
  <>
    {/* Optional: Dispatch to Another Hospital */}
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Checkbox
          name="dispatchAnotherHospital"
          checked={formData.dispatchAnotherHospital}
          onChange={handleChange}
        />
        <Label>Dispatch to another hospital</Label>
      </div>
      {formData.dispatchAnotherHospital && (
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>HospitalName-Location</Label>
            <TextInput
              name="hospitalNameLocation"
              value={formData.hospitalNameLocation}
              onChange={handleChange}
              placeholder="Apollo Hospital, Hyderabad"
            />
          </div>
          <div>
            <Label>Products</Label>
            <TextInput
              onChange={handleChange}
              placeholder="Bioredis, 10"
            />
          </div>
          <div>
            <Label>Instruments</Label>
            <TextInput
              onChange={handleChange}
              placeholder="Surgical Kit, 5"
            />
          </div>
        </div>
      )}
    </div>
 

          {/* Step 4: Final Dispatch */}
             <div className="flex items-center gap-2">
            <Checkbox
              name="finalDispatchDeliveryStartHospital"
              checked={formData.finalDispatchDeliveryStartHospital}
              disabled={!finalDispatchEnabled}
              onChange={() => handleFinalDispatch("finalDispatchDeliveryStartHospital")}
            />
            <Label>Final Dispatch at Hospital</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              name="finalDispatchDeliveryStartOffice"
              checked={formData.finalDispatchDeliveryStartOffice}
              disabled={!finalDispatchEnabled}
              onChange={() => handleFinalDispatch("finalDispatchDeliveryStartOffice")}
            />
            <Label>Reached at Office</Label>
          </div>
       
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Final Dispatch Hospital Date & Time</Label>
              <TextInput
                name="finalDispatchDateTimeHospital"
                type="datetime-local"
                value={formData.finalDispatchDateTimeHospital}
                readOnly
              />
            </div>
            <div>
              <Label>Reached Date & Time</Label>
              <TextInput
                name="finalDispatchDateTimeOffice"
                type="datetime-local"
                value={formData.finalDispatchDateTimeOffice}
                readOnly
              />
            </div>
       
          </div>
          <div>
            <Label>Upload Final Dispatch Images</Label>
            <FileInput
              multiple
              accept="image/*"
              disabled={!finalDispatchEnabled}
              onChange={(e) => handleFileChange(e, "finalImages")}
            />
            {errors.finalImages && (
              <p className="text-sm text-red-500">{errors.finalImages}</p>
            )}
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.finalImages.map((file, i) => (
                <div key={i} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`final-preview-${i}`}
                    className="h-16 w-16 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage("finalImages", i)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>



          <Button color="blue" type="submit" disabled={isSubmitting}>
            Submit Return Process
          </Button>
 </>
)}

        </form>
      </Drawer>
    </>
  );
};

export default CollectedPersonForm;