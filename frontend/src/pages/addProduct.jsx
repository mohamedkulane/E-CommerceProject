import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  PlusCircle,
  Upload,
  X,
  Image as ImageIcon,
  DollarSign,
  Package,
  Tag,
  FileText,
  ArrowLeft,
  Trash2,
  Loader2,
  Layers,
  AlertCircle,
  CheckCircle
} from "lucide-react";

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
    description: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState("");
  const [imageKey, setImageKey] = useState(Date.now());
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([
    "Electronics",
    "Fashion",
    "Home & Garden",
    "Food & Drinks",
    "Health & Beauty",
    "Sports",
    "Books",
    "Toys"
  ]);
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "File Too Large",
        text: "Maximum file size is 5MB",
        confirmButtonColor: "#EF4444",
      });
      e.target.value = "";
      return;
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Invalid File Type",
        text: "Only JPG, PNG, GIF, WebP are allowed",
        confirmButtonColor: "#EF4444",
      });
      e.target.value = "";
      return;
    }

    // Show uploading state
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      setFormData({
        ...formData,
        image: file,
      });
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setIsUploading(false);
    }, 500);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.price || formData.price <= 0) newErrors.price = "Valid price is required";
    if (!formData.quantity || formData.quantity < 0) newErrors.quantity = "Valid quantity is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      quantity: "",
      category: "",
      description: "",
      image: null,
    });
    setImagePreview("");
    setErrors({});
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    
    setImageKey(Date.now());
    
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Incomplete Form",
        text: "Please fill all required fields",
        confirmButtonColor: "#EF4444",
      });
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("price", parseFloat(formData.price));
      formDataToSend.append("quantity", parseInt(formData.quantity));
      formDataToSend.append("category", formData.category.trim());
      if (formData.description.trim()) {
        formDataToSend.append("desc", formData.description.trim());
      }
      if (formData.image) {
        formDataToSend.append("img", formData.image);
      }

      const adminData = JSON.parse(localStorage.getItem("Admin"));
      if (!adminData || !adminData.token) {
        Swal.fire({
          icon: "warning",
          title: "Session Expired",
          text: "Please login again",
          confirmButtonColor: "#F59E0B",
        });
        navigate("/login");
        return;
      }

      const token = adminData.token;

      const response = await axios.post(
        "http://localhost:7000/create/ProductPost",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await Swal.fire({
        title: "Success!",
        text: "Product added successfully",
        icon: "success",
        confirmButtonText: "Continue",
        confirmButtonColor: "#10B981",
      });

      resetForm();
      navigate("/dashboard/products");
    } catch (error) {
      console.error("Error creating product:", error);
      
      let errorMessage = "Failed to add product";
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Session expired. Please login again.";
          localStorage.removeItem("Admin");
          setTimeout(() => navigate("/login"), 1500);
        } else if (error.response.status === 400) {
          errorMessage = error.response.data.error || "Invalid form data";
        }
      }
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTestData = () => {
    setFormData({
      name: "Premium Wireless Headphones",
      price: "129.99",
      quantity: "50",
      category: "Electronics",
      description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
      image: null,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate("/dashboard/products")}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 flex items-center justify-center transition-all duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                <PlusCircle className="w-7 h-7 text-emerald-600" />
                Add New Product
              </h1>
              <p className="text-gray-600 mt-1">
                Fill in product details to add to your inventory
              </p>
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 flex items-center justify-center text-white font-bold">
                1
              </div>
              <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-green-500"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 flex items-center justify-center text-white font-bold">
                2
              </div>
              <div className="w-24 h-1 bg-gray-300"></div>
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                3
              </div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Form Header */}
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" />
              Product Information
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              All fields marked with * are required
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Product Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.name ? 'border-red-300' : 'border-gray-200'
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200`}
                />
                {errors.name && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.name}
                  </div>
                )}
              </div>

              {/* Category & Price Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Category *
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.category ? 'border-red-300' : 'border-gray-200'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none bg-white`}
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {errors.category && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.category}
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Price ($) *
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </div>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0.01"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                        errors.price ? 'border-red-300' : 'border-gray-200'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                    />
                  </div>
                  {errors.price && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.price}
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity & Image Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Quantity */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="Enter quantity"
                    min="0"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.quantity ? 'border-red-300' : 'border-gray-200'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                  />
                  {errors.quantity && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.quantity}
                    </div>
                  )}
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Product Image
                  </label>
                  <div
                    onClick={triggerFileInput}
                    className={`border-2 border-dashed rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                      imagePreview 
                        ? 'border-emerald-300 bg-emerald-50' 
                        : 'border-gray-300 hover:border-emerald-400 hover:bg-emerald-50'
                    } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isUploading ? (
                      <div className="text-center py-6">
                        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
                        <p className="text-sm text-gray-600">Uploading image...</p>
                      </div>
                    ) : imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-40 w-full object-cover rounded-lg mb-3"
                        />
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-gray-700 truncate">
                              {formData.image?.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(formData.image?.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              resetForm();
                            }}
                            className="w-8 h-8 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                          <Upload className="w-full h-full" />
                        </div>
                        <p className="text-lg font-medium text-gray-700 mb-2">
                          Click to upload image
                        </p>
                        <p className="text-sm text-gray-600">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Hidden File Input */}
                  <input
                    key={imageKey}
                    ref={fileInputRef}
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your product features, specifications, and benefits..."
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none transition-all duration-200"
                />
                <p className="text-xs text-gray-500">
                  Help customers understand your product better
                </p>
              </div>

              {/* Preview Card */}
              {(formData.name || formData.price || formData.category) && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                  <h3 className="text-sm font-medium text-blue-800 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Product Preview
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {formData.name && (
                      <div>
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium text-gray-800 ml-2">{formData.name}</span>
                      </div>
                    )}
                    {formData.price && (
                      <div>
                        <span className="text-gray-600">Price:</span>
                        <span className="font-bold text-green-600 ml-2">${formData.price}</span>
                      </div>
                    )}
                    {formData.category && (
                      <div>
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium text-blue-600 ml-2">{formData.category}</span>
                      </div>
                    )}
                    {formData.quantity && (
                      <div>
                        <span className="text-gray-600">Stock:</span>
                                        <span className="font-medium text-orange-600 ml-2">{formData.quantity} units</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/dashboard/products")}
                    className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 transition-all duration-200 flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Products
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-red-700 transition-all duration-200 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={loadTestData}
                    className="px-5 py-3 rounded-xl font-medium bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-700 transition-all duration-200 text-sm"
                  >
                    Load Test Data
                  </button>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-8 py-3 rounded-xl font-bold text-white flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg ${
                      loading
                        ? "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Adding Product...
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-4 h-4" />
                        Add Product
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

       
      </div>
    </div>
  );
}