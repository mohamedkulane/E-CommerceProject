import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import {
  TrendingUp,
  Users,
  Package,
  ShoppingBag,
  DollarSign,
  RefreshCw,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Award,
  Star,
  Activity,
  Download,
  ChevronDown,
  TrendingDown,
  Eye,
  MoreVertical,
  Target,
  Coffee,
  Smartphone,
  Home,
  Heart,
  Clock,
  Shield,
  Zap,
  ChevronRight,
} from "lucide-react";

export default function Report() {
  const [getIncome, setIncome] = useState(0);
  const [topCustomer, setTopCustomer] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [productStats, setProductStats] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("monthly");
  const navigate = useNavigate();

  const COLOR_SCHEME = {
    primary: "#1B5E20",
    secondary: "#FF9800",
    accent: "#3B82F6",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    purple: "#8B5CF6",
    pink: "#EC4899",
    teal: "#14B8A6",
    indigo: "#6366F1",
  };

  const GRADIENTS = {
    green: "from-emerald-500 to-green-500",
    orange: "from-orange-500 to-amber-500",
    blue: "from-blue-500 to-indigo-500",
    purple: "from-purple-500 to-pink-500",
    teal: "from-teal-500 to-cyan-500",
    red: "from-red-500 to-pink-500",
    indigo: "from-indigo-500 to-purple-500",
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError("");

      const adminData = JSON.parse(localStorage.getItem("Admin"));

      if (!adminData || !adminData.token) {
        setError("Admin token not found. Please login again.");
        setLoading(false);
        return;
      }

      const token = adminData.token;
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Fetch all data in parallel
      const [
        incomeResponse,
        topCustomersResponse,
        revenueResponse,
        productsResponse,
        categoryResponse,
      ] = await Promise.all([
        axios.get("http://localhost:7000/getIncome/order", { headers }),
        axios.get("http://localhost:7000/getTopCustomers/order", { headers }),
        axios.get(
          `http://localhost:7000/getRevenueOverTime/order?period=${timeRange}`,
          { headers }
        ),
        axios.get("http://localhost:7000/getMostSoldProducts/order", {
          headers,
        }),
        axios.get("http://localhost:7000/getSalesByCategory/order", {
          headers,
        }),
      ]);

      // Set data
      if (
        incomeResponse.data &&
        incomeResponse.data.TotalIncome !== undefined
      ) {
        setIncome(incomeResponse.data.TotalIncome);
      } else {
        setIncome(0);
      }

      setTopCustomer(topCustomersResponse.data || []);
      setRevenueData(revenueResponse.data || []);
      setProductStats(productsResponse.data || []);
      setCategoryStats(categoryResponse.data || []);
    } catch (error) {
      console.error("❌ Error fetching reports:", error);

      if (error.response) {
        if (error.response.status === 401) {
          setError(
            "Unauthorized. Token expired or invalid. Please login again."
          );
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else if (error.response.status === 403) {
          setError("Forbidden. Admin privileges required.");
        } else {
          setError(
            "Server error: " + (error.response.data?.message || "Unknown error")
          );
        }
      } else {
        setError("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [timeRange]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-lg backdrop-blur-sm bg-opacity-95">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm font-medium">{entry.name}:</span>
              <span className="text-sm font-bold ml-auto">
                {entry.name.includes("revenue") ||
                entry.name.includes("Revenue")
                  ? "$"
                  : ""}
                {entry.value?.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
              <div>
                <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-64"></div>
              </div>
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 bg-gray-200 rounded-lg w-24"
                  ></div>
                ))}
              </div>
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>

            {/* Charts Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-96 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-red-50 to-red-100 flex items-center justify-center">
            <Shield className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={fetchAllData}
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getIconForCategory = (category) => {
    const cat = category?.toLowerCase() || "";
    if (cat.includes("tech") || cat.includes("electronics"))
      return <Smartphone className="w-5 h-5" />;
    if (cat.includes("fashion") || cat.includes("clothing"))
      return <ShoppingBag className="w-5 h-5" />;
    if (cat.includes("food") || cat.includes("drink"))
      return <Coffee className="w-5 h-5" />;
    if (cat.includes("home") || cat.includes("living"))
      return <Home className="w-5 h-5" />;
    if (cat.includes("health") || cat.includes("beauty"))
      return <Heart className="w-5 h-5" />;
    return <Package className="w-5 h-5" />;
  };

  const getCategoryColor = (index) => {
    const colors = [
      COLOR_SCHEME.primary,
      COLOR_SCHEME.secondary,
      COLOR_SCHEME.accent,
      COLOR_SCHEME.success,
      COLOR_SCHEME.warning,
      COLOR_SCHEME.purple,
      COLOR_SCHEME.pink,
      COLOR_SCHEME.teal,
      COLOR_SCHEME.indigo,
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Analytics Dashboard
                  </h1>
                  <p className="text-gray-600 flex items-center gap-2 mt-1">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    Real-time insights and performance metrics
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
             
              <button
                onClick={fetchAllData}
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center gap-4 bg-white rounded-2xl shadow-sm p-3 max-w-fit">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Period:</span>
            </div>
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
              {["daily", "weekly", "monthly", "yearly"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition-all duration-200 ${
                    timeRange === range
                      ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-white hover:text-gray-800"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Revenue */}
          <div
            className={`bg-gradient-to-r ${GRADIENTS.blue} rounded-2xl p-5 text-white shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Total Revenue
                </p>
                <p className="text-2xl md:text-3xl font-bold mt-2">
                  ${getIncome.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 text-xs opacity-90 flex items-center gap-2">
              <Zap className="w-3 h-3" />
              All time income from orders
            </div>
          </div>

          {/* Total Orders */}
          <div
            className={`bg-gradient-to-r ${GRADIENTS.green} rounded-2xl p-5 text-white shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Total Orders
                </p>
                <p className="text-2xl md:text-3xl font-bold mt-2">
                  {revenueData
                    .reduce((sum, item) => sum + (item.orders || 0), 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 text-xs opacity-90 flex items-center gap-2">
              <Target className="w-3 h-3" />
              Completed successfully
            </div>
          </div>

          {/* Top Customers */}
          <div
            className={`bg-gradient-to-r ${GRADIENTS.purple} rounded-2xl p-5 text-white shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Top Customers
                </p>
                <p className="text-2xl md:text-3xl font-bold mt-2">
                  {topCustomer.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 text-xs opacity-90 flex items-center gap-2">
              <Star className="w-3 h-3" />
              By total spending power
            </div>
          </div>

          {/* Products Sold */}
          <div
            className={`bg-gradient-to-r ${GRADIENTS.orange} rounded-2xl p-5 text-white shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Products Sold
                </p>
                <p className="text-2xl md:text-3xl font-bold mt-2">
                  {productStats
                    .reduce((sum, item) => sum + (item.totalSold || 0), 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 text-xs opacity-90 flex items-center gap-2">
              <Activity className="w-3 h-3" />
              Top {productStats.length} performing products
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trend Chart */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">
                      Revenue Trend
                    </h2>
                    <p className="text-sm text-gray-500">
                      Performance over {timeRange}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-xs text-gray-600">Revenue</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs text-gray-600">Orders</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="h-72">
                {revenueData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis
                        dataKey="period"
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                      />
                      <YAxis
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        name="Revenue ($)"
                        stroke="#3B82F6"
                        fill="url(#colorRevenue)"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="orders"
                        name="Orders"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={{ r: 4, fill: "#10B981" }}
                      />
                      <defs>
                        <linearGradient
                          id="colorRevenue"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3B82F6"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3B82F6"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <BarChart3 className="w-16 h-16 mb-4 text-gray-300" />
                    <p>No revenue data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 flex items-center justify-center">
                    <PieChartIcon className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">
                      Category Distribution
                    </h2>
                    <p className="text-sm text-gray-500">
                      Sales by product category
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="h-72">
                {categoryStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryStats}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, totalRevenue }) => `${category}`}
                        outerRadius={80}
                        innerRadius={40}
                        fill="#8884d8"
                        dataKey="totalRevenue"
                        paddingAngle={2}
                      >
                        {categoryStats.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={getCategoryColor(index)}
                            stroke="#fff"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [
                          `$${value?.toFixed(2)}`,
                          "Revenue",
                        ]}
                        contentStyle={{
                          borderRadius: "12px",
                          border: "1px solid #e5e7eb",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <PieChartIcon className="w-16 h-16 mb-4 text-gray-300" />
                    <p>No category data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Top Customers Table */}

        <div className="mb-11">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-50 to-orange-100 flex items-center justify-center">
                    <Award className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">
                      Top Customers
                    </h2>
                    <p className="text-sm text-gray-500">
                      Highest spending customers
                    </p>
                  </div>
                </div>
                <Eye className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="p-6">
              <div className="h-72 overflow-y-auto pr-2">
                {topCustomer.length > 0 ? (
                  <div className="space-y-3">
                    {topCustomer.slice(0, 5).map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200 group"
                      >
                        <div
                          className={`
                                                    w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white
                                                    ${
                                                      index === 0
                                                        ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                                                        : index === 1
                                                        ? "bg-gradient-to-r from-gray-500 to-gray-600"
                                                        : index === 2
                                                        ? "bg-gradient-to-r from-orange-500 to-red-500"
                                                        : "bg-gradient-to-r from-blue-500 to-indigo-500"
                                                    }
                                                `}
                        >
                          #{index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h4 className="font-semibold text-gray-800 truncate">
                              {item.customer || "Unknown Customer"}
                            </h4>
                            <span className="text-sm text-gray-500">
                              {item.orderCount} orders
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-green-500" />
                              <span className="font-bold text-green-600">
                                ${item.totalSpend?.toFixed(2)}
                              </span>
                            </div>
                            <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <Users className="w-16 h-16 mb-4 text-gray-300" />
                    <p>No customer data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-500" />
            Quick Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {revenueData.length}
              </div>
              <div className="text-sm text-gray-500 mt-1">Time Periods</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {categoryStats.length}
              </div>
              <div className="text-sm text-gray-500 mt-1">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {productStats.length}
              </div>
              <div className="text-sm text-gray-500 mt-1">Top Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {topCustomer.length}
              </div>
              <div className="text-sm text-gray-500 mt-1">Valued Customers</div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="text-center text-sm text-gray-500">
          <p className="flex items-center justify-center gap-2">
            <Clock className="w-4 h-4" />
            Last updated:{" "}
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            <span className="mx-2">•</span>
            <span className="text-emerald-600 font-medium">
              Dashboard is auto-refreshing every 5 minutes
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
