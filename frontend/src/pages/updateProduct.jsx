import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function UpdateProduct() {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingImage, setExistingImage] = useState("");

  const navigate = useNavigate();
  const params = useParams();

  function handleReadSingle() {
    setLoading(true);
    axios
      .get(`http://localhost:7000/readSingle/ProductPost/${params.id}`)
      .then((res) => {
        const product = res.data;
        setName(product.name || "");
        setPrice(product.price || "");
        setQuantity(product.quantity || "");
        setCategory(product.category || "");
        setDesc(product.desc || "");
        setExistingImage(product.prImage || "");
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to load product data",
          icon: "error",
        });
        navigate("/dashboard/products");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    handleReadSingle();
  }, [params.id]);

  function handleUpdate(e) {
    e.preventDefault();

    if (!name || !price || !quantity || !category) {
      Swal.fire({
        title: "Validation Error!",
        text: "Please fill in all required fields",
        icon: "warning",
      });
      return;
    }

    // ✅ FIX: Get token from localStorage
    const adminData = JSON.parse(localStorage.getItem("Admin"));
    if (!adminData || !adminData.token) {
      Swal.fire({
        title: "Authentication Error!",
        text: "Please login again",
        icon: "error",
      }).then(() => {
        navigate("/login");
      });
      return;
    }

    const token = adminData.token;
    console.log("🔑 Using token:", token.substring(0, 20) + "...");

    const formData = new FormData();
    formData.append("name", name);
    if (image) {
      formData.append("img", image);
    }
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("category", category);
    formData.append("desc", desc);

    setLoading(true);

    axios
      .put(`http://localhost:7000/update/ProductPost/${params.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // ✅ ADD THIS
        },
      })
      .then(() => {
        Swal.fire({
          title: "Success!",
          text: "Product updated successfully",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/dashboard/products");
      })
      .catch((error) => {
        console.error("Update error:", error);

        let errorMessage = "Failed to update product";
        if (error.response) {
          if (error.response.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
            localStorage.removeItem("Admin");
            setTimeout(() => navigate("/login"), 2000);
          } else if (error.response.status === 403) {
            errorMessage = "Access denied. Admin only.";
          } else {
            errorMessage = `Server error: ${
              error.response.data?.message || error.response.status
            }`;
          }
        }

        Swal.fire({
          title: "Error!",
          text: errorMessage,
          icon: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Update Product</h1>
          <p className="text-gray-600">Edit product details below</p>
        </div>

        <form className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {loading && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-700 flex items-center">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></span>
                Loading product data...
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Product Name *
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Enter product name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Category *
              </label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                type="text"
                placeholder="Enter category"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Quantity *
              </label>
              <input
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                type="number"
                min="0"
                placeholder="Enter quantity"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Price *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Enter product description"
                rows="3"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Product Image
              </label>

              {/* Current Image Preview */}
              {existingImage && !image && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                  <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={`http://localhost:7000/Allimages/${existingImage}`}
                      alt="Current product"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* New Image Preview */}
              {image && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    New Image Preview:
                  </p>
                  <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  onChange={(e) => setImage(e.target.files[0])}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <svg
                      className="w-12 h-12 text-gray-400 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-gray-600 font-medium">
                      {image ? "Change Image" : "Upload New Image"}
                    </span>
                    <span className="text-sm text-gray-500 mt-1">
                      Click to browse or drag and drop
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      PNG, JPG, GIF up to 5MB
                    </span>
                  </div>
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {image
                  ? "New image will replace the current one"
                  : "Leave empty to keep current image"}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                  Updating...
                </>
              ) : (
                "Update Product"
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard/products")}
              disabled={loading}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
