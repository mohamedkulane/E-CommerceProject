import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUserTag,
  FaSearch,
  FaFilter,
  FaEye,
  FaEdit,
  FaTrash,
  FaSortAmountDown,
  FaCalendarAlt,
  FaShoppingCart,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // Stats state
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    customers: 0,
    active: 0,
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterAndSortCustomers();
    updateStats();
  }, [customers, search, selectedRole, sortBy]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const adminData = JSON.parse(localStorage.getItem("Admin"));
      const token = adminData?.token;

      const response = await axios.get("http://localhost:7000/read/customer", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      alert("Failed to fetch customers. Please check your admin permissions.");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortCustomers = () => {
    let filtered = [...customers];

    // Apply search filter
    if (search) {
      filtered = filtered.filter(
        (customer) =>
          customer.name?.toLowerCase().includes(search.toLowerCase()) ||
          customer.email?.toLowerCase().includes(search.toLowerCase()) ||
          customer.phone?.includes(search)
      );
    }

    // Apply role filter
    if (selectedRole !== "All") {
      filtered = filtered.filter((customer) => customer.role === selectedRole);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return (a.name || "").localeCompare(b.name || "");
        case "name-desc":
          return (b.name || "").localeCompare(a.name || "");
        case "newest":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case "oldest":
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        default:
          return 0;
      }
    });

    setFilteredCustomers(filtered);
  };

  const updateStats = () => {
    const total = customers.length;
    const admins = customers.filter((c) => c.role === "admin").length;
    const customersCount = customers.filter(
      (c) => c.role === "user" || !c.role
    ).length;
    const active = customers.filter((c) => c.isActive !== false).length;

    setStats({ total, admins, customers: customersCount, active });
  };

  const getStatusBadge = (customer) => {
    if (customer.role === "admin") {
      return {
        bg: "bg-gradient-to-r from-red-100 to-red-50",
        text: "text-red-700",
        border: "border-red-200",
        icon: <FaUserTag className="w-3.5 h-3.5 mr-1.5" />,
      };
    }
    if (customer.isActive === false) {
      return {
        bg: "bg-gradient-to-r from-gray-100 to-gray-50",
        text: "text-gray-700",
        border: "border-gray-200",
        icon: <FaTimesCircle className="w-3.5 h-3.5 mr-1.5" />,
      };
    }
    return {
      bg: "bg-gradient-to-r from-green-100 to-green-50",
      text: "text-green-700",
      border: "border-green-200",
      icon: <FaCheckCircle className="w-3.5 h-3.5 mr-1.5" />,
    };
  };

  const getInitials = (name) => {
    if (!name) return "C";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedRole("All");
    setSortBy("newest");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
            <p className="text-gray-600">Loading customers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Customers</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <FaUser className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Active Users</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <FaCheckCircle className="w-5 h-5" />
              </div>
            </div>
          </div>

  

          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Regular Customers</p>
                <p className="text-2xl font-bold">{stats.customers}</p>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <FaShoppingCart className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Header Section */}
        <div className="mb-6 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Customers Management
              </h1>
              <p className="text-gray-600 mt-1">
                {filteredCustomers.length} of {customers.length} customers
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers..."
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
            </div>
          </div>

          {/* Active Filters */}
          {(selectedRole !== "All" || search || sortBy !== "newest") && (
            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600">Active filters:</span>
              {selectedRole !== "All" && (
                <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                  Role: {selectedRole}
                  <button
                    onClick={() => setSelectedRole("All")}
                    className="ml-1"
                  >
                    <FaTimesCircle className="w-3 h-3" />
                  </button>
                </span>
              )}
              {search && (
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  Search: "{search}"
                  <button onClick={() => setSearch("")} className="ml-1">
                    <FaTimesCircle className="w-3 h-3" />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaUserTag className="inline mr-2" />
                    Filter by Role
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="All">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">Customer</option>
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
                    <option value="oldest">Oldest First</option>
                    <option value="name-asc">Name A-Z</option>
                    <option value="name-desc">Name Z-A</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                  <th className="px-6 py-4 text-left font-semibold text-sm">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-sm">
                    <FaEnvelope className="inline mr-2" />
                    Email
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-sm">
                    <FaPhone className="inline mr-2" />
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-sm">
                    <FaMapMarkerAlt className="inline mr-2" />
                    Location
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-sm">
                    Status
                  </th>
               
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.map((customer) => {
                  const statusBadge = getStatusBadge(customer);
                  const initials = getInitials(customer.name);

                  return (
                    <tr
                      key={customer._id}
                      className="hover:bg-gray-50 transition-colors duration-150 group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                              {initials}
                            </div>
                            {customer.role === "admin" && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                <FaUserTag className="w-2.5 h-2.5 text-white" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800 group-hover:text-emerald-700 transition-colors">
                              {customer.name || "Unnamed Customer"}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <FaCalendarAlt className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                Joined{" "}
                                {customer.createdAt
                                  ? new Date(
                                      customer.createdAt
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FaEnvelope className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">
                            {customer.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FaPhone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700 font-medium">
                            {customer.phone || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">
                            {customer.address || "No address"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
                        >
                          {statusBadge.icon}
                          {customer.role === "admin"
                            ? "Admin"
                            : customer.isActive === false
                            ? "Inactive"
                            : "Active"}
                        </div>
                      </td>
                  
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredCustomers.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                <FaUser className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">
                {search || selectedRole !== "All"
                  ? "No matching customers found"
                  : "No customers found"}
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {search || selectedRole !== "All"
                  ? "Try adjusting your search terms or filters"
                  : "No customers have been registered yet"}
              </p>
              {(search || selectedRole !== "All") && (
                <button
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
          <div>
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {filteredCustomers.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">
              {customers.length}
            </span>{" "}
            customers
          </div>
          <div className="mt-2 sm:mt-0">
            <span className="text-emerald-600 font-medium">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
