const express = require("express")
const customerController = require("../controller/customerConroler")
const { verifyToken, verifyAdmin } = require("../middleware/verifyToken")

const router = express.Router()

// Public routes
router.post("/create/customer", customerController.createCustomer)
router.post("/login/customer", customerController.customerLogin)

// Admin only routes
router.get("/read/customer", verifyToken, verifyAdmin, customerController.readCustomer)
router.get("/read/customer/:id", verifyToken, verifyAdmin, customerController.getCustomerById)

module.exports = router