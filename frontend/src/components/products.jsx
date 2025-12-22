import { useEffect, useState } from "react"
import axios from "axios"

export default function Products(){
    const [data,setData]=useState([])
    const [category,setCategory]=useState("")
    function handleReadData(){
        axios.get("http://localhost:7000/read/ProductPost",{
            "category":category
        }).then((res)=>{
            setData(res.data)
        })
    }
    useEffect(()=>{
        handleReadData()
    },[category])
   
    const handleStoreData=(data)=>{
        const newData=JSON.parse(localStorage.getItem("products")) || []

        const existId=newData.some((item)=> item._id === data._id)  //checks if its true stores and if itsnot true dont store
        if(!existId){
         newData.push(data)
        localStorage.setItem("products", JSON.stringify(newData))
        }
  
    }
    return <div className="mt-12 ml-4 grid grid-cols-4">
        <div> 
            <h1 className="text-2xl font-medium underline">Categories</h1>
            <form className=" flex-col" >
            <input value={"Food"} onChange={()=>setCategory("Food")} type="radio"  />Food <br />
            <input value={"electronic"} onChange={()=>setCategory("electronic")}  type="radio" />electronic <br />
            <input value={"Meat"} onChange={()=>setCategory("Meat")}  type="radio" />Meat <br />
            <input value={"Drinks"} onChange={()=>setCategory("Drinks")}  type="radio" />Drinks

            </form>
        </div>
        {
            data.map((items)=>{
                return  <div className="w-72 mb-10 h-[23rem] bg-white rounded-md  shadow-lg space-y-3 border-t text-gray-600 border-b border-b-yellow-400">
            <img className="w-72 h-64 border scale-95 rounded-lg" src={`http://localhost:7000/Allimages/${items.prImage}`} alt="" />
            <div className="flex justify-between px-2">
            <h1 className="text-xl font-medium">{items.name}</h1>
            <h1 className={` ${items.status === "avialable" ?"text-green-400":"text-red-500"} text-xl font-mono`}>{items.status}</h1>
            </div>
            <div className="flex justify-between px-4 items-center">
                <h1 className="text-2xl font-medium text-gray-600" >${items.price}</h1>
                <button onClick={()=>handleStoreData(items)} disabled={items.status !== "avialable"} className={`${items.status === "avialable"? "bg-yellow-400 font-medium text-black ml-1 px-4 py-2 rounded-md active:bg-gray-500":"bg-gray-100 line-through py-2 px-5"}` } ><i className="fa-solid fa-shopping-cart"></i>AddCart</button>
            </div>
        </div>
            })
        }
     
    </div>
}