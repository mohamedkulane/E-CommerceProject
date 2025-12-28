import { useEffect, useState } from "react";
import axios from "axios";
import {
  RefreshCw,
  Package,
  CheckCircle,
  Truck,
  XCircle,
  Eye,
  Edit,
  AlertCircle,
  Calendar,
  DollarSign,
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingCart,
  Search,
  Filter,
  ChevronDown,
  MoreVertical,
  BarChart3,
  Clock,
  ShieldCheck,
  TrendingUp,
  Download,
  Printer
} from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusNote, setStatusNote] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      
      const adminData = JSON.parse(localStorage.getItem("Admin"));
      
      if (!adminData || !adminData.token) {
        setError("Please login as admin first");
        setLoading(false);
        return;
      }
      
      const token = adminData.token;
      
      const response = await axios.get("http://localhost:7000/read/order", {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      
      setOrders(response.data || []);
      
    } catch (error) {
      console.error("Error fetching orders:", error);
      
      if (error.code === 'ECONNABORTED') {
        setError("Request timeout. Server might be down.");
      } else if (error.response) {
        switch(error.response.status) {
          case 401:
            setError("Unauthorized. Please login again.");
            localStorage.removeItem("Admin");
            break;
          case 403:
            setError("Admin access required.");
            break;
          case 500:
            setError("Server error. Check backend console.");
            break;
          default:
            setError(`Error ${error.response.status}: ${error.response.data?.message || "Unknown error"}`);
        }
      } else if (error.request) {
        setError("No response from server. Is backend running?");
      } else {
        setError("Network error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const adminData = JSON.parse(localStorage.getItem("Admin"));
      const token = adminData?.token;
      
      await axios.patch(`http://localhost:7000/order/${orderId}/status`, 
        { 
          status: newStatus,
          adminNote: statusNote 
        },
        { 
          headers: { 'Authorization': `Bearer ${token}` } 
        }
      );
      
      alert(`Order status updated to ${newStatus}`);
      setShowModal(false);
      setStatusNote("");
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order status: " + error.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return "Invalid date";
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 border border-yellow-200';
      case 'confirmed': return 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border border-blue-200';
      case 'shipped': return 'bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-800 border border-indigo-200';
      case 'delivered': return 'bg-gradient-to-r from-green-50 to-green-100 text-green-800 border border-green-200';
      case 'cancelled': return 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border border-red-200';
      default: return 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <ShieldCheck className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = 
        order.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        statusFilter === "All" || 
        order.status?.toLowerCase() === statusFilter.toLowerCase();
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'amount-high': return (b.TotalAmount || 0) - (a.TotalAmount || 0);
        case 'amount-low': return (a.TotalAmount || 0) - (b.TotalAmount || 0);
        case 'oldest': return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        default: return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });

  const stats = {
    total: orders.length,
    revenue: orders.reduce((sum, order) => sum + (order.TotalAmount || 0), 0),
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  const exportOrders = () => {
    const dataStr = JSON.stringify(orders, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `orders-${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mb-4"></div>
        <p className="text-lg text-gray-600">Loading orders...</p>
        <p className="text-sm text-gray-500 mt-2">Fetching latest order data</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Orders Management</h1>
          
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-6 mb-6">
            <div className="flex items-start">
              <AlertCircle className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-red-800">Error Loading Orders</h3>
                <div className="mt-2 text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={fetchOrders}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800"
                  >
                    <RefreshCw className="mr-2 w-4 h-4" />
                    Retry Connection
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                <ShoppingCart className="w-8 h-8 text-emerald-600" />
                Orders Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and track all customer orders efficiently
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportOrders}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white rounded-xl transition-all duration-200 shadow-md"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={fetchOrders}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl transition-all duration-200 shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Orders</p>
                <p className="text-2xl font-bold mt-2">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Revenue</p>
                <p className="text-2xl font-bold mt-2">${stats.revenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Pending</p>
                <p className="text-2xl font-bold mt-2">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Delivered</p>
                <p className="text-2xl font-bold mt-2">{stats.delivered}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mb-6 bg-white rounded-2xl shadow-lg p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search orders by ID, customer, or email..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="All">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount-high">Amount: High to Low</option>
                <option value="amount-low">Amount: Low to High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                  <th className="px-6 py-4 text-left font-medium text-sm">Order ID</th>
                  <th className="px-6 py-4 text-left font-medium text-sm">Customer</th>
                  <th className="px6 py-4 text-left font-medium text-sm">Amount</th>
                  <th className="px-6 py-4 text-left font-medium text-sm">Status</th>
                  <th className="px6 py-4 text-left font-medium text-sm">Date</th>
                  <th className="px6 py-4 text-left font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-150 group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center">
                          <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">
                            #{order._id?.substring(0, 8)}...
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <ShoppingCart className="w-3 h-3" />
                            {order.products?.length || 0} items
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{order.customer}</div>
                          {order.customerEmail && (
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {order.customerEmail}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-50 to-green-100 flex items-center justify-center">
                          <DollarSign className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-800">
                            ${order.TotalAmount?.toFixed(2) || "0.00"}
                          </div>
                          <div className="text-xs text-gray-500">Total</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="font-medium capitalize">
                          {order.status || "Unknown"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{formatDate(order.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openStatusModal(order)}
                          className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-600 flex items-center justify-center transition-all duration-200 hover:shadow-sm border border-blue-200"
                          title="Update Status"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      
                        <button
                          className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 text-emerald-600 flex items-center justify-center transition-all duration-200 hover:shadow-sm border border-emerald-200"
                          title="Print Invoice"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">
                {searchTerm || statusFilter !== "All" 
                  ? "No matching orders found" 
                  : "No orders yet"}
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchTerm || statusFilter !== "All"
                  ? "Try adjusting your search or filters"
                  : "Orders will appear here when customers place them"}
              </p>
              {(searchTerm || statusFilter !== "All") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("All");
                  }}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-3 rounded-xl font-medium inline-flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Filter className="w-4 h-4" />
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
          <div>
            Showing <span className="font-semibold text-gray-700">{filteredOrders.length}</span> of{" "}
            <span className="font-semibold text-gray-700">{orders.length}</span> orders
          </div>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span>Pending ({stats.pending})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Delivered ({stats.delivered})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span>Cancelled ({stats.cancelled})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Edit className="w-5 h-5 text-blue-600" />
                  Update Order Status
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-6 space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Package className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-500">Order ID</div>
                    <div className="font-medium">{selectedOrder._id?.substring(0, 12)}...</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <User className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-500">Customer</div>
                    <div className="font-medium">{selectedOrder.customer}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <DollarSign className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-500">Amount</div>
                    <div className="font-medium">${selectedOrder.TotalAmount?.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select New Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { status: 'confirmed', label: 'Confirm', icon: CheckCircle, color: 'bg-blue-500 hover:bg-blue-600' },
                    { status: 'shipped', label: 'Ship', icon: Truck, color: 'bg-indigo-500 hover:bg-indigo-600' },
                    { status: 'delivered', label: 'Deliver', icon: ShieldCheck, color: 'bg-green-500 hover:bg-green-600' },
                    { status: 'cancelled', label: 'Cancel', icon: XCircle, color: 'bg-red-500 hover:bg-red-600' }
                  ].map(({ status, label, icon: Icon, color }) => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(selectedOrder._id, status)}
                      className={`${color} text-white p-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Note (Optional)
                </label>
                <textarea
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Add a note for customer..."
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}