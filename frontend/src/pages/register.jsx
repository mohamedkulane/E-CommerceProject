import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"


function Register() {
    const[customerName, setCustomer] = useState("")
    const[email, setEmail] = useState("")
    const[phone, setPhone] = useState("")
    const[address, setAddress] = useState("")
    const[password, setPassword]= useState("")
    const [active,setActive]=useState("Customer")

    const navigate = useNavigate()

    function handleInsert(e) {
        e.preventDefault()
        const URl= active==="Customer"?"http://localhost:7000/create/customer":"http://localhost:7000/create/admin"
        const payLoad= active==="Customer"? {name:customerName, phone:phone, email:email, address:address, password:password} :{name:customerName, email:email, password:password}
        axios.post(URl, payLoad).then((res)=> {
            
            toast.success(`${active} registration  succesfully`)
            setTimeout(() => navigate("/login"), 1500)

        }).catch((error) => {
          if(error){
            toast.error("invalid email or password")
          }
        })
    }

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 p-6">
      <div className="w-full max-w-sm  bg-white rounded-2xl shadow p-6 mt-4">
        <div className="flex justify-center gap-8 mb-2">
          <button onClick={()=>setActive("Customer")} className={`px-12 py-2 rounded-xl ${active=== "Customer"?"bg-blue-500 text-white":"border-2 border-black"} `}>Customer</button>
          <button onClick={()=>setActive("Admin")} className={`px-12 py-2 rounded-xl ${active=== "Admin"?"bg-blue-500 text-white":"border-2 border-black"} `}>Admin</button>
        </div>
        <h2 className="text-2xl font-semibold tracking-tight mb-1 text-center">Register</h2>

        <form className="space-y-2 ">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              {active==="Customer"?"Customer Name":"Admin Name"}
            </label>
            <input value={customerName} onChange={(e) => setCustomer(e.target.value)}
              id="name"
              name="name"
              className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-400"
             
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input value={email} onChange={(e) => setEmail(e.target.value)}
              
              id="email"
              type="email"
              name="email"
              className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-400"
              
            />
          </div>
          <div style={{display:active !=="Customer"?"none": ""}}>
             <label className="block text-sm font-medium mb-1" htmlFor="email">
              Address
            </label>
            <input value={address} onChange={(e) => setAddress(e.target.value)} type="text" className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-400" />
          </div>

          <div  style={{display:active !=="Customer"?"none": ""}}>
            <label className="block text-sm font-medium mb-1" htmlFor="phone">
              Phone
            </label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)}
              
              id="phone"
              name="phone"
              className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-400"
              
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              Password
            </label>
            <input value={password} onChange={(e) => setPassword(e.target.value)}
              id="password"
              type="password"
              name="password"
              className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-400"
             
            />
          </div>

          <button onClick={ handleInsert}
            type="submit"
            className="w-full rounded-xl bg-yellow-400 px-4 py-2 text-black font-medium hover:bg-yellow-200"
          >
            {active==="Customer"?"Register Customer":"Register Admin"}
          </button>
        </form>

        
      </div>
      <ToastContainer  position="top-right" autoClose={3000} />
    </div>
  )
}

export default Register