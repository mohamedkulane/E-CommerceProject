import axios from "axios"
import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [active, setActive] = useState("Customer")
    const [loading, setLoading] = useState(false)
    
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    useEffect(() => {
        const errorType = searchParams.get('error')
        
        if (errorType === 'admin_required') {
            toast.warning("Admin access required! Please login as admin.")
            setActive("Admin")
        }
        
        if (errorType === 'not_admin') {
            toast.error("This account is not an admin! Please login with a valid admin account.")
            setActive("Admin")
        }
    }, [searchParams])

    const handleInsert = async (e) => {
        e.preventDefault()
        setLoading(true)
        
        try {
            const URL = active === "Customer" 
                ? "http://localhost:7000/login/customer" 
                : "http://localhost:7000/login/admin"
            
            const response = await axios.post(URL, { email, password })
            
            if (active === "Customer") {
                const customerData = {
                    token: response.data.token,
                    data: response.data.customer || response.data.Customer
                };
                
                localStorage.setItem("customer", JSON.stringify(customerData));
                
                toast.success("Customer login successful!")
                setTimeout(() => navigate("/"), 1500)
            } else {
                const adminRole = response.data.Admin?.role || 
                                 response.data.admin?.role || 
                                 response.data.role;
                
                const adminData = {
                    token: response.data.token,
                    Admin: {
                        name: response.data.Admin?.name || response.data.admin?.name,
                        email: response.data.Admin?.email || response.data.admin?.email,
                        role: adminRole || "admin"
                    }
                };
                
                localStorage.setItem("Admin", JSON.stringify(adminData));
                
                toast.success("Admin login successful!")
                setTimeout(() => navigate("/dashboard"), 1500)
            }
        } catch (error) {
            if (error.response?.status === 400) {
                toast.error(error.response.data.error || "Invalid email or password.")
            } else {
                toast.error("Login failed. Please try again.")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen grid place-items-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold tracking-tight" style={{ color: '#1B5E20' }}>
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-gray-600">
                        Access your customer or admin dashboard
                    </p>
                </div>
                
                {/* Tab Selection */}
                <div className="flex mb-8 bg-gray-100 rounded-xl p-1">
                    <button
                        onClick={() => setActive("Customer")}
                        className={`flex-1 py-3 rounded-lg font-medium text-center transition-all duration-300 ${
                            active === "Customer" 
                                ? "bg-white shadow-md transform scale-[1.02]" 
                                : "hover:bg-gray-50"
                        }`}
                        style={{ 
                            color: active === "Customer" ? '#1B5E20' : '#666',
                            fontWeight: active === "Customer" ? '600' : '500'
                        }}
                    >
                        Customer
                    </button>
                    <button
                        onClick={() => setActive("Admin")}
                        className={`flex-1 py-3 rounded-lg font-medium text-center transition-all duration-300 ${
                            active === "Admin" 
                                ? "bg-white shadow-md transform scale-[1.02]" 
                                : "hover:bg-gray-50"
                        }`}
                        style={{ 
                            color: active === "Admin" ? '#1B5E20' : '#666',
                            fontWeight: active === "Admin" ? '600' : '500'
                        }}
                    >
                        Admin
                    </button>
                </div>
                
                <form className="space-y-6" onSubmit={handleInsert}>
                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="email" style={{ color: '#1B5E20' }}>
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border px-4 py-3 outline-none transition-all duration-200 focus:ring-2 focus:ring-offset-1"
                            style={{
                                borderColor: '#1B5E20',
                                backgroundColor: '#f9f9f9',
                                '--tw-ring-color': '#1B5E20'
                            }}
                            placeholder="Enter your email address"
                        />
                    </div>
                    
                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="password" style={{ color: '#1B5E20' }}>
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border px-4 py-3 outline-none transition-all duration-200 focus:ring-2 focus:ring-offset-1"
                            style={{
                                borderColor: '#1B5E20',
                                backgroundColor: '#f9f9f9',
                                '--tw-ring-color': '#1B5E20'
                            }}
                            placeholder="Enter your password"
                        />
                    </div>
                    
                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg px-4 py-3 text-white font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        style={{ 
                            backgroundColor: loading ? '#ccc' : '#FF9800',
                            backgroundImage: loading ? 'none' : 'linear-gradient(to right, #FF9800, #F57C00)'
                        }}
                        onMouseOver={(e) => !loading && (e.target.style.backgroundImage = 'linear-gradient(to right, #F57C00, #E65100)')}
                        onMouseOut={(e) => !loading && (e.target.style.backgroundImage = 'linear-gradient(to right, #FF9800, #F57C00)')}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing in...
                            </span>
                        ) : (
                            `Sign in as ${active}`
                        )}
                    </button>
                    
                    {/* Registration Link */}
                    <div className="text-center pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                            {active === "Customer" ? (
                                <>
                                    Don't have an account?{" "}
                                    <a 
                                        href="/customerRegis" 
                                        className="font-semibold hover:underline transition-all duration-200"
                                        style={{ color: '#1B5E20' }}
                                    >
                                        Register here
                                    </a>
                                </>
                            ) : (
                                <span className="text-gray-500 italic">
                                    Admin accounts are pre-configured
                                </span>
                            )}
                        </p>
                    </div>
                </form>
            </div>
            <ToastContainer 
                position="top-right" 
                autoClose={3000}
                toastStyle={{
                    borderRadius: '10px',
                    background: '#1B5E20',
                    color: 'white'
                }}
            />
        </div>
    )
}

export default Login