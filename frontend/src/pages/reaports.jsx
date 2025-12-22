import axios from "axios"
import { useEffect, useState } from "react"

export default function Report(){
    const [getIncome, setIncome]=useState([])
    const [topCustomer, setTopCustomer]=useState([])


    function handleTopCustomer(){
        axios.get("http://localhost:7000/getTopCustomers/order").then((res)=>{
            setTopCustomer(res.data)
        })

    }


    function handleIncome(){
        axios.get("http://localhost:7000/getIncome/order").then((res)=>{
            setIncome(res.data[0].TotalIncome)
        })
    }
    useEffect(()=>{
        handleIncome()
        handleTopCustomer()
    },[])
    return <div className="mt-12">
        <h1 className="text-3xl font-medium underline">Report of <strong>Income:</strong></h1>
          <div className="bg-black border-r text-white w-72 h-32 rounded-md p-2 mt-6">
            <h1 className="text-3xl font-semibold text-center text-yellow-400 ">Total of Income</h1>
            <h1 className="text-3xl font-semibold text-center mt-4 ">${getIncome}</h1>
        </div>
        <div className="mt-12">
            <h1 className="text-2xl font-semibold ">Our Top Customers:</h1>
        <table className="mt-3">
            <thead className="bg-yellow-50/25">
                <th className="px-12 py-4 text-left font-semibold text-2xl">CustomerName</th>
                <th className="px-12 py-4 text-left font-semibold text-2xl">TotalSpend</th>
                <th className="px-12 py-4 text-left font-semibold text-2xl ">OrderCount</th>
            </thead>
            {
                topCustomer.map((item)=>{
                    return   <tbody className="text-center bg-gray-50 border-b">
                <td className="px-8 py-3 text-xl text-left">{item.customer}</td>
                <td className="px-8 py-3 text-xl ">${item.totalSpend}</td>
                <td className="px-8 py-3 text-xl ">{item.orderCount}</td>
            </tbody>
                })
            }
           
        </table>
      </div>
    </div>
}