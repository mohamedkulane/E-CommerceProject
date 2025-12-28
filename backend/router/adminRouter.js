const express = require("express")
const adminController = require("../controller/adminController")
const { verifyToken, verifyAdmin } = require("../middleware/verifyToken")

const router = express.Router()

// Remove public admin registration (only backend creation)
router.post("/create/admin", adminController.createAdmin)
router.post("/login/admin", adminController.adminLogin)

// Admin protected routes
router.get("/admin/dashboard", verifyToken, verifyAdmin, (req, res) => {
    res.json({ message: "Welcome to Admin Dashboard" })
})

module.exports = router