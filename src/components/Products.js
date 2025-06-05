import React from 'react'
import { Label,TextInput } from "flowbite-react";
import { Button,Select } from "flowbite-react";
import { useState,useEffect } from 'react';
import axios from 'axios';
import { Drawer } from 'flowbite-react';
import { HiSearch } from "react-icons/hi";
import Spinner from './Spinner';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ProductsForm from './ProductsForm'
import { HiX } from "react-icons/hi";

export default function Products() {
  const [openModal, setOpenModal] = useState(false);
  let[Allproducts,setAllproducts]=useState();
  let[editindex,setEditIndex]=useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  function onCloseModal() {
    setOpenModal(false); 
    setEditIndex(null)
   setData({
  name:"",
  productCode:"",
  principle:"",
  dpValue:"",
  mrp:"",
  description:"",
    initialInventory: {
      quantity: "",
      location: ""
    }
    })
  }
 
const fetchProducts = () => {
    setLoading(true);
  axios.get('http://43.250.40.133:5005/api/v1/products?page=1&limit=25&isActive=true')
    .then((res) => {
      setAllproducts(res.data.data);
    })
    .finally(() => {
      setLoading(false);
    });
};

 useEffect(()=>{
  fetchProducts()
 },[])



let [Data,setData]=useState({
  name:"",
  productCode:"",
  principle:"",
  dpValue:"",
  mrp:"",
  description:"",
    initialInventory: {
      quantity: "",
      location: ""
    }
});


function handlechange(e) {
  const { name, value } = e.target;

  if (name === "quantity" || name === "location") {
    setData((prevFormData) => ({
      ...prevFormData,
      initialInventory: {
        ...prevFormData.initialInventory,
        [name]: value,
      },
    }));
  } else {
    setData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }
}

function handleedit(index){
  setOpenModal(true);
 let {
  name,
  productCode,
  principle,
  dpValue,
  mrp,
  description,
  quantity,
  //location is needed but not comming from backend
     
}=Allproducts[index];
 setData({  name,
  productCode,
  principle:principle._id,
  dpValue,
  mrp,
  description,
    initialInventory: {
      quantity,
      //location is needed 
    }})
setEditIndex(index)

}

function handleAddandEdit(){
setLoading(true);
let token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzE4M2UzMDRkYWI3NzA4NDE3ZDM1NyIsImlhdCI6MTc0ODg1OTAzMywiZXhwIjoxNzUxNDUxMDMzfQ.pVhO4C-UeQSWP-LrweV-riGTlJv_-iMI1H1KZqE4Q20';
setOpenModal(false)

const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

if(editindex!=null){  
let editElement=Allproducts[editindex]; 
axios.put(`http://43.250.40.133:5005/api/v1/products/${editElement._id}`,Data,config).then(response => {
    console.log('Response:', response.data);
    setEditIndex(null);
      setTimeout(() => {
    fetchProducts();  
  }, 500);
    setData({
  name:"",
  productCode:"",
  principle:"",
  dpValue:"",
  mrp:"",
  description:"",
    initialInventory: {
      quantity: "",
      location: ""
    }
    }) 
  }
)
  .catch(error => {
    console.error('Error:', error);
  }).finally(() => {
        setLoading(false);
        
      });

} 
else{
    axios.post(`http://43.250.40.133:5005/api/v1/products`,Data,config).then(response => {
    setTimeout(() => {
    fetchProducts();  
  }, 500); 
  setData({
  name:"",
  productCode:"",
  principle:"",
  dpValue:"",
  mrp:"",
  description:"",
    initialInventory: {
      quantity: "",
      location: ""
    }
    })

  })
  .catch(error => {
    console.error('Error:', error);
  });        
}
}

function handledelete(id) {
  const token ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzE4M2UzMDRkYWI3NzA4NDE3ZDM1NyIsImlhdCI6MTc0ODg1OTAzMywiZXhwIjoxNzUxNDUxMDMzfQ.pVhO4C-UeQSWP-LrweV-riGTlJv_-iMI1H1KZqE4Q20'; 
  axios.delete(`http://43.250.40.133:5005/api/v1/products/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(response => {
    console.log(response.data);
    setTimeout(() => {
    fetchProducts();  
  }, 500);
  })
  .catch(error => {
    console.error(error);
  }).finally(() => {
    setLoading(false);  
      });
}
function handleExportToExcel() {
 if(!Allproducts||Allproducts.length==0) return;
     const ecxeldata=Allproducts.map((elem,index)=>({
      Sno:index+1,
      SupplierName:elem.name,
      productCode:elem.productCode,
      Principle:elem.principle.name||'',
      DP:elem.dpValue,
      MRP:elem.mrp,
      Description:elem.description,
      Quantity:elem.quantity,
     }));
  const worksheet = XLSX.utils.json_to_sheet(ecxeldata);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });

  saveAs(data, "Products.xlsx");

 }

  return (
    <div> 
      {loading && <Spinner />}
<div className="flex justify-between items-center mb-4 flex-wrap gap-4">
  <div className="flex items-center gap-2">
    <TextInput
      icon={HiSearch}
      placeholder="Search products..."
      className="w-64"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </div>

  <div className="flex-1 text-center">
    <h2 className="font-bold text-xl">PRODUCTS LIST</h2>
  </div>

  <div className="flex gap-2">
    <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={()=>{setOpenModal(true)}}>
      Add Product
    </button>
    <button className="focus:outline-none text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" onClick={()=>handleExportToExcel()}>
      Export to Excel
    </button>
  </div>
</div>

     <div>
      <ProductsForm  products={Allproducts}
         onEdit={handleedit}
      onDelete={handledelete}
       searchQuery={searchQuery}
      />
   </div>

<Drawer open={openModal} onClose={onCloseModal} className="w-[90vw] max-w-[60vw]" position="right">
  <div className="w-full h-screen overflow-y-auto p-4">
    <div className="flex justify-between items-center border-b pb-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Products</h2>
        <button onClick={onCloseModal} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
    <HiX className="w-6 h-6" />
  </button>
    </div>

    <div className="flex flex-wrap gap-4 my-6">
      <div className="flex-1 min-w-[200px]">
        <Label htmlFor="name" className="mb-1 block">Supplier Name</Label>
        <TextInput
          id="name"
          name="name"
          onChange={handlechange}
          value={Data.name}
          placeholder="Enter Supplier Name..."
          required
        />
      </div>
      <div className="flex-1 min-w-[200px]">
        <Label htmlFor="productCode" className="mb-1 block">Product Code</Label>
        <TextInput
          id="productCode"
          name="productCode"
          onChange={handlechange}
          value={Data.productCode}
          placeholder="Enter Product Code..."
          required
        />
      </div>
    </div>

    
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex-1 min-w-[200px]">
<Label htmlFor="principle" className="mb-1 block">Principle ID</Label>
<Select
  id="principle"
  name="principle"
  value={Data.principle}
  onChange={handlechange}
  required
>
  <option value="">Select Principle</option>
  <option value="683467f1fd53184442ee1ba8">Product ID 1</option>
</Select>
      </div>
      <div className="flex-1 min-w-[200px]">
        <Label htmlFor="description" className="mb-1 block">Description</Label>
        <input
          type="text"
          id="description"
          name="description"
          value={Data.description}
          onChange={handlechange}
          placeholder="Enter description..."
          className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 
                     focus:ring-blue-500 focus:border-blue-500 
                     dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        />
      </div>
    </div>


    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex-1 min-w-[200px]">
        <Label htmlFor="DP" className="mb-1 block">DP</Label>
        <input
          type="number"
          id="DP"
          name="dpValue"
          value={Data.dpValue}
          onChange={handlechange}
          placeholder="0"
          required
          className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 
                     focus:ring-blue-500 focus:border-blue-500 
                     dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        />
      </div>
      <div className="flex-1 min-w-[200px]">
        <Label htmlFor="MRP" className="mb-1 block">MRP</Label>
        <input
          type="number"
          id="MRP"
          name="mrp"
          value={Data.mrp}
          onChange={handlechange}
          placeholder="0"
          required
          className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 
                     focus:ring-blue-500 focus:border-blue-500 
                     dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        />
      </div>
    </div>

 
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex-1 min-w-[200px]">
        <Label htmlFor="Quantity" className="mb-1 block">Quantity</Label>
        <input
          type="number"
          id="Quantity"
          name="quantity"
          value={Data.initialInventory.quantity}
          onChange={handlechange}
          placeholder="0"
          required
          className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 
                     focus:ring-blue-500 focus:border-blue-500 
                     dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        />
      </div>
  <div className="flex-1 min-w-[200px]">
        <Label htmlFor="Location" className="mb-1 block">Location</Label>
        <input
          type="text"
          id="Location"
          name="location"
          value={Data.initialInventory.location}
          onChange={handlechange}
          placeholder="Ex. Warehouse A"
          required
          className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 
                     focus:ring-blue-500 focus:border-blue-500 
                     dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        />
      </div>
    </div>    
 <div className="flex justify-center pt-4">
      <Button className="text-green-400" color="green" onClick={handleAddandEdit}>
        {editindex != null ? "Update" : "ADD"}
      </Button>
    </div>
  </div>
</Drawer>
    </div>
  )
}

