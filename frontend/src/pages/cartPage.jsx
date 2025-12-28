import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ShoppingCart() {
  const [productData, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Read data from database
  useEffect(() => {
    const getData = JSON.parse(localStorage.getItem("products")) || [];
    
    const update = getData.map(item => ({
      ...item, 
      quantity: 1, 
      maxQuantity: item.quantity,
      productId: item._id // Ensure productId is set
    }));
    
    setProducts(update);
    console.log("🛒 Products in cart:", update);
  }, []);

  // Delete item from cart
  const handelDeleteItem = (id) => {
    const removeItem = productData.filter((item) => item._id !== id);
    localStorage.setItem("products", JSON.stringify(removeItem));
    setProducts(removeItem);
  };

  // Total price count
  const TotalPrice = productData.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);

  // Increment
  const handleIncrement = (id) => {
    setProducts(prd => prd.map(
      item => item._id === id ? {...item, quantity: item.quantity < item.maxQuantity ? item.quantity + 1 : item.quantity} : item
    ));
  };

  const handleDecremet = (id) => {
    setProducts((prd) => prd.map(
      item => item._id === id ? {...item, quantity: item.quantity > 1 ? item.quantity - 1 : item.quantity} : item
    ));
  };

  const customer = localStorage.getItem("customer");

  let customerOrder = "";

  if (customer) {
    try {
      const customerData = JSON.parse(customer);
      
      console.log("🔍 Customer data from localStorage:", customerData);
      
      // Multiple ways to get customer name
      customerOrder = customerData.data?.customer?.name || 
                     customerData.data?.name || 
                     customerData.customer?.name || 
                     customerData.name || 
                     "Customer";
      
      console.log("📝 Customer name for order:", customerOrder);
      
    } catch (error) {
      console.error("❌ Error parsing customer data:", error);
      customerOrder = "Customer";
    }
  }

  async function handleOrder() {
    if (!customer) {
      alert("Customer is required. Please login or signup.");
      navigate("/login");
      return;
    }

    if (productData.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setLoading(true);

    try {
      console.log("🚀 Sending order data...");
      console.log("Customer:", customerOrder);
      console.log("Products:", productData.map(item => ({
        productId: item._id,
        quantity: item.quantity,
        productName: item.name
      })));

      const orderData = {
        customer: customerOrder,
        products: productData.map(item => ({
          productId: item._id,
          quantity: item.quantity
        }))
      };

      console.log("📦 Order payload:", orderData);

      const response = await axios.post("http://localhost:7000/create/order", orderData);
      
      console.log("✅ Order response:", response.data);
      
      if (response.data.error) {
        alert(response.data.error);
      } else {
        alert("Order placed successfully!");
        localStorage.removeItem("products");
        setProducts([]);
        
        // Optionally redirect to home or orders page
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      console.error("❌ Order error:", error);
      
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
        
        if (error.response.data.error) {
          alert("Error: " + error.response.data.error);
        } else {
          alert("Failed to place order. Please try again.");
        }
      } else {
        alert("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6 w-full">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Shopping Cart */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-semibold mb-4">Shopping Cart</h2>
          <div className="flex justify-between border-b text-xl font-medium text-gray-400">
            <h1>Name</h1>
            <h1 className="ml-12">Quantity</h1>
            <h1>Price</h1>
            <h1>Total Price</h1>
          </div>
          
          {productData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Your cart is empty</p>
              <button 
                onClick={() => navigate("/")}
                className="mt-4 bg-yellow-400 text-black px-6 py-2 rounded-md hover:bg-yellow-500"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            productData.map((item) => (
              <div key={item._id} className="border-b">
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={`http://localhost:7000/Allimages/${item.prImage}`}
                      className="w-16 h-16 object-cover rounded"
                      alt={item.name}
                    />
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-purple-600">{item.category}</p>
                      <p className="text-sm text-gray-500">In stock: {item.maxQuantity}</p>
                      <button 
                        onClick={() => handelDeleteItem(item._id)} 
                        className="text-red-500 text-sm hover:underline mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center border rounded">
                    <button 
                      onClick={() => handleDecremet(item._id)} 
                      className="px-3 py-1 hover:bg-gray-100"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-3 py-1 border-x">{item.quantity}</span>
                    <button 
                      onClick={() => handleIncrement(item._id)} 
                      className="px-3 py-1 hover:bg-gray-100"
                      disabled={item.quantity >= item.maxQuantity}
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="flex gap-20">
                    <p className="w-20 text-right font-semibold mr-16">${item.price}</p>
                    <p className="w-20 text-right font-semibold mr-3">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-xl shadow h-fit sticky top-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Items</span>
              <span>{productData.length}</span>
            </div>

            <div>
              <label className="block text-sm mb-1">Shipping</label>
              <select className="w-full border rounded p-2 text-sm">
                <option>Standard Delivery - Free</option>
                <option>Express Delivery - $10</option>
              </select>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Cost</span>
                <span>${TotalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleOrder} 
              disabled={loading || productData.length === 0}
              className={`w-full py-3 rounded-xl font-medium ${loading || productData.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500'} text-black`}
            >
              {loading ? 'Processing...' : 'CHECKOUT'}
            </button>
            
            {!customer && (
              <div className="text-sm text-red-500 mt-2">
                * Please login to place order
              </div>
            )}
            
            <div className="text-xs text-gray-500 mt-4">
              <p>Customer: {customerOrder || "Not logged in"}</p>
              <p>Items in cart: {productData.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}