import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
export default function AddProduct(){
    const [name,setName]=useState("")
    const [image,setImage]=useState("")
    const [price,setPrice]=useState("")
    const [quantity,setQuantity]=useState("")
    const [category,setCategory]=useState("")
    const navigate=useNavigate()
    const formData=new FormData()
    formData.append("name",name)
    formData.append("img",image)
    formData.append("price",price)
    formData.append("quantity",quantity)
    formData.append("category",category)


    function handlePost(e){
        e.preventDefault()
        axios.post("http://localhost:7000/create/ProductPost",formData).then(()=>{
               Swal.fire({
                        title: "Drag me!",
                        icon: "success",
                        draggable: true
                        });
            navigate("/dashboard/products")
        })
    }

    return   <div className="mt-10 ml-[10rem]">
            <form className="bg-white rounded-2xl shadow-lg p-8 w-[40rem] border-t-8 border-yellow-400">
        <h1 className="text-2xl font-bold text-center text-yellow-400 mb-6">
          Add Product
        </h1>
        <div className="flex flex-wrap gap-2">
        {/* name */}
        <div className="mb-4">
          <label className="block text-black font-semibold mb-1">Name</label>
          <input value={name} onChange={(e)=>setName(e.target.value)}
            type="text"
            placeholder="Enter name"
            className="w-full px-4 py-3 rounded-lg border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* File */}
        <div className="mb-4">
          <label className="block text-black font-semibold mb-1">File</label>
          <input onChange={(e)=>setImage(e.target.files[0])}
            type="file"
            className="w-full px-4 py-2 rounded-lg border border-yellow-400 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-black font-semibold mb-1">Category</label>
          <input value={category} onChange={(e)=>setCategory(e.target.value)}
            type="text"
            placeholder="Enter category name"
            className="w-64 px-4 py-2 rounded-lg border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* Quantity */}
        <div className="mb-4">
          <label className="block text-black font-semibold mb-1">Quantity</label>
          <input value={quantity} onChange={(e)=>setQuantity(e.target.value)}
            type="number"
            placeholder="Enter quantity"
            className="w-64 px-4 py-2 rounded-lg border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* Price */}
        <div className="mb-6">
          <label className="block text-black font-semibold mb-1">Price</label>
          <input value={price} onChange={(e)=>setPrice(e.target.value)}
            type="number"
            placeholder="Enter price"
            className="w-80 px-4 py-2 rounded-lg border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
</div>
        {/* Submit Button */}
        <button onClick={handlePost}
          
          className="w-full bg-yellow-400 text-black font-bold py-2 px-4 rounded-lg hover:bg-yellow-500 transition"
        >
          Save Product
        </button>
      </form>
        </div>
}