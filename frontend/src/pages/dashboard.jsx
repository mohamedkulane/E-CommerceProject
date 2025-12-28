import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  LogOut,
  Home,
  Plus,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Settings,
  Bell,
  Search,
  Moon,
  Sun,
  User,
  Sparkles,
  Store,
  TrendingUp,
  CreditCard,
  Shield
} from "lucide-react";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activePath, setActivePath] = useState("/dashboard");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem("Admin");
    navigate("/login");
  };

  const navItems = [
    { path: "/dashboard/products", icon: Package, label: "Products", color: "text-emerald-500" },
    { path: "/dashboard/customers", icon: Users, label: "Customers", color: "text-purple-500" },
    { path: "/dashboard/orders", icon: ShoppingCart, label: "Orders", color: "text-orange-500" },
    { path: "/dashboard/reports", icon: BarChart3, label: "Reports", color: "text-pink-500" },
    { path: "/dashboard/AddProduct", icon: Plus, label: "Add Product", color: "text-cyan-500" },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className={`flex h-screen transition-all duration-300 ${darkMode ? 'dark bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`lg:hidden fixed top-6 left-6 z-50 p-3 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 ${
          darkMode 
            ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white' 
            : 'bg-white text-gray-800'
        }`}
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-40 overflow-y-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${sidebarCollapsed ? 'w-20' : 'w-64'}
          bg-gradient-to-b from-gray-900 to-gray-800
          text-white transform transition-all duration-500 ease-in-out
          flex flex-col justify-between
          shadow-2xl
          overflow-hidden
        `}
      >
        {/* Sidebar Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        <div className="relative z-10">
          {/* Logo Section */}
          <div className={`p-6 border-b border-gray-700 ${sidebarCollapsed ? 'px-3' : ''}`}>
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'}`}>
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300">
                <Store className="w-6 h-6 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div className="overflow-hidden transition-all duration-300">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                    E-Commerce
                  </h1>
                  <p className="text-xs text-gray-400 tracking-wider">Admin Pro</p>
                </div>
              )}
            </div>
          </div>

          {/* Collapse Toggle Button */}
          <div className="px-4 py-3 border-b border-gray-700">
            <button
              onClick={toggleCollapse}
              className={`w-full flex items-center justify-center p-2 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors duration-200 ${
                sidebarCollapsed ? 'justify-center' : 'justify-between'
              }`}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              ) : (
                <>
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Collapse</span>
                  <ChevronLeft className="w-4 h-4 text-gray-400" />
                </>
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePath === item.path || activePath.startsWith(item.path + '/');
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center ${sidebarCollapsed ? 'justify-center px-3' : 'px-4'} py-3 rounded-xl
                    transition-all duration-300 group relative overflow-hidden
                    ${isActive 
                      ? 'bg-gradient-to-r from-gray-800 to-gray-700 shadow-lg' 
                      : 'hover:bg-gray-800/50'
                    }
                  `}
                  onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-orange-500 to-amber-500 rounded-r-full"></div>
                  )}
                  
                  <div className={`flex items-center ${sidebarCollapsed ? '' : 'space-x-3'}`}>
                    <div className={`
                      ${sidebarCollapsed ? 'w-10 h-10' : 'w-9 h-9'} 
                      rounded-lg flex items-center justify-center
                      ${isActive 
                        ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/20' 
                        : 'bg-gray-800/50 group-hover:bg-gray-800'
                      }
                    `}>
                      <Icon className={`${item.color} ${isActive ? 'scale-110' : ''} transition-transform duration-200`} />
                    </div>
                    {!sidebarCollapsed && (
                      <span className="font-medium text-gray-200 group-hover:text-white transition-colors">
                        {item.label}
                      </span>
                    )}
                  </div>
                  
                  {!sidebarCollapsed && isActive && (
                    <Sparkles className="w-4 h-4 text-amber-400 ml-auto animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Section */}
        <div className="relative z-10 p-4 border-t border-gray-700">
        

          {/* User Profile */}
          <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 backdrop-blur-sm">
            
            
            {!sidebarCollapsed && (
              <button 
                onClick={() => navigate("/")}
                className="w-full flex items-center justify-center space-x-2 py-2 mt-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-all duration-300 group border border-gray-600 hover:border-gray-500"
              >
                <Home className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors" />
                <span className="text-sm text-gray-200 group-hover:text-white transition-colors">
                  Visit Store
                </span>
              </button>
            )}
          </div>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className={`
              w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-center space-x-3'} 
              py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 
              rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group
            `}
          >
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
              <LogOut className="w-4 h-4 text-white" />
            </div>
            {!sidebarCollapsed && (
              <span className="font-semibold text-white">Logout</span>
            )}
          </button>
          
         
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-30 transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto transition-all duration-300">
        {/* Top Navigation Bar */}
        <div className={`sticky top-0 z-30 p-4 lg:p-6 border-b ${
          darkMode 
            ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700' 
            : 'bg-white/80 backdrop-blur-sm border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Dashboard Overview
                </h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Welcome back, Administrator!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'} w-4 h-4`} />
                <input
                  type="text"
                  placeholder="Search..."
                  className={`pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    darkMode 
                      ? 'bg-gray-800 text-white border-gray-700' 
                      : 'bg-gray-100 text-gray-800 border-gray-200'
                  } border`}
                />
              </div>

             

              

              {/* User Avatar */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="hidden md:block">
                  <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Admin User
                  </div>
                  <div className="text-xs text-gray-500">Online</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className={`p-4 lg:p-6 min-h-[calc(100vh-80px)] ${
          darkMode 
            ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
            : 'bg-gradient-to-br from-gray-50 to-gray-100'
        }`}>
          <div className={`rounded-2xl  ${
            darkMode 
              ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700' 
              : 'bg-white'
          }`}>
            <Outlet />
          </div>

    

       
        </div>
      </main>
    </div>
  );
}