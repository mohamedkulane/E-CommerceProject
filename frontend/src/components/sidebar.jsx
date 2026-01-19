import { Navigate, useLocation } from "react-router-dom"

function ProtectedRoute({ children, adminOnly = false }) {
    const location = useLocation()
    
    // Hubi hadii adminOnly kaas oo admin loo baahan yahay
    if (adminOnly) {
        const adminData = localStorage.getItem("Admin")
        
        if (!adminData) {
            // Ma admin ahayn, login page u gudbi admin_required error leh
            return <Navigate to="/login?error=admin_required" state={{ from: location }} replace />
        }
        
        try {
            const parsedAdmin = JSON.parse(adminData)
            
            // Hubi role-ka admin-ka
            if (parsedAdmin.Admin?.role !== "admin" && parsedAdmin.role !== "admin") {
                localStorage.removeItem("Admin")
                return <Navigate to="/login?error=not_admin" state={{ from: location }} replace />
            }
            
            return children
        } catch (error) {
            localStorage.removeItem("Admin")
            return <Navigate to="/login?error=admin_required" state={{ from: location }} replace />
        }
    }
    
    // Haddii aan adminOnly ahayn, hubi authentication-ka guud
    const customerData = localStorage.getItem("customer")
    const adminData = localStorage.getItem("Admin")
    
    if (!customerData && !adminData) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }
    
    return children
}

export default ProtectedRoute