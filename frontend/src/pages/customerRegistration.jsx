import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"



function Register() {
    const[customerName, setCustomer] = useState("")
    const[email, setEmail] = useState("")
    const[phone, setPhone] = useState("")
    const[password, setPassword]= useState("")

    const navigate = useNavigate()

    function handleInsert(e) {
        e.preventDefault()
        axios.post("http://localhost:5000/create/customer", {
            name: customerName,
            phone:phone,
            email: email,
            password: password

        }).then(()=>{
          alert("success")
        })
    }

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
        <h2 className="text-2xl font-semibold tracking-tight mb-1">Register</h2>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              Customer Name
            </label>
            <input value={customerName} onChange={(e) => setCustomer(e.target.value)}
              id="name"
              name="name"
              className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-800"
             
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
              className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-800"
              
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="phone">
              Phone
            </label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)}
              
              id="phone"
              name="phone"
              className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-800"
              
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
              className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-800"
             
            />
          </div>

          <button onClick={(e) => handleInsert(e)}
            type="submit"
            className="w-full rounded-xl bg-gray-900 px-4 py-2 text-white font-medium hover:bg-black"
          >
            Register Customer
          </button>
        </form>

        
      </div>
    </div>
  )
}

export default Register