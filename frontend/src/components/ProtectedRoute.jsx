// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    // Ka soo qaad xogta localStorage
    const xogtaMacmiilka = localStorage.getItem("customer");
    const xogtaAdmin = localStorage.getItem("Admin");
    
    console.log("=== 🔍 PROTECTED ROUTE HUBIN === ");
    console.log("1. Xogta macmiilka:", xogtaMacmiilka ? "✓ Jira" : "✗ Ma jiro");
    console.log("2. Xogta admin-ka:", xogtaAdmin ? "✓ Jira" : "✗ Ma jiro");
    
    // Haddii aan login-san
    if (!xogtaMacmiilka && !xogtaAdmin) {
        console.log("⚠️ Qofkaan login-san, login page loo wadi");
        return <Navigate to="/login" />;
    }
    
    // Haddii dashboard-ka admin-ka loo baahan yahay
    if (adminOnly) {
        // Haddii xogta admin-ka aan la helin
        if (!xogtaAdmin) {
            console.log("⚠️ Xogta admin-ka ma jiro, laakiin macmiil waa login-garay");
            return <Navigate to="/login?error=admin_required" />;
        }
        
        try {
            const adminData = JSON.parse(xogtaAdmin);
            console.log("👤 Xogta admin-ka la hubinayo:", adminData);
            
            // Hubi in token jiro
            if (!adminData.token) {
                console.log("❌ Token ma jiro");
                return <Navigate to="/login" />;
            }
            
            // Hubi role-ka admin-ka
            const adminRole = adminData.Admin?.role || adminData.admin?.role || adminData.role;
            console.log("🎭 Role-ka la helay:", adminRole);
            
            if (!adminRole || adminRole.toLowerCase() !== 'admin') {
                console.log(`❌ Role-ka waa '${adminRole}', laakiin waa inuu noqdaa 'admin'`);
                return <Navigate to="/login?error=not_admin" />;
            }
            
            console.log("✅ Admin-ka xaqiijiyay! Dashboard-ka loo ogolaaday");
            return children;
            
        } catch (error) {
            console.error("❌ Khalad marka la fiirinayo xogta admin-ka:", error);
            return <Navigate to="/login" />;
        }
    }
    
    // Haddii aan adminOnly ahayn (customer dashboard)
    return children;
};

export default ProtectedRoute;