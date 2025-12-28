import { Routes, Route, Navigate } from "react-router-dom"
import Home from "./pages/home"
import Dashboard from "./pages/dashboard"
import ProductsPage from "./pages/productPage"
import Customers from "./pages/customers"
import Report from "./pages/reaports"
import Orders from "./pages/orders"
import AddProduct from "./pages/addProduct"
import UpdateProduct from "./pages/updateProduct"
import ShoppingCart from "./pages/cartPage"
import Register from "./pages/register"
import Login from "./pages/Login"
import ProtectedRoute from "./components/ProtectedRoute"
import { Contact } from "./pages/contact"
import { Category } from "./pages/category"

export default function App(){
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/customerRegis" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/categories" element={<Category />} />
        
        {/* Dashboard-ka oo admin keliya geli karo */}
        <Route path="/dashboard" element={
          <ProtectedRoute adminOnly={true}>
            <Dashboard />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="products" />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="customers" element={<Customers />} />
          <Route path="reports" element={<Report />} />
          <Route path="orders" element={<Orders />} />
          <Route path="update/:id" element={<UpdateProduct />} />
          <Route path="AddProduct" element={<AddProduct />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}