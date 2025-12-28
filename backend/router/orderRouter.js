const express = require("express")
const orderController = require("../controller/orderController")
const { verifyToken, verifyAdmin } = require("../middleware/verifyToken")

const router = express.Router()

// Public routes (for customers to create orders)
router.post("/create/order", orderController.createOrder)

// Admin only routes
router.get("/read/order", verifyToken, verifyAdmin, orderController.readOrder)
router.get("/getIncome/order", verifyToken, verifyAdmin, orderController.getTotalIncome)
router.get("/getTopCustomers/order", verifyToken, verifyAdmin, orderController.getTopCustomers)
router.get("/getRevenueOverTime/order", verifyToken, verifyAdmin, orderController.getRevenueOverTime)
router.get("/getMostSoldProducts/order", verifyToken, verifyAdmin, orderController.getMostSoldProducts)
router.get("/getSalesByCategory/order", verifyToken, verifyAdmin, orderController.getSalesByCategory)

// New routes for order management
router.get("/order/:id", verifyToken, verifyAdmin, orderController.getOrderById)
router.patch("/order/:id/status", verifyToken, verifyAdmin, orderController.updateOrderStatus)

module.exports = router