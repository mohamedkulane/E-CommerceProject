import axios from "axios";
import { useEffect, useState } from "react";

export default function ShoppingCart() {

  const [productData, setProducts]=useState([])

  // read data from database
  useEffect(()=>{
    const getData=JSON.parse(localStorage.getItem("products")) || []
    
    const update= getData.map(item=>({
      ...item, quantity:1, maxQuantity: item.quantity
    }))
    setProducts(update)
  },[])

  // Delete item from cart
  const handelDeleteItem=(id)=>{
    const removeItem=productData.filter((item)=> item._id !==id)
    localStorage.setItem("products", JSON.stringify(removeItem))
    setProducts(removeItem)
  }
  // total price count
  const TotalPrice=productData.reduce((sum,item)=> sum + (Number(item.price) * Number(item.quantity)),0)

  //  increment

  const handleIncrement=(id)=>{
    setProducts(prd=> prd.map(
      item=> item._id===id ?{...item, quantity: item.quantity <item.maxQuantity ? item.quantity +1 : item.quantity} : item
    ))
  }
  const handleDecremet=(id)=>{
    setProducts((prd)=> prd.map(
      item=> item._id===id ?{...item, quantity:item.quantity >1 ? item.quantity -1:item.quantity} : item
    ))
  }


  const customer=localStorage.getItem("customer")

  let customerOrder=""

  if(customer){
    customerOrder=JSON.parse(customer).data?.customer.name
  }


    function handleOrder(){
      if(!customer){
        alert("customer is requird so please login or make signup please")
        return;
      }
      axios.post("http://localhost:7000/create/order",{
        "customer":customerOrder,
        "products":productData.map(item=>({
            "productId":item._id,
            "quantity":item.quantity
        }))
      }).then((res)=>{
        if(res.data.error){
          alert(res.data.error)
        }else{
          alert("success order")
          localStorage.removeItem("products")
        }
      }).catch(error => console.log(error))
    }
  return (
    <div className="bg-gray-100 min-h-screen p-6 w-full">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Shopping Cart */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-semibold mb-4">Shopping Cart</h2>
          <div className="flex justify-between border-b text-xl font-medium text-gray-400">
            <h1>name</h1>
            <h1 className="ml-12">Quantity</h1>
            <h1>Price</h1>
            <h1>TotalPrice</h1>
          </div>
     
     {
      productData.map((item)=>{
        return           <div className="divide-y">

            {/* Product 1 */}
            <div className="flex items-center justify-between py-4 ">
              <div className="flex items-center space-x-4">
                <img
                  src={`http://localhost:7000/Allimages/${item.prImage}`}
                  className="w-16 rounded"
                  alt="iPhone"
                />
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-purple-600">{item.category}</p>
                  <button onClick={()=>handelDeleteItem(item._id)} className="text-red-500 text-sm hover:underline">
                    Remove
                  </button>
                </div>
              </div>
              
                <div className="flex items-center border rounded mr-0">
                  <button onClick={()=>handleDecremet(item._id)} className="px-2 active:bg-red-400 active:text-black">-</button>
                  <h1 className="border-l border-r px-2">{item.quantity}</h1>
                  <button onClick={()=>handleIncrement(item._id)} className="px-2 active:bg-green-400 active:text-white">+</button>
                </div>
                <div className="flex gap-20">

                <p className="w-20 text-right font-semibold mr-16">${item.price}</p>
                <p className="w-20 text-right font-semibold mr-3">${item.price * item.quantity}</p>
                </div>
              </div>
            </div>
      })
     }

            </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-xl shadow h-96 sticky top-0 left-0">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Items</span>
              <span>{productData.length}</span>
            </div>

            <div>
              <label className="block text-sm mb-1">Shipping</label>
              <select className="w-full border rounded p-2 text-sm">
                <option>Choose delivery option</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Promo Code</label>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Enter your code"
                  className="flex-grow border rounded-l p-2 text-sm"
                />
                <button className="bg-yellow-400 text-white px-4 rounded-r">
                  APPLY
                </button>
              </div>
            </div>

            <div className="flex justify-between text-lg font-semibold">
              <span>Total Cost</span>
              <span>${TotalPrice}</span>
            </div>

            <button onClick={handleOrder} className="w-full bg-yellow-400 text-black py-2 rounded-xl hover:bg-yellow-300">
              CHECKOUT
            </button>
          </div>
        </div>
            </div>

      </div>
  );
}