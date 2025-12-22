import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export default function ProductsPage(){
    const [data,setData]=useState([])

function handleRead(){
    axios.get("http://localhost:7000/read/ProductPost").then((res)=>{
        setData(res.data)
    })
}
useEffect(()=>{
    handleRead()
},[])

    function handleDelete(id){
        axios.delete(`http://localhost:7000/delete/ProductPost/${id}`).then(()=>{
            alert("delete succes")
            handleRead()
        })
    }

    return <div className=" mt-3 ">
        <div className="items-center flex justify-between px-4">
            <h1 className="text-3xl font-semibold text-yellow-400">Product List</h1>
             <Link to="/dashboard/AddProduct"><button className="bg-yellow-400 text-black px-12 rounded-lg py-3 font-medium mr-4">Add Product</button></Link>
        </div>
        <table className="rounded-lg overflow-hidden mt-4 ">
            <thead className="bg-yellow-400/15 text-black ">
                <tr>
                    <th className="px-6 py-3 text-xl">prId</th>
                    <th className="px-3 py-3 text-xl">image</th>
                    <th className="px-6 py-3 text-xl">Name</th>
                    <th className="px-3 py-3 text-xl">Quantity</th>
                    <th className="px-6 py-3 text-xl">Price</th>
                    <th className="px-6 py-3 text-xl">Category</th>
                    <th className="px-4 py-3 text-xl">Status</th>
                    <th className="px-6 py-3 text-xl">Actions</th>
                </tr>
            </thead>
            {
                data.map((items)=>{
                    return <tbody>
                <tr className="  text-left pt-2 border-b p-1 hover:shadow-2xl ">
                    <td className="font-medium text-xs text-center">1</td>
                    <td><img className="w-9 h-10 rounded-lg mt-2 " src={`http://localhost:7000/Allimages/${items.prImage}`}  alt="" /></td>
                    <td className="px-8 py-3 text-[14px] text-left  font-medium">{items.name}</td>
                    <td className="px-12 py-3 text-[16px] ">{items.quantity}</td>
                    <td className="px-12 py-3 text-xs ">${items.price}</td>
                    <td className="px-12 py-3 text-[16px] ">{items.category}</td>
                    <td className={` ${items.status === "avialable" ?"text-green-400":"text-red-500"} px-12 py-3 text-[15px] font-sans  `}>{items.status}</td>
                    <td className="px-12 py-3 text-2xl ">
                        <div className="flex gap-1 items-center">
                         <Link to={`/dashboard/update/${items._id}`}> <i className="fa-solid fa-edit text-green-400 text-xl"></i></Link>
                            <i onClick={()=>handleDelete(items._id)} className="fa-solid fa-trash text-red-600 text-xl mt-2.5"></i>
                        </div>
                         
                    </td>
                </tr>
                
            </tbody>
                })
            }   
        </table>
      
 
 </div>
}