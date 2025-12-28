import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaShoppingCart,
  FaStar,
  FaFilter,
  FaFire,
  FaTshirt,
  FaMobileAlt,
  FaWineBottle,
  FaDollarSign,
  FaHome,
  FaPhone,
  FaHeart,
  FaShoppingBag,
  FaCarrot,
  FaEgg,
  FaBreadSlice,
  FaUtensils,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { GiMeat, GiFruitBowl } from "react-icons/gi";
import { BiDrink } from "react-icons/bi";
import Footer from "../components/Footer";
import Header from "../components/header";

export const Category = () => {
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  function handleReadData() {
    setLoading(true);
    axios
      .get("http://localhost:7000/read/ProductPost")
      .then((res) => {
        setData(res.data);
        setFilteredData(res.data);

        // Extract unique categories from data
        const uniqueCategories = [
          ...new Set(res.data.map((item) => item.category)),
        ];
        setCategories(uniqueCategories);

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
    if (selectedCategory) {
      const filtered = data.filter(
        (item) =>
          item.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [selectedCategory, data]);

  const handleStoreData = (item) => {
    const newData = JSON.parse(localStorage.getItem("products")) || [];
    const existId = newData.some((cartItem) => cartItem._id === item._id);
    if (!existId) {
      newData.push(item);
      localStorage.setItem("products", JSON.stringify(newData));
      alert(`${item.name} added to cart!`);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case "food":
        return <FaFire className="text-xl sm:text-2xl text-orange-500" />;
      case "electronic":
        return <FaMobileAlt className="text-xl sm:text-2xl text-blue-500" />;
      case "meat":
        return <GiMeat className="text-xl sm:text-2xl text-red-500" />;
      case "drinks":
        return <BiDrink className="text-xl sm:text-2xl text-teal-500" />;
      case "clothes":
        return <FaTshirt className="text-xl sm:text-2xl text-purple-500" />;
      case "vegetables":
        return <FaCarrot className="text-xl sm:text-2xl text-cyan-500" />;
      case "cosmetics":
        return <FaHeart className="text-xl sm:text-2xl text-indigo-500" />;
      default:
        return <FaShoppingBag className="text-xl sm:text-2xl text-green-500" />;
    }
  };

  const getCategoryCount = (category) => {
    if (!category) return data.length;
    return data.filter(
      (item) => item.category?.toLowerCase() === category.toLowerCase()
    ).length;
  };

  const mainCategories = [
    { name: "All Products", value: "", color: "from-green-900 to-green-700" },
    {
      name: "Electronic",
      value: "electronic",
      color: "from-blue-600 to-blue-400",
    },
    {
      name: "Clothes",
      value: "Clothes",
      color: "from-purple-600 to-purple-400",
    },
    { name: "Food", value: "Food", color: "from-orange-600 to-orange-400" },
    { name: "Drinks", value: "Drinks", color: "from-teal-600 to-teal-400" },
    { name: "Meat", value: "Meat", color: "from-red-600 to-red-400" },
    {
      name: "Vegetables",
      value: "Vegetables",
      color: "from-indigo-600 to-indigo-400",
    },
    {
      name: "Cosmetics",
      value: "Cosmetics",
      color: "from-yellow-600 to-yellow-400",
    },
  ];

  const quickLinks = [
    { name: "Home", icon: <FaHome />, path: "/" },
    { name: "Products", icon: <FaShoppingBag />, path: "/products" },
    { name: "Cart", icon: <FaShoppingCart />, path: "/cart" },
    { name: "Contact", icon: <FaPhone />, path: "/contact" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 ">
      <Header />
   
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 lg:py-8 sm:ml-48 ml-0">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium shadow-md transition-all w-full justify-center"
          >
            <span>Filter Categories</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          

          {/* Main Content - Products */}
          <div className="lg:w-3/4">
            {/* Category Header */}
            <div className="mb-6 lg:mb-8 bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 lg:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 lg:mb-6">
                <div className="mb-4 lg:mb-0">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">
                    {selectedCategory
                      ? `${selectedCategory} Products`
                      : "All Products"}
                  </h2>
                  <p className="text-gray-600 mt-2 text-sm lg:text-base">
                    Discover our curated collection of{" "}
                    {selectedCategory
                      ? selectedCategory.toLowerCase()
                      : "amazing"}{" "}
                    products
                  </p>
                </div>
                
              </div>

              {/* Category Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
                {mainCategories.slice(1).map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`p-3 lg:p-4 rounded-lg lg:rounded-xl text-center transition-all duration-300 ${
                      selectedCategory === cat.value
                        ? "bg-gradient-to-r " +
                          cat.color +
                          " text-white transform scale-[1.02] lg:scale-105 shadow-md lg:shadow-lg"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-700 hover:shadow-md"
                    }`}
                  >
                    <div className="text-xl lg:text-2xl mb-1 lg:mb-2">
                      {getCategoryIcon(cat.value)}
                    </div>
                    <div className="font-medium text-sm lg:text-base">
                      {cat.name}
                    </div>
                    <div className="text-xs lg:text-sm mt-1">
                      {getCategoryCount(cat.value)} items
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-64 lg:h-96">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 lg:h-16 lg:w-16 border-b-2 border-green-600 mx-auto mb-3 lg:mb-4"></div>
                  <p className="text-gray-600 text-sm lg:text-base">
                    Loading products...
                  </p>
                </div>
              </div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-12 lg:py-16 bg-white rounded-xl lg:rounded-2xl shadow-lg">
                <div className="text-gray-400 mb-4">
                  <FaShoppingBag className="w-16 h-16 lg:w-20 lg:h-20 mx-auto" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-700 mb-2">
                  No Products Found
                </h3>
                <p className="text-gray-600 mb-6 text-sm lg:text-base">
                  Try selecting a different category
                </p>
                <button
                  onClick={() => setSelectedCategory("")}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 lg:px-8 lg:py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all text-sm lg:text-base"
                >
                  View All Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {filteredData.map((item) => {
                  const isAvailable =
                    item.status === "available" || item.quantity > 0;

                  return (
                    <div
                      key={item._id}
                      className="bg-white rounded-xl lg:rounded-2xl shadow-lg overflow-hidden border-t-4 border-green-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                    >
                      {/* Product Image */}
                      <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
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
                        <div className="absolute top-3 right-3 lg:top-4 lg:right-4">
                          <span
                            className={`px-2 py-1 lg:px-3 lg:py-1.5 rounded-full text-xs lg:text-sm font-medium ${
                              isAvailable
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                            }`}
                          >
                            {isAvailable ? "In Stock" : "Out of Stock"}
                          </span>
                        </div>

                        {/* Category Badge */}
                        <div className="absolute top-3 left-3 lg:top-4 lg:left-4 bg-black/70 text-white px-2 py-1 lg:px-3 lg:py-1.5 rounded-full text-xs lg:text-sm">
                          {item.category}
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-4 lg:p-6">
                        <div className="mb-3 lg:mb-4">
                          <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-1 lg:mb-2 truncate">
                            {item.name}
                          </h3>
                          <p className="text-gray-600 text-xs lg:text-sm line-clamp-2">
                            {item.desc ||
                              "Premium quality product with excellent features."}
                          </p>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center mb-3 lg:mb-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              className={`w-3 h-3 lg:w-4 lg:h-4 ${
                                star <= 4 ? "text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="ml-1 lg:ml-2 text-xs lg:text-sm text-gray-500">
                            (4.0)
                          </span>
                          <span className="ml-auto text-xs lg:text-sm text-gray-500">
                            Qty: {item.quantity}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-lg lg:text-xl xl:text-2xl font-bold text-gray-800">
                              ${parseFloat(item.price).toFixed(2)}
                            </span>
                          </div>

                          <button
                            onClick={() => handleStoreData(item)}
                            disabled={!isAvailable}
                            className={`flex items-center gap-1 lg:gap-2 px-3 py-2 lg:px-4 lg:py-2.5 rounded-lg font-medium transition-all duration-300 text-xs lg:text-sm ${
                              isAvailable
                                ? "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-md hover:shadow-lg transform hover:scale-105"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            <FaShoppingCart className="w-3 h-3 lg:w-4 lg:h-4" />
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

      <Footer />
    </div>
  );
};
