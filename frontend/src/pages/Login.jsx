import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"


function Login() {
    const[email, setEmail] = useState("")
    const[password, setPassword]= useState("")
    const [active,setActive]=useState("Customer")

    const navigate = useNavigate()

    function handleInsert(e) {
        e.preventDefault()
        const URl= active==="Customer"?"http://localhost:7000/login/customer":"http://localhost:7000/login/admin"
        const payLoad= active==="Customer"? { email:email,  password:password} :{ email:email, password:password}
        axios.post(URl,payLoad).then((res)=> {
            
            toast.success("Login succesfully")
            setTimeout(() => navigate( active==="Customer"?"/" :"/dashboard"), 1500)
            localStorage.setItem( active==="Customer"?"customer":"Admin", JSON.stringify(res))
        }).catch((error) => {
          if(error){
            toast.error("invalid email or password")
          }
        })
    }

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
        <div className="flex justify-center gap-8 mb-2">
          <button onClick={()=>setActive("Customer")} className={`px-12 py-2 rounded-xl ${active=== "Customer"?"bg-blue-500 text-white":"border-2 border-black"} `}>Customer</button>
          <button onClick={()=>setActive("Admin")} className={`px-12 py-2 rounded-xl ${active=== "Admin"?"bg-blue-500 text-white":"border-2 border-black"} `}>Admin</button>
        </div>
        <h2 className="text-2xl font-semibold tracking-tight mb-1 text-center">Customer Login</h2>

        <form className="space-y-4">
     

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
           {active==="Customer"?" Login Customer":" Login Admin"}
          </button>
        </form>

        
      </div>
      <ToastContainer  position="top-right" autoClose={3000} />
    </div>
  )
}

export default Login