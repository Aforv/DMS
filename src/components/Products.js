import React from 'react'
import { Label,TextInput } from "flowbite-react";
import { Button } from "flowbite-react";
import { useState,useEffect } from 'react';
import axios from 'axios';
import { Drawer } from 'flowbite-react';
import { HiSearch } from "react-icons/hi";

import ProductsForm from './ProductsForm'

export default function Products() {
  const [openModal, setOpenModal] = useState(false);
  let[Allproducts,setAllproducts]=useState();
  let[editindex,setEditIndex]=useState(null);
  const [searchQuery, setSearchQuery] = useState("");
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
  axios.get('http://43.250.40.133:5005/api/v1/products?page=1&limit=25&isActive=true')
    .then((res) => {
      setAllproducts(res.data.data);
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
  });
}









  
  return (
    <div> 
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
    <button className="focus:outline-none text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
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
   <div className="w-full sm:w-[80vw] md:w-[70vw] lg:w-[60vw] xl:w-[50vw] max-w-full h-screen">
    <div className="flex justify-between items-center border-b pb-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Products</h2>
      <Button onClick={onCloseModal} color="gray">Close</Button>
    </div>

    <div className="grid grid-cols-1 mb-10 sm:grid-cols-3 gap-6">
      <div>
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

      <div>
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

      <div>
        <Label htmlFor="principle" className="mb-1 block">Principle ID</Label>
        <TextInput
          id="principle"
          name="principle"
          onChange={handlechange}
          value={Data.principle}
          placeholder="Enter Principle ID..."
        />
      </div>
    </div>

    <div className="grid grid-cols-1 mb-10 sm:grid-cols-3 gap-4">
      <div>
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

      <div>
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

      <div>
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


    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
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

      <div>
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

   
    <div className="flex justify-center pt-6">
      <Button className="text-green-400" color="green" onClick={() =>handleAddandEdit()}>
        {editindex!=null?"Update":"ADD"}
      </Button>
    </div>
  </div>
</Drawer>






    </div>
  )
}

