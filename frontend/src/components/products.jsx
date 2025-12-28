import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaShoppingCart,
  FaStar,
  FaFilter,
  FaShoppingBag,
} from "react-icons/fa";
import Header from "../components/header";
import Footer from "../components/Footer";

export default function Products() {
  const [data, setData] = useState([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);

  function handleReadData() {
    setLoading(true);
    axios
      .get("http://localhost:7000/read/ProductPost")
      .then((res) => {
        setData(res.data);
        setFilteredData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }

  useEffect(() => {
    handleReadData();
  }, []);

  useEffect(() => {
    if (category) {
      const filtered = data.filter(
        (item) => item.category?.toLowerCase() === category.toLowerCase()
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [category, data]);

  const handleStoreData = (item) => {
    const newData = JSON.parse(localStorage.getItem("products")) || [];
    const existId = newData.some((cartItem) => cartItem._id === item._id);
    if (!existId) {
      newData.push(item);
      localStorage.setItem("products", JSON.stringify(newData));
      alert(`${item.name} added to cart!`);
    }
  };

  const categories = [
    { name: "All Products", value: "", count: data.length },
    {
      name: "Food",
      value: "Food",
      count: data.filter((item) => item.category === "Food").length,
    },
    {
      name: "Electronic",
      value: "electronic",
      count: data.filter((item) => item.category === "electronic").length,
    },
    {
      name: "Meat",
      value: "Meat",
      count: data.filter((item) => item.category === "Meat").length,
    },
    {
      name: "Drinks",
      value: "Drinks",
      count: data.filter((item) => item.category === "Drinks").length,
    },
    {
      name: "Clothes",
      value: "Clothes",
      count: data.filter((item) => item.category === "Clothes").length,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 md:py-8">
      

        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow-md transition-all"
          >
            <FaFilter />
            <span>Filter Categories</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Sidebar - Categories Filter */}
          <div
            className={`lg:w-1/4 ${showSidebar ? "block" : "hidden lg:block"}`}
          >
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 mb-6 lg:mb-0 sticky top-24 lg:top-28">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FaFilter className="text-green-600" />
                  Categories
                </h2>
                <span className="text-sm text-gray-500">
                  {filteredData.length} items
                </span>
              </div>

              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => {
                      setCategory(cat.value);
                      if (window.innerWidth < 1024) {
                        setShowSidebar(false);
                      }
                    }}
                    className={`w-full text-left px-3 py-2 md:px-4 md:py-3 rounded-lg transition-all duration-300 ${
                      category === cat.value
                        ? "bg-green-100 text-green-700 border-l-4 border-green-600"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm md:text-base">
                        {cat.name}
                      </span>
                      <span className="bg-gray-200 text-gray-800 text-xs font-semibold px-2 py-1 rounded-full min-w-[2rem] text-center">
                        {cat.count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Mobile close button */}
              <button
                onClick={() => setShowSidebar(false)}
                className="lg:hidden w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Close Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="flex justify-center items-center h-64 md:h-96">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-b-2 border-green-600 mx-auto mb-3 md:mb-4"></div>
                  <p className="text-gray-600 text-sm md:text-base">
                    Loading products...
                  </p>
                </div>
              </div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-12 md:py-16 bg-white rounded-xl md:rounded-2xl shadow-lg">
                <div className="text-gray-400 mb-4">
                  <FaShoppingBag className="w-16 h-16 md:w-20 md:h-20 mx-auto" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-700 mb-2">
                  No Products Found
                </h3>
                <p className="text-gray-600 mb-6 text-sm md:text-base">
                  Try selecting a different category
                </p>
                <button
                  onClick={() => setCategory("")}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 md:px-8 md:py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all text-sm md:text-base"
                >
                  View All Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredData.map((item) => {
                  const isAvailable =
                    item.status === "available" || item.quantity > 0;

                  return (
                    <div
                      key={item._id}
                      className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden border-t-4 border-green-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                    >
                      {/* Product Image */}
                      <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          src={`http://localhost:7000/Allimages/${item.prImage}`}
                          alt={item.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='12' fill='%239ca3af' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                        {/* Status Badge */}
                        <div className="absolute top-3 right-3 md:top-4 md:right-4">
                          <span
                            className={`px-2 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm font-medium ${
                              isAvailable
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                            }`}
                          >
                            {isAvailable ? "In Stock" : "Out of Stock"}
                          </span>
                        </div>

                        {/* Category Badge */}
                        <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-black/70 text-white px-2 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm">
                          {item.category}
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-4 md:p-6">
                        <div className="mb-3 md:mb-4">
                          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1 md:mb-2 truncate">
                            {item.name}
                          </h3>
                          <p className="text-gray-600 text-xs md:text-sm line-clamp-2">
                            {item.desc ||
                              "Premium quality product with excellent features."}
                          </p>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center mb-3 md:mb-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              className={`w-3 h-3 md:w-4 md:h-4 ${
                                star <= 4 ? "text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="ml-1 md:ml-2 text-xs md:text-sm text-gray-500">
                            (4.0)
                          </span>
                          <span className="ml-auto text-xs md:text-sm text-gray-500">
                            Qty: {item.quantity}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">
                              ${parseFloat(item.price).toFixed(2)}
                            </span>
                          </div>

                          <button
                            onClick={() => handleStoreData(item)}
                            disabled={!isAvailable}
                            className={`flex items-center gap-1 md:gap-2 px-3 py-2 md:px-4 md:py-2.5 lg:px-5 lg:py-3 rounded-lg font-medium transition-all duration-300 text-sm md:text-base ${
                              isAvailable
                                ? "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-md hover:shadow-lg transform hover:scale-105"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            <FaShoppingCart className="w-3 h-3 md:w-4 md:h-4" />
                            <span>
                              {isAvailable ? "Add to Cart" : "Out of Stock"}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
