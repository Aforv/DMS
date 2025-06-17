import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { Button, Dropdown, TextInput,Label } from "flowbite-react";
import { HiTrash, HiPencil, HiDotsVertical,HiSearch, HiDownload, HiCheckCircle } from "react-icons/hi";
import DeleteCase from "./DeleteCase";
// import {onAdd} from "./AddCaseData"
import Papa from "papaparse"
import { toast } from "react-toastify";
import Lead from "./Lead";
import InventoryUpdate from "./InventoryUpdate"; 
import Collection from "./Collection";
import AfterCase from "./AfterCase";
import FinalInventoryCheck from "./FinalInventoryCheck";
import ProductsDelivery from "./ProductsDelivery";
import InventoryArrange from "./InventoryArrange";
import SellingPrice from "./SellingPrice";
import LeadUpdateApproval from "./LeadUpdateApproval";
import PaymentTypeSelection from "./paymentType";
import SellingPriceReview from "./SellingPriceReview";
import UsedProductForm from "./UsedProductForm";
import AssignToSupplier from "./AssignToSupplier";
import SubmitToHospital from "./SubmitToHospital";
import CollectorForm from "./CollectorForm";  
import AssignSupplier from "./AssignSupplier";  
import TransportDetails from "./TransportDetails";  
import AdminExpenses from "./AdminExpenses";  
import InventoryApproval from "./InventoryApproval";  



function CaseTable({ data = [], onEdit, onDelete,onAdd , onStatusUpdate,
  onInvoiceDownload,}) {
    const [filterText, setFilterText] = useState("");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
const [selectedCase, setSelectedCase] = useState(null);
const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");
const [openModal, setOpenModal] = useState(false);
      const [searchTerm, setSearchTerm] = useState("");

       const [leads, setLeads] = useState([]);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
const [showUpdate, setShowUpdate] = useState(false);

const [showCollectionForm, setShowCollectionForm] = useState(false);
const [showAfterCaseForm, setShowAfterCaseForm] = useState(false);
const [showFinalInventoryCheckForm, setShowFinalInventoryCheckForm] = useState(false);
const [showProductsDeliveryForm, setShowProductsDeliveryForm] = useState(false);
const [showInventoryArrangeForm, setShowInventoryArrangeForm] = useState(false);
const [showLeadUpdateApprovalForm, setShowLeadUpdateApprovalForm] = useState(false);
const [showSellingPriceForm, setShowSellingPriceForm] = useState(false);

const [showUsedProductForm, setShowUsedProductForm] = useState(false);
const [showSellingPriceReviewForm, setShowSellingPriceReviewForm] = useState(false);
const [showAssignToSupplierForm, setShowAssignToSupplierForm] = useState(false);
const [showSubmitToHospitalForm, setShowSubmitToHospitalForm] = useState(false);
const [showCollectorForm, setShowCollectorForm] = useState(false);
const [showPaymentTypeSelectionForm, setShowPaymentTypeSelectionForm] = useState(false);
const [showshowAssignSupplierForm, setShowshowAssignSupplierForm] = useState(false);
const [showTransportDetailsForm, setShowTransportDetailsForm] = useState(false);
const [showAdminExpensesForm, setShowAdminExpensesForm] = useState(false);
const [showInventoryApprovalForm, setShowInventoryApprovalForm] = useState(false);



  const handleAddLead = () => {
    setLeadModalOpen(true);  
  };
      const filteredItems = data.filter((item) => {
    const combined = [
         item.caseNumber || "",
      item.patientName || "",
      item.surgeryDate || "",
      item.hospitalName || item.hospital?.name || "",
      item.doctorName || item.doctor?.name || "",
      item.principalName || item.principle?.name || "",
      item.category || item.category?.name || "",
      item.subcategory || item.subcategory?.name || "",
      item.dpValue?.toString() || "",
      item.sellingPrice?.toString() || "",
      item.status || "",
    ]
      .join(" ")
      .toLowerCase();

    return combined.includes(searchTerm.toLowerCase());
  });
    
    
    
      const handleEdit = (item) => {
        if (onEdit) {
          onEdit(item);
        }
      };
    
      const handleDeleteClick = (caseData) => {
  setSelectedCase(caseData);
  setDeleteModalOpen(true);
};

const handleStatusUpdate = (id) => {
    if (window.confirm("Mark this case as Completed?")) {
      onStatusUpdate?.(id, "Completed");
    }
  };

  const handleInvoiceDownload = (id) => {
    onInvoiceDownload?.(id);
  };
      
   
    const columns = [
         {
      name: "Case No.",
      selector: (row) => row.caseNumber || "N/A",
      sortable: true,
    },
    {
      name: "Patient",
      selector: (row) => row.patientName || "N/A",
      sortable: true,
    },
  {
    name: "Surgery Date",
    selector: (row) =>
      row.surgeryDate
        ? new Date(row.surgeryDate).toLocaleDateString()
        : "N/A",
    sortable: true,
  },
  {
    name: "Hospital",
    selector: (row) =>
      typeof row.hospital === "object"
        ? row.hospital?.name || "N/A"
        : row.hospital || "N/A",
    sortable: true,
  },
  {
    name: "Doctor",
    selector: (row) =>
      typeof row.doctor === "object"
        ? row.doctor?.name || "N/A"
        : row.doctor || "N/A",
    sortable: true,
  },
 {
      name: "Principal",
      selector: (row) =>
        row.principalName && typeof row.principalName === "object"
          ? row.principalName.name || "N/A"
          : row.principalName || "N/A",
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) =>
        row.category && typeof row.category === "object"
          ? row.category.name || "N/A"
          : row.category || "N/A",
      sortable: true,
    },
    {
      name: "Subcategory",
      selector: (row) =>
        row.subcategory && typeof row.subcategory === "object"
          ? row.subcategory.name || "N/A"
          : row.subcategory || "N/A",
      sortable: true,
    },
    {
      name: "DP Value",
      selector: (row) =>
        typeof row.dpValue === "object"
          ? row.dpValue?.value || 0
          : row.dpValue ?? 0,
      sortable: true,
    },
    {
      name: "Selling Price",
      selector: (row) =>
        typeof row.sellingPrice === "object"
          ? row.sellingPrice?.value || 0
          : row.sellingPrice ?? 0,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status || "Pending",
      cell: (row) => (
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            row.status === "Completed"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {row.status || "Pending"}
        </span>
      ),
      sortable: true,
    },
  {
    name: "Action",
    cell: (row) => (
      <Dropdown
        inline
        label={<HiDotsVertical className="w-5 h-5 text-gray-600 cursor-pointer" />}
        placement="left-start"
        arrowIcon={false}
      >
        <Dropdown.Item
          onClick={() => handleEdit(row)}
          className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <HiPencil className="w-4 h-4" />
          <span>Edit</span>
        </Dropdown.Item>
         <Dropdown.Item
          onClick={() => { setSelectedCase(row);  
    setShowCollectionForm(true);
  }}
          className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <HiPencil className="w-4 h-4" />
          <span> Collection person</span>
        </Dropdown.Item>
           <Dropdown.Item
          onClick={() => { setSelectedCase(row);  
    setShowAfterCaseForm(true);
  }}
          className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <HiPencil className="w-4 h-4" />
          <span>Inv. AfterCase</span>
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => { setSelectedCase(row);  
    setShowFinalInventoryCheckForm(true);
  }}
          className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <HiPencil className="w-4 h-4" />
          <span>Final Inventory Update</span>
        </Dropdown.Item>
          <Dropdown.Item
          onClick={() => { setSelectedCase(row);  
    setShowProductsDeliveryForm(true);
  }}
          className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <HiPencil className="w-4 h-4" />
          <span>Final Inventory Update</span>
        </Dropdown.Item>

   
         <Dropdown.Item
                    onClick={() => handleStatusUpdate(row._id)}
                    className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100 "
                  >
                    <HiCheckCircle className="w-4 h-4" />
                    Mark Completed
                  </Dropdown.Item>
        
                  <Dropdown.Item
                    onClick={() => handleInvoiceDownload(row._id)}
                    className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100 "
                  >
                    <HiDownload className="w-4 h-4" />
                     Download Invoice
                  </Dropdown.Item>
        <Dropdown.Item
          onClick={() => handleDeleteClick(row)}
          className="flex items-center gap-2 text-sm text-red-600 hover:bg-red-50"
        >
          <HiTrash className="w-4 h-4" />
          <span>Delete</span>
        </Dropdown.Item>
      </Dropdown>
    ),
    button: true,
    width: "160px",
  },
];
      const customStyles = {
        headRow: {
          style: {
            backgroundColor: "lightblue",
            borderBottomWidth: "1px",
            borderBottomColor: "#e5e7eb",
            fontWeight: 600,
          },
        },
        headCells: {
          style: {
            fontSize: "14px",
            color: "#111827",
            paddingLeft: "16px",
            paddingRight: "16px",
          },
        },
        rows: {
          style: {
            fontSize: "14px",
            color: "#374151",
            backgroundColor: "white",
          },
        },
        pagination: {
          style: {
            borderTop: "1px solid #e5e7eb",
            padding: "16px",
          },
        },
      };

      const handleExport = () => {
          if (!data || data.length === 0) {
            toast.warning("No data to export");
            return;
          }
      
          const exportData = data.map((item) => ({
            caseName: item?.name || "",
            surgeryDate: item.surgeryDate || "",
            hospital: item.hospitalName || item.hospital?.name || "",
            doctor: item.doctorName || item.doctor?.name || "",
            principle: item.principalName || item.principle?.name || "",
            category: item.category || item.category?.name || "",
            subcategory: item.subcategory || item.subcategory?.name || "",
            dpValue: item.dpValue?.toString() || "",
            sellingPrice: item.sellingPrice?.toString() || "",
            notes: item.status || "",
          }));


         
      
          const csv = Papa.unparse(exportData);
          const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.setAttribute("href", url);
          link.setAttribute("download", "inhouse_cases.csv");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };
    
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
        <div className="flex items-end gap-2">
          <div className="flex flex-col text-xs">
            <Label htmlFor="fromDate" className="mb-1 font-medium">
              From Date:
            </Label>
            <TextInput
              id="fromDate"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              sizing="sm"
            />
          </div>
          <div className="flex flex-col text-xs">
            <Label htmlFor="toDate" className="mb-1 font-medium">
              To Date:
            </Label>
            <TextInput
              id="toDate"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              sizing="sm"
            />
          </div>
           <div className="flex-grow max-w-[250px]">
            <Label htmlFor="search" className="mb-1 font-medium">
              Search
            </Label>
                <TextInput
                  // icon={HiSearch}
                  type="text"
                  placeholder="Search cases..."
                  value={searchTerm}
                  sizing="sm"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
        </div>

        <h1 className="text-xl font-bold whitespace-nowrap">CASES LIST</h1>

        <div className="flex gap-2">
          <Button onClick={() => handleExport()}>Export to Excel</Button>
         <Button color="blue" onClick={handleAddLead}>
            Add Lead
          </Button>
             <Button
          onClick={() => { setSelectedCase(1);  
    setShowInventoryArrangeForm(true);
  }}
          className="flex items-center gap-2 text-sm"
        >
          <span>InventoryArrange</span>
        </Button>
        <Button
  onClick={() => {
    setSelectedCase(1);  
    setShowLeadUpdateApprovalForm(true);
  }}
  className="flex items-center gap-2 text-sm"
>
  <span>LeadUpdateApproval</span>
</Button>
         <Button
  color="blue"
  onClick={() => {
    // Open Collect Form
    setShowshowAssignSupplierForm(true);
    setSelectedCase({ id: 1 }); // Replace with actual case
  }}
>
  Assign supplier
</Button>  


        
          <Button
          onClick={() => { setSelectedCase(1);  
    setShowProductsDeliveryForm(true);
  }}
          className="flex items-center gap-2 text-sm"
        >
          <span>ProductsDeliverye</span>
        </Button>
     
          <Button
          onClick={() => { setSelectedCase(1);  
    setShowAfterCaseForm(true);
  }}
          className="flex items-center gap-2 text-sm"
        > 
          <span>Inv. After case</span>
        </Button>
      
                  <Button
  color="blue"
  onClick={() => {
    // Open Collect Form
    setShowTransportDetailsForm(true);
    setSelectedCase({ id: 1 }); // Replace with actual case
  }}
>
 asign collect supplier
</Button>   
   <Button
          onClick={() => { setSelectedCase(1);  
    setShowCollectionForm(true);
  }}
          className="flex items-center gap-2 text-sm"
        >
          
          <span> Collection person</span>
        </Button>
        
        <Button
  color="blue"
  onClick={() => {
    // Open Collect Form
    setShowInventoryApprovalForm(true);
    setSelectedCase({ id: 1 }); // Replace with actual case
  }}
>
 Inv Approval</Button>
   
       <Button
          onClick={() => { setSelectedCase(1);  
    setShowSellingPriceForm(true);
  }}
          className="flex items-center gap-2 text-sm"
        >
          <span>SellingPrice</span>
        </Button>
 <Button
          onClick={() => { setSelectedCase(1);  
    setShowFinalInventoryCheckForm(true);
  }}
          className="flex items-center gap-2 text-sm"
        >
          <span>Final Inventory Update</span>
        </Button>
        
{/*      
          <Button color="blue" onClick={onAdd}>
            Add Cases
          </Button> */}
  <Button
  color="blue"
  onClick={() => {
    const selected = {
      status: "Pending",
      remark: "",
      products: [
        {
          id: "p1",
          name: "Product A",
          principleName: "ABC Pharma",
          qty: 2,
          dp: 150,
          mrp: 200,
          sellingPrice: 180,
        },
        {
          id: "p2",
          name: "Product B",
          principleName: "XYZ Meds",
          qty: 1,
          dp: 100,
          mrp: 120,
          sellingPrice: 110,
        },
      ],
      totals: {
        totalQty: 3,
        totalDP: 400,
        totalMRP: 520,
        totalSellingPrice: 470,
      },
    };

    localStorage.setItem("usedProductsApproval", JSON.stringify(selected));
    setSelectedCase(selected);
    setShowSellingPriceReviewForm(true);
  }}
>
  Selling Price Approval by Admin
</Button>


 

<Button
  color="blue"
  onClick={() => {
    setSelectedCase({ id: 1 }); // Replace with actual case if needed
    setShowPaymentTypeSelectionForm(true);
  }}
>
  Payment Type Selection
</Button>

<Button
  color="blue"
  onClick={() => {
    // Assign to Supplier
    setShowAssignToSupplierForm(true);
    setSelectedCase({ id: 1 }); // Replace with actual case
  }}
>
  Assign to Supplier
</Button>

<Button
  color="blue"
  onClick={() => {
    // Submit to Hospital
    setShowSubmitToHospitalForm(true);
    setSelectedCase({ id: 1 }); // Replace with actual case
  }}
>
  Submit to Hospital
</Button>

<Button
  color="blue"
  onClick={() => {
    // Open Collect Form
    setShowCollectorForm(true);
    setSelectedCase({ id: 1 }); // Replace with actual case
  }}
>
  Collect Form
</Button>
<Button
  color="blue"
  onClick={() => {
    // Open Collect Form
    setShowAdminExpensesForm(true);
    setSelectedCase({ id: 1 }); // Replace with actual case
  }}
>
Admin final step</Button>



          
        </div>
        
      </div>

      <DataTable
        columns={columns}
        data={filteredItems}
        pagination
        highlightOnHover
        striped
        responsive
        customStyles={customStyles}
        paginationPerPage={5}
        paginationRowsPerPageOptions={[5, 10, 15]}
        noDataComponent="No data available."
      />

      <DeleteCase
        show={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        caseId={selectedCase?.id}
        caseName={
          selectedCase?.caseNumber ||
          selectedCase?.patientName ||
          selectedCase?.caseName ||
          ""
        }
        onSuccess={() => {
          onDelete(selectedCase._id);
          setDeleteModalOpen(false);
        }}
      />
       <Lead
        show={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        onSave={(newLead) => {
          setLeads([...leads, newLead]);
          setLeadModalOpen(false);
        }}
      />
      <InventoryUpdate
      show={showUpdate}
      onClose={() => setShowUpdate(false)}
      caseData={selectedCase} 
    />
{showCollectionForm && (
  <Collection
    show={showCollectionForm}
    onClose={() => {
      setShowCollectionForm(false);
      setSelectedCase(null);
    }}
    caseData={selectedCase}
    
  />
)}
{showAfterCaseForm && (
  <AfterCase
    show={showAfterCaseForm}
    onClose={() => {
      setShowAfterCaseForm(false);
      setSelectedCase(null);
    }}
    caseData={selectedCase}
    
  />
)}

{showFinalInventoryCheckForm && (
  <FinalInventoryCheck
    show={showFinalInventoryCheckForm }
    onClose={() => {
      setShowAfterCaseForm(false);
      setSelectedCase(null);
    }}
    caseData={selectedCase}
    
  />
)}
{showSellingPriceForm && (
  <SellingPrice
    show={showSellingPriceForm }
    onClose={() => {
      setShowAfterCaseForm(false);
      setSelectedCase(null);
    }}
    caseData={selectedCase}
    
  />
)}

{showProductsDeliveryForm && (
  <ProductsDelivery
    show={showProductsDeliveryForm }
    onClose={() => {
      setShowAfterCaseForm(false);
      setSelectedCase(null);
    }}
    caseData={selectedCase}
    
  />
)}
{showInventoryArrangeForm && (
  <InventoryArrange
    show={showInventoryArrangeForm }
    onClose={() => {
      setShowAfterCaseForm(false);
      setSelectedCase(null);
    }}
    caseData={selectedCase}
    
  />
)}
 
{showLeadUpdateApprovalForm && (
  <LeadUpdateApproval
    show={showLeadUpdateApprovalForm}
    onClose={() => {
      setShowLeadUpdateApprovalForm(false);
      setSelectedCase(null);
    }}
    editData={selectedCase}
  />
)}
{showPaymentTypeSelectionForm && (
        <>
          
          {/* Drawer */}
          <PaymentTypeSelection
            show={showPaymentTypeSelectionForm}
            onClose={() => {
              setShowPaymentTypeSelectionForm(false);
              setSelectedCase(null);
            }}
            caseData={selectedCase}
          />
        </>
      )}
      {showSellingPriceReviewForm && (
        <>
          
          {/* Drawer */}
          <SellingPriceReview
            show={showSellingPriceReviewForm}
            onClose={() => {
              setShowSellingPriceReviewForm(false);
              setSelectedCase(null);
            }}
            caseData={selectedCase}
          />
        </>
      )}
      

       {showUsedProductForm && (
        <>
          
          {/* Drawer */}
          <UsedProductForm
            show={showUsedProductForm}
            onClose={() => {
              setShowUsedProductForm(false);
              setSelectedCase(null);
            }}
            caseData={selectedCase}
          />
        </>
      )}
      

       {showAssignToSupplierForm && (
        <>
          
          {/* Drawer */}
          <AssignToSupplier
            show={showAssignToSupplierForm}
            onClose={() => {
              setShowAssignToSupplierForm(false);
              setSelectedCase(null);
            }}
            caseData={selectedCase}
          />
        </>
      )}
         {showSubmitToHospitalForm && (
        <>
          
          {/* Drawer */}
          <SubmitToHospital
            show={showSubmitToHospitalForm}
            onClose={() => {
              setShowSubmitToHospitalForm(false);
              setSelectedCase(null);
            }}
            caseData={selectedCase}
          />
        </>
      )}
        {showCollectorForm && (
        <>
          
          {/* Drawer */}
          <CollectorForm
            show={showCollectorForm}
            onClose={() => {
              setShowCollectorForm(false);
              setSelectedCase(null);
            }}
            caseData={selectedCase}
          />
        </>
      )}
     {showshowAssignSupplierForm && (
        <> <AssignSupplier
  show={showshowAssignSupplierForm}
  onClose={() => setShowshowAssignSupplierForm(false)}
  hospitalInfo={{ name: "Apollo", location: "HSR Layout" }}
  onAssign={(data) => console.log("Assigned Supplier:", data)}
/>
</>)}
{showTransportDetailsForm && (
        <> <TransportDetails
  show={showTransportDetailsForm}
 onClose={() => setShowTransportDetailsForm(false)} 
/>
 
</>)}
{showAdminExpensesForm && (
        <> <AdminExpenses
  show={showAdminExpensesForm}
 onClose={() => setShowAdminExpensesForm(false)} 
/>
 
</>)}
{showInventoryApprovalForm &&(
      <InventoryApproval
       show={showInventoryApprovalForm} 
  onSubmit={(data) => console.log(data)}
  onClose={() =>  setShowInventoryApprovalForm(false)}
/>)}

 </div>
  );
}

export default CaseTable;
