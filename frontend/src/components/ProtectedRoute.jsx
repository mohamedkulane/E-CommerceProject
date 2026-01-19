// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom"

function ProtectedRoute({ children, adminOnly = false }) {
    const location = useLocation()
    
    // Haddii adminOnly = true (Dashboard)
    if (adminOnly) {
        const adminData = localStorage.getItem("Admin")
        
        if (!adminData) {
            // Ma admin ahayn, login page u gudbi
            return <Navigate to="/login?error=admin_required" state={{ from: location }} replace />
        }
        
        try {
            const parsedAdmin = JSON.parse(adminData)
            const userRole = parsedAdmin.Admin?.role || parsedAdmin.role
            
            if (userRole !== "admin") {
                localStorage.removeItem("Admin")
                return <Navigate to="/login?error=not_admin" state={{ from: location }} replace />
            }
            
            return children
        } catch (error) {
            localStorage.removeItem("Admin")
            return <Navigate to="/login" state={{ from: location }} replace />
        }
    }
    
    return children
}

export default ProtectedRoute