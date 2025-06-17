import React, { useEffect, useState } from "react";
import {
  Button,
  Label,
  TextInput,
  Select,
  Textarea,
  Drawer,
  DrawerHeader,
} from "flowbite-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal } from "flowbite-react"; // Add at top with other imports


function Lead({ onClose, show, onSuccess, editData = null }) {
  const [formData, setFormData] = useState({
    hospital: "",
    doctor: "",
    principle: "",
    category: "",
    subcategory: "",
    otherSubcategory: "",
    supplyBefore: "",
    caseAt: "",
    notes: "",
    requiredProducts: [],
  });

  const [dropdowns, setDropdowns] = useState({
    hospitals: [],
    doctors: [],
    principles: [],
    categories: [],
    subcategories: [],
  });

  const [nestedSubcategories, setNestedSubcategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [customProducts, setCustomProducts] = useState([]);
  const [newProductName, setNewProductName] = useState("");

    const [productList, setProductList] = useState(
   [
  { name: "Ortho Screw 35mm", available: 10, principle: "OrthoTech", batchNo: "B1234", code: "OT-001" },
  { name: "Surgical Implant Kit A", available: 5, principle: "SurgiCore", batchNo: "S5678", code: "SC-002" },
  { name: "Bone Plate 12H", available: 8, principle: "MedFix", batchNo: "BPL-223", code: "MF-003" },
  { name: "K-Wire 2.5mm", available: 15, principle: "PinTech", batchNo: "KW-299", code: "PT-004" },
  { name: "Cortical Screw 4.5mm", available: 12, principle: "BonePro", batchNo: "CS-876", code: "BP-005" },
  { name: "Cannulated Screw", available: 6, principle: "IntraSurg", batchNo: "CN-554", code: "IS-006" },
  { name: "External Fixator", available: 9, principle: "FixMech", batchNo: "EF-912", code: "FM-007" },
  { name: "Spinal Rod 300mm", available: 3, principle: "SpineTech", batchNo: "SR-021", code: "ST-008" },
  { name: "Locking Plate 5H", available: 7, principle: "PlateCo", batchNo: "LP-734", code: "PC-009" },
  { name: "Femoral Nail", available: 4, principle: "OrthoMax", batchNo: "FN-102", code: "OM-010" },
  { name: "Proximal Humerus Plate", available: 6, principle: "HumeTech", batchNo: "PHP-980", code: "HT-011" },
  { name: "Pelvic Clamp", available: 2, principle: "PelviFix", batchNo: "PC-445", code: "PF-012" },
  { name: "Suture Anchor", available: 11, principle: "AnchorMed", batchNo: "SA-876", code: "AM-013" },
  { name: "Tibial Plate 8H", available: 5, principle: "KneeCare", batchNo: "TP-110", code: "KC-014" },
  { name: "LCP Dorsal Plate", available: 3, principle: "BoneAlign", batchNo: "LDP-645", code: "BA-015" },
  { name: "Arthroscopy Kit", available: 6, principle: "ScopeMed", batchNo: "AK-321", code: "SM-016" },
  { name: "Metacarpal Plate", available: 7, principle: "HandForm", batchNo: "MP-556", code: "HF-017" },
  { name: "Sternum Wire", available: 13, principle: "ChestFix", batchNo: "SW-211", code: "CF-018" },
  { name: "Orthopedic Drill Bit", available: 20, principle: "DrillPro", batchNo: "DB-092", code: "DP-019" },
  { name: "Bone Cement", available: 8, principle: "CemBond", batchNo: "BC-777", code: "CB-020" },
  { name: "Vertebral Spacer", available: 4, principle: "SpineSpace", batchNo: "VS-104", code: "SS-021" },
  { name: "Hip Spacer", available: 2, principle: "JointMed", batchNo: "HS-302", code: "JM-022" },
  { name: "Intramedullary Nail", available: 5, principle: "MedLock", batchNo: "IM-001", code: "ML-023" },
  { name: "Surgical Screw Tray", available: 10, principle: "TrayFix", batchNo: "SST-909", code: "TF-024" },
  { name: "Ortho Clamp Set", available: 6, principle: "ClampTech", batchNo: "OCS-888", code: "CT-025" },
]);

  
const [showPreview, setShowPreview] = useState(false);

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  const fetchDropdowns = async () => {
    try {
      const [hospitalsRes, doctorsRes, principlesRes, categoriesRes, subcategoriesRes] =
        await Promise.all([
          axios.get("http://43.250.40.133:5005/api/v1/hospitals", axiosConfig),
          axios.get("http://43.250.40.133:5005/api/v1/doctors", axiosConfig),
          axios.get("http://43.250.40.133:5005/api/v1/principles", axiosConfig),
          axios.get("http://43.250.40.133:5005/api/v1/categories", axiosConfig),
          axios.get("http://43.250.40.133:5005/api/v1/subcategories", axiosConfig),
        ]);

      setDropdowns({
        hospitals: hospitalsRes.data.data || [],
        doctors: doctorsRes.data.data || [],
        principles: principlesRes.data.data || [],
        categories: categoriesRes.data.data || [],
        subcategories: (subcategoriesRes.data.data || []).map((s) => ({
          ...s,
          children: s.children || [],
        })),
      });
    } catch (err) {
      toast.error("Failed to load dropdowns.");
    }
  };

  useEffect(() => {
    if (show) {
      fetchDropdowns();
      if (editData) {
        setFormData({
          hospital: editData.hospital?._id || editData.hospital || "",
          doctor: editData.doctor?._id || editData.doctor || "",
          principle: editData.principle?._id || editData.principle || "",
          category: editData.category?._id || editData.category || "",
          subcategory: editData.subcategory?._id || editData.subcategory || "",
          otherSubcategory: editData.otherSubcategory || "",
          supplyBefore: editData.supplyBefore?.slice(0, 16) || "",
          caseAt: editData.caseAt?.slice(0, 16) || "",
          notes: editData.notes || "",
          requiredProducts: editData.requiredProducts || [],
        });
      } else {
        setFormData({
          hospital: "",
          doctor: "",
          principle: "",
          category: "",
          subcategory: "",
          otherSubcategory: "",
          supplyBefore: "",
          caseAt: "",
          notes: "",
          requiredProducts: [],
        });
      }
    }
  }, [show, editData]);

  const validate = () => {
    const temp = {};
    if (!formData.hospital) temp.hospital = "Required";
    if (!formData.doctor) temp.doctor = "Required";
    if (!formData.principle) temp.principle = "Required";
    if (!formData.category) temp.category = "Required";
    if (!formData.supplyBefore) temp.supplyBefore = "Required";
    if (!formData.caseAt) temp.caseAt = "Required";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      status: "Lead",
    };

    try {
      if (editData && editData._id) {
        await axios.put(`http://43.250.40.133:5005/api/v1/cases/${editData._id}`, payload, axiosConfig);
        toast.success("Lead updated successfully.");
      } else {
        await axios.post("http://43.250.40.133:5005/api/v1/cases", payload, axiosConfig);
        toast.success("Lead added successfully.");
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error("Failed to save lead.");
    }
  };
 

  const isSelected = (name) =>
    formData.requiredProducts.some((p) => p.name === name);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));

    if (name === "subcategory") {
      const selected = dropdowns.subcategories.find((s) => s._id === value);
      setNestedSubcategories(selected?.children || []);
    }
  };

  const renderNestedSubcategories = (children, level = 1) => {
    if (!children || children.length === 0) return null;
    const levelKey = `childSubcategory_${level}`;

    return (
      <div className="mt-2">
        <Label>Child Subcategory Level {level}</Label>
        <Select
          name={levelKey}
          value={formData[levelKey] || ""}
          onChange={(e) => {
            const { value } = e.target;
            const selected = children.find((c) => c._id === value);
            const updatedForm = { ...formData, [levelKey]: value };
            Object.keys(updatedForm).forEach((k) => {
              if (k.startsWith("childSubcategory_") && parseInt(k.split("_")[1]) > level) {
                delete updatedForm[k];
              }
            });
            setFormData(updatedForm);
            setNestedSubcategories(selected?.children || []);
          }}
        >
          <option value="">Select</option>
          {children.map((child) => (
            <option key={child._id} value={child._id}>{child.name}</option>
          ))}
        </Select>
        {renderNestedSubcategories(
          children.find((c) => c._id === formData[levelKey])?.children || [],
          level + 1
        )}
      </div>
    );
  };

  return (
    <>
      <ToastContainer />
      <Drawer open={show} onClose={onClose} position="right" className="w-[90vw] max-w-[900px]">
        <DrawerHeader title={editData ? "Edit Lead" : "Add Lead"} />

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Hospital & Doctor */}
            {["hospital", "doctor"].map((name) => (
              <div key={name}>
                <Label>{name.charAt(0).toUpperCase() + name.slice(1)}</Label>
                <Select name={name} value={formData[name]} onChange={handleChange}>
                  <option value="">Select</option>
                  {dropdowns[name + "s"]?.map((opt) => (
                    <option key={opt._id} value={opt._id}>{opt.name}</option>
                  ))}
                </Select>
                {errors[name] && <p className="text-sm text-red-600">{errors[name]}</p>}
              </div>
            ))}
          </div>

          {/* Principle Section */}
          <fieldset className="border p-4 rounded-md">
            <legend className="font-semibold mb-2">Principle Information</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["principle", "category"].map((name) => (
                <div key={name}>
                  <Label>{name.charAt(0).toUpperCase() + name.slice(1)}</Label>
                  <Select name={name} value={formData[name]} onChange={handleChange}>
                    <option value="">Select</option>
                    {dropdowns[name + "s"]?.map((opt) => (
                      <option key={opt._id} value={opt._id}>{opt.name}</option>
                    ))}
                  </Select>
                  {errors[name] && <p className="text-sm text-red-600">{errors[name]}</p>}
                </div>
              ))}

              <div>
                <Label>Subcategory</Label>
                <Select name="subcategory" value={formData.subcategory} onChange={handleChange}>
                  <option value="">Select</option>
                  {dropdowns.subcategories.map((opt) => (
                    <option key={opt._id} value={opt._id}>{opt.name}</option>
                  ))}
                </Select>
              </div>

              <div>
                <Label>Other Subcategory (if any)</Label>
                <TextInput
                  name="otherSubcategory"
                  value={formData.otherSubcategory}
                  onChange={handleChange}
                />
              </div>
            </div>

            {renderNestedSubcategories(nestedSubcategories)}

            {/* Products Section */}
            {/* <div className="mt-4">
              <Label>Required Products</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border p-3 rounded-md">
                {[...productList, ...customProducts].map((product, index) => (
                  <label key={index} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.requiredProducts.includes(product)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...formData.requiredProducts, product]
                          : formData.requiredProducts.filter((p) => p !== product);
                        setFormData({ ...formData, requiredProducts: updated });
                      }}
                    />
                    {product}
                  </label>
                ))}
              </div>

              <div className="flex gap-2 mt-2">
                <TextInput
                  placeholder="Enter new product"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                />
                <Button
                  size="sm"
                  onClick={() => {
                    if (newProductName && !customProducts.includes(newProductName)) {
                      setCustomProducts([...customProducts, newProductName]);
                      setNewProductName("");
                    }
                  }}
                >
                  Add Product
                </Button>
              </div>
            </div> */}
         
  {/* <div>
          <Label>Products List</Label>
          <div className="space-y-2 border p-3 rounded-md grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[...productList, ...customProducts].map((product, index) => {
              const name = product.name || product;
              const available = product.available ?? 100;
              const existing = formData.requiredProducts.find(
                (p) => p.name === name
              );
              const selected = !!existing;

              return (
                <div key={index} className="flex items-center gap-4 ">
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData((prev) => ({
                          ...prev,
                          requiredProducts: [
                            ...prev.requiredProducts,
                            { name, qty: 1, available },
                          ],
                        }));
                      } else {
                        setFormData((prev) => ({
                          ...prev,
                          requiredProducts: prev.requiredProducts.filter(
                            (p) => p.name !== name
                          ),
                        }));
                      }
                    }}
                  />
                  <span className="w-40">{name} (Available: {available})</span>
                  <TextInput
                    type="number"
                    min={1}
                    max={available}
                    disabled={!selected}
                    value={existing?.qty || ""}
                    onChange={(e) => {
                      const qty = Math.min(
                        parseInt(e.target.value || 0),
                        available
                      );
                      setFormData((prev) => ({
                        ...prev,
                        requiredProducts: prev.requiredProducts.map((p) =>
                          p.name === name ? { ...p, qty } : p
                        ),
                      }));
                    }}
                    className="w-24"
                  />
                </div>
              );
            })}

            <div className="flex gap-2 mt-2">
              <TextInput
                placeholder="Enter new product"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
              />
              <Button
                size="sm"
                onClick={() => {
                  if (
                    newProductName &&
                    ![...productList, ...customProducts].some(
                      (p) => (p.name || p) === newProductName
                    )
                  ) {
                    setCustomProducts([
                      ...customProducts,
                      { name: newProductName, available: 100 },
                    ]);
                    setNewProductName("");
                  }
                }}
              >
                Add Product
              </Button>
            </div>
          </div>
        </div> */}
        <div>
  <Label>Products List</Label>
  <div className="overflow-auto border rounded-md">
    <table className="w-full text-sm text-left text-gray-500">
      <thead className="text-xs text-gray-700 uppercase bg-gray-100">
        <tr>
          <th className="px-4 py-2">Select</th>
          <th className="px-4 py-2">Principle</th>
          <th className="px-4 py-2">Product</th>
          <th className="px-4 py-2">Batch No</th>
          <th className="px-4 py-2">Available Qty</th>
          <th className="px-4 py-2">Required Qty</th>
        </tr>
      </thead>
      <tbody>
        {[...productList, ...customProducts].map((product, index) => {
          const name = product.name || product;
          const available = product.available ?? 100;
          const principle = product.principle || "N/A";
          const batchNo = product.batchNo || "NA-001";
          const code = product.code || name?.slice(0, 3).toUpperCase() + "-001";
          const existing = formData.requiredProducts.find((p) => p.name === name);
          const selected = !!existing;

          return (
            <tr key={index} className="bg-white border-b">
              <td className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData((prev) => ({
                        ...prev,
                        requiredProducts: [
                          ...prev.requiredProducts,
                          { name, qty: 1, available, principle, batchNo },
                        ],
                      }));
                    } else {
                      setFormData((prev) => ({
                        ...prev,
                        requiredProducts: prev.requiredProducts.filter((p) => p.name !== name),
                      }));
                    }
                  }}
                />
              </td>
              <td className="px-4 py-2">{principle}</td>
              <td className="px-4 py-2">{name} ({code})</td>
              <td className="px-4 py-2">{batchNo}</td>
              <td className="px-4 py-2">{available}</td>
              <td className="px-4 py-2">
                <TextInput
                  type="number"
                  min={1}
                  max={available}
                  disabled={!selected}
                  value={existing?.qty || ""}
                  onFocus={(e) => {
    // Clear only if value exists
    if (existing?.qty) {
      e.target.select(); // Optional: highlights the value for quick overwrite
    }
  }}
                  onChange={(e) => {
                    const inputVal = parseInt(e.target.value || 0);
                    const qty = isNaN(inputVal) ? "" : Math.min(inputVal, available);
                    setFormData((prev) => ({
                      ...prev,
                      requiredProducts: prev.requiredProducts.map((p) =>
                        p.name === name ? { ...p, qty } : p
                      ),
                    }));
                  }}
                  className="w-20"
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>

  <div className="flex gap-2 mt-2 items-center">
    <TextInput
      placeholder="Enter new product"
      value={newProductName}
      onChange={(e) => setNewProductName(e.target.value)}
    />
    <Button
      size="sm"
      onClick={() => {
        if (
          newProductName &&
          ![...productList, ...customProducts].some(
            (p) => (p.name || p) === newProductName
          )
        ) {
          setCustomProducts([
            ...customProducts,
            { name: newProductName, available: 100, principle: "Manual", batchNo: "NA-M" },
          ]);
          setNewProductName("");
        }
      }}
    >
      Add Product
    </Button>

    <Button
      size="sm"
      color="purple"
      onClick={() => setShowPreview(true)}
    >
      Preview Selected Products
    </Button>
  </div>
</div>

          </fieldset>

          {/* Dates and Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Case Date</Label>
              <TextInput
                name="caseAt"
                type="datetime-local"
                value={formData.caseAt}
                onChange={handleChange}
              />
              {errors.caseAt && <p className="text-sm text-red-600">{errors.caseAt}</p>}
            </div>
            <div>
              <Label>Supplying Date & Time</Label>
              <TextInput
                name="supplyBefore"
                type="datetime-local"
                value={formData.supplyBefore}
                onChange={handleChange}
              />
              {errors.supplyBefore && <p className="text-sm text-red-600">{errors.supplyBefore}</p>}
            </div>
          </div>

        
          <div>
            <Label>General Remarks</Label>
            <Textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" color="gray" onClick={onClose}>Cancel</Button>
            <Button type="submit" color="blue">{editData ? "Update Lead" : "Add Lead"}</Button>
          </div>
        </form>
        <Modal show={showPreview} onClose={() => setShowPreview(false)}>
  <Modal.Header>Selected Products Preview</Modal.Header>
  <Modal.Body>
    {formData.requiredProducts.length === 0 ? (
      <p>No products selected.</p>
    ) : (
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th className="px-4 py-2">Product</th>
            <th className="px-4 py-2">Principle</th>
            <th className="px-4 py-2">Batch No</th>
            <th className="px-4 py-2">Available</th>
            <th className="px-4 py-2">Required Qty</th>
          </tr>
        </thead>
        <tbody>
          {formData.requiredProducts.map((product, index) => (
            <tr key={index} className="bg-white border-b">
              <td className="px-4 py-2">{product.name}</td>
              <td className="px-4 py-2">{product.principle}</td>
              <td className="px-4 py-2">{product.batchNo}</td>
              <td className="px-4 py-2">{product.available}</td>
              <td className="px-4 py-2">{product.qty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button color="gray" onClick={() => setShowPreview(false)}>Close</Button>
  </Modal.Footer>
</Modal>

      </Drawer>
    </>
  );
}

export default Lead;
