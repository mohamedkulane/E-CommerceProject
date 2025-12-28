import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiCheckCircle } from "react-icons/fi"

function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        confirmPassword: ""
    })
    const [loading, setLoading] = useState(false)
    const [hoveredField, setHoveredField] = useState(null)

    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!")
            return
        }
        
        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters!")
            return
        }
        
        setLoading(true)
        
        try {
            const { confirmPassword, ...customerData } = formData
            
            const response = await axios.post("http://localhost:7000/create/customer", customerData)
            
            toast.success("🎉 Registration successful! Please login.")
            setTimeout(() => navigate("/login"), 2000)
        } catch (error) {
            toast.error(error.response?.data?.error || "Registration failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const getFieldIcon = (fieldName) => {
        switch(fieldName) {
            case 'name': return <FiUser className="text-[#1B5E20]" />;
            case 'email': return <FiMail className="text-[#1B5E20]" />;
            case 'phone': return <FiPhone className="text-[#1B5E20]" />;
            case 'address': return <FiMapPin className="text-[#1B5E20]" />;
            case 'password': return <FiLock className="text-[#1B5E20]" />;
            case 'confirmPassword': return <FiCheckCircle className="text-[#1B5E20]" />;
            default: return null;
        }
    }

    const formFields = [
        { id: 'name', label: 'Full Name', placeholder: 'Enter your full name', colSpan: 'col-span-2' },
        { id: 'email', label: 'Email Address', placeholder: 'Enter your email', colSpan: 'col-span-2' },
        { id: 'phone', label: 'Phone Number', placeholder: 'Enter your phone number', colSpan: 'col-span-1' },
        { id: 'address', label: 'Address', placeholder: 'Enter your address', colSpan: 'col-span-1' },
        { id: 'password', label: 'Password', placeholder: 'Create a password', colSpan: 'col-span-1' },
        { id: 'confirmPassword', label: 'Confirm Password', placeholder: 'Confirm your password', colSpan: 'col-span-1' },
    ]

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f9f0] via-white to-[#fff8f0] p-4">
            <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-3xl">
                <div className="md:flex">
                    {/* Left Decorative Panel */}
                    <div className="hidden md:block md:w-2/5 bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] p-10 flex flex-col justify-center text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full translate-y-20 -translate-x-20"></div>
                        
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
                            <p className="text-white/90 mb-8 leading-relaxed">
                                Create your account and start shopping with exclusive benefits, personalized recommendations, and secure transactions.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                                        <span className="text-sm font-bold">1</span>
                                    </div>
                                    <span>Fast & secure registration</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                                        <span className="text-sm font-bold">2</span>
                                    </div>
                                    <span>Personalized shopping experience</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                                        <span className="text-sm font-bold">3</span>
                                    </div>
                                    <span>Exclusive member discounts</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-12 text-white/70 text-sm relative z-10">
                            <p>Already have an amazing account?</p>
                            <button 
                                onClick={() => navigate("/login")}
                                className="mt-2 px-6 py-2 bg-white/20 rounded-full font-medium hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
                            >
                                Sign in here
                            </button>
                        </div>
                    </div>
                    
                    {/* Right Form Panel */}
                    <div className="md:w-3/5 p-10">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold mb-2" style={{ color: '#1B5E20' }}>
                                Create Account
                            </h1>
                            <p className="text-gray-600">Fill in your details to get started</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {formFields.map((field) => (
                                    <div 
                                        key={field.id} 
                                        className={`${field.colSpan} transform transition-all duration-300 ${hoveredField === field.id ? 'scale-[1.02]' : ''}`}
                                        onMouseEnter={() => setHoveredField(field.id)}
                                        onMouseLeave={() => setHoveredField(null)}
                                    >
                                        <label className="block text-sm font-semibold mb-2 flex items-center" htmlFor={field.id} style={{ color: '#1B5E20' }}>
                                            {getFieldIcon(field.id)}
                                            <span className="ml-2">{field.label}</span>
                                        </label>
                                        <input
                                            id={field.id}
                                            name={field.id}
                                            type={field.id.includes('password') ? 'password' : 'text'}
                                            required
                                            value={formData[field.id]}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border-2 px-4 py-3 pl-12 outline-none transition-all duration-300 focus:shadow-lg"
                                            style={{
                                                borderColor: hoveredField === field.id ? '#1B5E20' : '#e5e7eb',
                                                backgroundColor: '#f9f9f9',
                                                '--tw-ring-color': '#1B5E20'
                                            }}
                                            placeholder={field.placeholder}
                                        />
                                        <div className="absolute left-4 top-11 text-gray-400">
                                            {getFieldIcon(field.id)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 transform transition-all duration-500 hover:scale-[1.01]">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 px-6 rounded-xl text-white font-semibold text-lg shadow-lg transition-all duration-500 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-lg relative overflow-hidden group"
                                    style={{ 
                                        background: loading 
                                            ? '#ccc' 
                                            : 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)'
                                    }}
                                >
                                    <span className="relative z-10 flex items-center justify-center">
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Creating Your Account...
                                            </>
                                        ) : (
                                            <>
                                                <span className="mr-2">🚀</span>
                                                Create My Account
                                            </>
                                        )}
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                </button>
                            </div>

                            <div className="text-center pt-6 border-t border-gray-100 md:hidden">
                                <p className="text-gray-600">
                                    Already have an account?{" "}
                                    <button 
                                        onClick={() => navigate("/login")}
                                        className="font-semibold hover:underline transition-all duration-200"
                                        style={{ color: '#1B5E20' }}
                                    >
                                        Sign in here
                                    </button>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            
            <ToastContainer 
                position="top-right" 
                autoClose={3000}
                toastStyle={{
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
                    color: 'white',
                    boxShadow: '0 10px 25px rgba(27, 94, 32, 0.3)'
                }}
                progressStyle={{
                    background: 'linear-gradient(to right, #FF9800, #F57C00)'
                }}
            />
        </div>
    )
}

export default Register