import {Routes,Route} from "react-router-dom"
import Home from "./pages/home"
import Dashboard from "./pages/dashboard"
import ProductsPage from "./pages/productPage"
import Customers from "./pages/customers"
import Report from "./pages/reaports"
import Orders from "./pages/orders"
import AddProduct from "./pages/addProduct"
import UpdateProduct from "./pages/updateProduct"
import ShoppingCart from "./pages/cartPage"
import Header from "../src/components/header"
import About from "./pages/about"
import Register from "./pages/register"
import Login from "./pages/Login"
export default function App(){
  return <div >
   <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/about" element={<About/>}/>
     <Route   path="/cart" element={<ShoppingCart/>}/>
    <Route   path="/customerRegis" element={<Register/>}/>
    <Route   path="/login" element={<Login/>}/>
    

    <Route path="/dashboard" element={<Dashboard/>}>
    <Route path="products" element={<ProductsPage/>}/>
    <Route   path="customers" element={<Customers/>}/>
    <Route   path="reports" element={<Report/>}/>
    <Route   path="orders" element={<Orders/>}/>
    <Route   path="update/:id" element={<UpdateProduct/>}/>
    <Route   path="AddProduct" element={<AddProduct/>}/>
    </Route>
  

   </Routes>
  </div>
}