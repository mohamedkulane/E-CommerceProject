import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaBoxOpen,
  FaCheckCircle,
  FaExclamationTriangle,
  FaFilter,
  FaSortAmountDown,
  FaEye,
  FaTimes
} from "react-icons/fa";

export default function ProductsPage() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  function handleRead() {
    setLoading(true);
    axios
      .get("http://localhost:7000/read/ProductPost")
      .then((res) => {
        setData(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    handleRead();
  }, []);

  function handleDelete(id) {
    if (window.confirm("Ma hubtaa inaad masaxi doonto product-kan?")) {
      const adminData = JSON.parse(localStorage.getItem("Admin"));

      if (!adminData || !adminData.token) {
        alert("Fadlan dib u soo geli admin ahaan!");
        window.location.href = "/login";
        return;
      }

      const token = adminData.token;

      axios
        .delete(`http://localhost:7000/delete/ProductPost/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          handleRead();
          alert("Product successfully deleted!");
        })
        .catch((err) => {
          console.error("Delete error:", err);
          let errorMessage = "Failed to delete product. Please try again.";

          if (err.response) {
            switch (err.response.status) {
              case 401:
                errorMessage = "Unauthorized. Please login again.";
                localStorage.removeItem("Admin");
                setTimeout(() => (window.location.href = "/login"), 2000);
                break;
              case 403:
                errorMessage = "Access denied. Admin privileges required.";
                break;
              case 500:
                errorMessage = "Server error. Please try again later.";
                break;
            }
          }
          alert(errorMessage);
        });
    }
  }

  const getProductStatus = (quantity) => {
    if (quantity > 0) return "available";
    if (quantity === 0) return "out-of-stock";
    return "out-of-stock";
  };

  const getStatusInfo = (product) => {
    const quantity = product.quantity || 0;
    const status = product.status || getProductStatus(quantity);
    const normalizedStatus = status.toLowerCase().replace(/\s+/g, "-");

    if (normalizedStatus.includes("avail") || quantity > 0) {
      return {
        text: "Available",
        color: "bg-gradient-to-r from-green-50 to-emerald-50 text-emerald-700 border border-emerald-200",
        icon: <FaCheckCircle className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />,
        quantityColor: "text-emerald-600 font-semibold",
        badgeColor: "bg-emerald-100 text-emerald-800",
        isAvailable: true,
        bgColor: "bg-gradient-to-r from-emerald-500 to-green-500",
      };
    } else if (normalizedStatus.includes("low") || quantity <= 5) {
      return {
        text: "Low Stock",
        color: "bg-gradient-to-r from-yellow-50 to-orange-50 text-orange-700 border border-orange-200",
        icon: <FaExclamationTriangle className="w-3.5 h-3.5 mr-1.5 text-orange-500" />,
        quantityColor: "text-orange-600 font-semibold",
        badgeColor: "bg-orange-100 text-orange-800",
        isAvailable: false,
        bgColor: "bg-gradient-to-r from-orange-400 to-yellow-500",
      };
    } else {
      return {
        text: "Out of Stock",
        color: "bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border border-red-200",
        icon: <FaBoxOpen className="w-3.5 h-3.5 mr-1.5 text-red-500" />,
        quantityColor: "text-red-600 font-semibold",
        badgeColor: "bg-red-100 text-red-800",
        isAvailable: false,
        bgColor: "bg-gradient-to-r from-red-500 to-pink-500",
      };
    }
  };

  // Get all unique categories
  const categories = ["All", ...new Set(data.map(item => item.category || "Uncategorized"))];

  // Get filtered and sorted data
  const filteredData = data
    .filter((item) => {
      const matchesSearch = 
        item.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.category?.toLowerCase().includes(search.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === "All" || 
        (item.category || "Uncategorized") === selectedCategory;
      
      const statusInfo = getStatusInfo(item);
      const matchesStatus = 
        selectedStatus === "All" || 
        statusInfo.text === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return (a.name || "").localeCompare(b.name || "");
        case "name-desc":
          return (b.name || "").localeCompare(a.name || "");
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "quantity-low":
          return (a.quantity || 0) - (b.quantity || 0);
        case "quantity-high":
          return (b.quantity || 0) - (a.quantity || 0);
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory("All");
    setSelectedStatus("All");
    setSortBy("newest");
    setSearch("");
  };

  // Calculate stats
  const stats = {
    total: data.length,
    available: data.filter(item => (item.quantity || 0) > 0).length,
    outOfStock: data.filter(item => (item.quantity || 0) === 0).length,
    lowStock: data.filter(item => (item.quantity || 0) > 0 && (item.quantity || 0) <= 5).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Products</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <FaBoxOpen className="w-5 h-5" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Available</p>
                <p className="text-2xl font-bold">{stats.available}</p>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <FaCheckCircle className="w-5 h-5" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Low Stock</p>
                <p className="text-2xl font-bold">{stats.lowStock}</p>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <FaExclamationTriangle className="w-5 h-5" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Out of Stock</p>
                <p className="text-2xl font-bold">{stats.outOfStock}</p>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <FaBoxOpen className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Header Section */}
        <div className="mb-6 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Products Management
              </h1>
              <p className="text-gray-600 mt-1">
                {loading ? "Loading..." : `Showing ${filteredData.length} of ${data.length} products`}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2"
              >
                <FaFilter />
                Filter
              </button>
              
              <Link to="/dashboard/AddProduct">
                <button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg">
                  <FaPlus />
                  Add Product
                </button>
              </Link>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedCategory !== "All" || selectedStatus !== "All" || search || sortBy !== "newest") && (
            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600">Active filters:</span>
              {selectedCategory !== "All" && (
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory("All")} className="ml-1">
                    <FaTimes className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedStatus !== "All" && (
                <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                  Status: {selectedStatus}
                  <button onClick={() => setSelectedStatus("All")} className="ml-1">
                    <FaTimes className="w-3 h-3" />
                  </button>
                </span>
              )}
              {search && (
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  Search: "{search}"
                  <button onClick={() => setSearch("")} className="ml-1">
                    <FaTimes className="w-3 h-3" />
                  </button>
                </span>
              )}
              {sortBy !== "newest" && (
                <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                  Sorted
                  <button onClick={() => setSortBy("newest")} className="ml-1">
                    <FaTimes className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-red-600 hover:text-red-700 ml-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Filter Panel */}
          {filterOpen && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="All">All Status</option>
                    <option value="Available">Available</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaSortAmountDown className="inline mr-2" />
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="name-asc">Name A-Z</option>
                    <option value="name-desc">Name Z-A</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="quantity-low">Quantity: Low to High</option>
                    <option value="quantity-high">Quantity: High to Low</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-sm">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : (
          /* Products Grid */
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {filteredData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                      <th className="px-6 py-4 text-left font-semibold text-sm">#</th>
                      <th className="px-6 py-4 text-left font-semibold text-sm">Product</th>
                      <th className="px-6 py-4 text-left font-semibold text-sm">Category</th>
                      <th className="px-6 py-4 text-left font-semibold text-sm">Quantity</th>
                      <th className="px-6 py-4 text-left font-semibold text-sm">Price</th>
                      <th className="px-6 py-4 text-left font-semibold text-sm">Status</th>
                      <th className="px6 py-4 text-left font-semibold text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredData.map((item, index) => {
                      const statusInfo = getStatusInfo(item);

                      return (
                        <tr
                          key={item._id}
                          className="hover:bg-gray-50 transition-colors duration-150 group"
                        >
                          <td className="px-6 py-4">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center text-gray-700 font-semibold">
                              {index + 1}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 group-hover:shadow-md transition-shadow">
                                {item.prImage ? (
                                  <img
                                    src={`http://localhost:7000/Allimages/${item.prImage}`}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='12' fill='%239ca3af' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                    <FaBoxOpen className="w-6 h-6 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-800 group-hover:text-emerald-700 transition-colors">
                                  {item.name}
                                </h3>
                                <p className="text-xs text-gray-500 truncate max-w-xs">
                                  {item.desc || "No description"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-200">
                              {item.category || "Uncategorized"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className={`text-lg font-bold ${statusInfo.quantityColor}`}>
                                {item.quantity}
                              </span>
                              {item.quantity <= 5 && item.quantity > 0 && (
                                <span className={`text-xs px-2 py-1 rounded-full ${statusInfo.badgeColor}`}>
                                  Low
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-gray-800">
                              ${parseFloat(item.price || 0).toFixed(2)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${statusInfo.color}`}>
                              {statusInfo.icon}
                              {statusInfo.text}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <Link
                                to={`/dashboard/update/${item._id}`}
                                className="bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-600 p-2.5 rounded-lg transition-all duration-200 hover:shadow-sm border border-blue-200"
                                title="Edit Product"
                              >
                                <FaEdit className="w-4 h-4" />
                              </Link>
                              <Link
                                to={`/product/${item._id}`}
                                className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-600 p-2.5 rounded-lg transition-all duration-200 hover:shadow-sm border border-gray-200"
                                title="View Details"
                              >
                                <FaEye className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => handleDelete(item._id)}
                                className="bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-red-600 p-2.5 rounded-lg transition-all duration-200 hover:shadow-sm border border-red-200"
                                title="Delete Product"
                                disabled={loading}
                              >
                                <FaTrash className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-300 mb-6">
                  <FaBoxOpen className="w-20 h-20 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-3">
                  {search || selectedCategory !== "All" || selectedStatus !== "All" 
                    ? "No matching products found" 
                    : "No products yet"}
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  {search || selectedCategory !== "All" || selectedStatus !== "All"
                    ? "Try adjusting your search terms or filters"
                    : "Start building your product catalog by adding your first product"}
                </p>
                <Link to="/dashboard/AddProduct">
                  <button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto transition-all duration-200 shadow-md hover:shadow-lg">
                    <FaPlus />
                    Add Your First Product
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} E-Commerce Dashboard • 
            <span className="mx-2">•</span>
            <span className="text-emerald-600 font-medium">
              {filteredData.length} products displayed
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}