import { Link, useLocation } from "react-router-dom";
import {
  FaShoppingCart,
  FaUser,
  FaHome,
  FaInfoCircle,
  FaShoppingBag,
  FaTags,
  FaPhone,
  FaSignOutAlt,
  FaUserPlus,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useState, useEffect } from "react";

export default function Header() {
  const getCustomer = localStorage.getItem("customer");
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { name: "Home", path: "/", icon: <FaHome /> },
    { name: "Products", path: "/products", icon: <FaShoppingBag /> },
    { name: "Categories", path: "/categories", icon: <FaTags /> },
    { name: "Contact", path: "/contact", icon: <FaPhone /> },
  ];

  return (
    <header
      className={`sticky top-0 z-50 bg-gradient-to-r from-green-900 to-green-800 shadow-xl transition-all duration-300 ${
        isScrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link
            to="/"
            className="flex items-center space-x-2 md:space-x-3 group flex-shrink-0"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl md:text-2xl font-bold">
                AM
              </span>
            </div>
            <div className="hidden xs:block">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white whitespace-nowrap">
                Apo Market
              </h1>
              <p className="text-green-200 text-xs md:text-sm">
                Quality Shopping Experience
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 mx-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive(item.path)
                    ? "bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg"
                    : "text-green-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
            {/* Cart Button */}
            <Link to="/cart" className="flex-shrink-0">
              <button className="relative px-3 py-2 md:px-4 md:py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 text-white font-medium hover:from-orange-600 hover:to-orange-500 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-1 md:space-x-2 group">
                <FaShoppingCart className="text-base md:text-lg" />
                <span className="hidden xs:inline">Cart</span>
              </button>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>

            {/* User Section */}
            {getCustomer ? (
              <div className="hidden lg:flex items-center space-x-4">
                {/* User Avatar */}
                <div className="relative group">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer border-2 border-white">
                    <FaUser className="text-white text-lg md:text-xl" />
                  </div>
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                    <div className="p-4 border-b border-gray-100">
                      <p className="font-bold text-gray-800">Welcome!</p>
                      <p className="text-sm text-gray-600 truncate">
                        {/* {JSON.parse(getCustomer).data?.customer.email || "User"} */}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 p-4 text-red-600 hover:bg-red-50 rounded-b-xl transition-colors"
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-3">
                <Link to="/login">
                  <button className="px-4 py-3 rounded-xl bg-white text-green-700 font-medium hover:bg-green-50 border-2 border-green-600 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2">
                    <FaUser className="text-lg" />
                    <span>Login</span>
                  </button>
                </Link>
                <Link to="/customerRegis">
                  <button className="px-4 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white font-medium hover:from-green-700 hover:to-green-600 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2">
                    <FaUserPlus className="text-lg" />
                    <span>Register</span>
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`lg:hidden mt-4 transition-all duration-300 ${
            isMobileMenuOpen
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 space-y-2">
            {/* Desktop-like navigation for medium screens */}
            <div className="md:flex md:flex-wrap md:gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                    isActive(item.path)
                      ? "bg-green-600 text-white"
                      : "text-green-100 hover:bg-white/20"
                  } md:flex-1 md:min-w-[150px]`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              ))}
            </div>

            {/* User Actions for Mobile */}
            <div className="pt-4 border-t border-white/20">
              {getCustomer ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/10 text-white">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <FaUser className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {/* {JSON.parse(getCustomer).data?.customer.email || "User"} */}
                      </p>
                      <p className="text-xs text-green-200">Welcome!</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg bg-white text-green-700 font-medium hover:bg-green-50 border-2 border-green-600 transition-colors">
                      <FaUser />
                      <span>Login</span>
                    </button>
                  </Link>
                  <Link
                    to="/customerRegis"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <button className="w-full flex items-center justify-center space-x-2 p-3 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white font-medium hover:from-green-700 hover:to-green-600 transition-colors">
                      <FaUserPlus />
                      <span>Register</span>
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>


      </div>
    </header>
  );
}
