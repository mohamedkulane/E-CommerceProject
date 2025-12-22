// Sidebar.jsx
import {
  FaTachometerAlt,
  FaBox,
  FaUsers,
  FaShoppingCart,
  FaChartBar,
  FaCog,
  FaChevronRight
} from "react-icons/fa"
import { Link ,Outlet} from "react-router-dom"

export default function Sidebar() {
    const getCustomer=localStorage.getItem("Admin")
  return <div className="flex gap-4">
    
    <aside className="h-screen w-60 bg-black text-white flex flex-col shadow-lg sticky top-0 left-0">
     <div className="flex gap-3 mt-12">
        <h1 className="bg-white w-10 h-10 rounded-full text-black text-center text-2xl pt-1 cursor-pointer font-semibold hover:bg-yellow-400 hover:text-black">moha</h1>
       <h1 className="font-bold text-2xl text-white"></h1>
        </div>
        <FaChevronRight className="text-xl opacity-80 absolute right-4 top-2" />
  

      {/* Menu */}
      <nav className="flex-1 px-3 py-3 space-y-6 ">
        <div className="flex items-center gap-3 px-3 py-1 rounded-md text-sm font-medium hover:bg-yellow-400 hover:text-black cursor-pointer transition">
          <FaTachometerAlt className="text-lg" />
          <span className="flex-1 text-xl">Dashboard</span>
        </div>

        <div className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-yellow-400 hover:text-black cursor-pointer transition">
          <FaBox className="text-lg" />
         <Link to="products"> <span className="flex-1 text-xl">Products</span></Link>
        </div>

        <div className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-yellow-400 hover:text-black cursor-pointer transition">
          <FaUsers className="text-lg" />
          <Link to="customers"><span className="flex-1 text-xl">Customers</span></Link>
        </div>

        <div className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-yellow-400 hover:text-black cursor-pointer transition">
          <FaShoppingCart className="text-lg" />
          <Link to="orders"><span className="flex-1 text-xl">Orders</span></Link>
        </div>

        <div className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-yellow-400 hover:text-black cursor-pointer transition">
          <FaChartBar className="text-lg" />
         <Link to="reports"> <span className="flex-1 text-xl">Reports</span></Link>
        </div>

        <div className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-yellow-400 hover:text-black cursor-pointer transition">
          <FaCog className="text-lg" />
          <span className="flex-1 text-xl">Settings</span>
        </div>
      </nav>
      {/* Footer */}
    
    </aside>
    <Outlet/>
  </div>
}
