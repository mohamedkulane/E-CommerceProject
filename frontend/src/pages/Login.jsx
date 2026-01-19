import axios from "axios"
import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    useEffect(() => {
        const errorType = searchParams.get('error')
        
        if (errorType === 'admin_required') {
            toast.warning("Admin access required! Please login with admin credentials.")
        }
        
        if (errorType === 'not_admin') {
            toast.error("You don't have admin privileges!")
        }
    }, [searchParams])

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        
        try {
            // Isku day admin login marka hore
            try {
                const adminResponse = await axios.post("http://localhost:7000/login/admin", { 
                    email, 
                    password 
                })
                
                // Hubi in uu admin yahay
                const adminRole = adminResponse.data.Admin?.role || 
                                 adminResponse.data.admin?.role || 
                                 adminResponse.data.role;
                
                if (adminRole === "admin") {
                    // Waa admin, Dashboard u gudbo
                    const adminData = {
                        token: adminResponse.data.token,
                        Admin: {
                            name: adminResponse.data.Admin?.name || adminResponse.data.admin?.name,
                            email: adminResponse.data.Admin?.email || adminResponse.data.admin?.email,
                            role: adminRole
                        }
                    };
                    
                    localStorage.setItem("Admin", JSON.stringify(adminData));
                    localStorage.removeItem("customer"); // Hubi in customer session-ka la tirtiro
                    
                    toast.success("Admin login successful!")
                    setTimeout(() => navigate("/dashboard"), 1500)
                    return
                }
            } catch (adminError) {
                // Admin login-ku khalad, sii wad customer login
            }
            
            // Hadii admin login-ku shaqayn, customer login isku day
            const customerResponse = await axios.post("http://localhost:7000/login/customer", { 
                email, 
                password 
            })
            
            const customerData = {
                token: customerResponse.data.token,
                data: customerResponse.data.customer || customerResponse.data.Customer
            };
            
            localStorage.setItem("customer", JSON.stringify(customerData));
            localStorage.removeItem("Admin"); // Hubi in admin session-ka la tirtiro
            
            toast.success("Customer login successful!")
            setTimeout(() => navigate("/"), 1500)
            
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
                        Enter your credentials to access your account
                    </p>
                </div>
                
                {/* HAL FORM KA KELIYA */}
                <form className="space-y-6" onSubmit={handleLogin}>
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
                            backgroundColor: loading ? '#ccc' : '#1B5E20',
                            backgroundImage: loading ? 'none' : 'linear-gradient(to right, #1B5E20, #2E7D32)'
                        }}
                        onMouseOver={(e) => !loading && (e.target.style.backgroundImage = 'linear-gradient(to right, #2E7D32, #388E3C)')}
                        onMouseOut={(e) => !loading && (e.target.style.backgroundImage = 'linear-gradient(to right, #1B5E20, #2E7D32)')}
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
                            'Sign In'
                        )}
                    </button>
                    
                    {/* Registration Link */}
                    <div className="text-center pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <a 
                                href="/customerRegis" 
                                className="font-semibold hover:underline transition-all duration-200"
                                style={{ color: '#1B5E20' }}
                            >
                                Register here
                            </a>
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