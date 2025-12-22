const express=require("express")
const customerController=require("../controller/customerConroler")
const { verifyToken } = require("../middleware/auth")

const router=express.Router()

router.post("/create/customer", customerController.createCustomer)
router.post("/login/customer", customerController.customerLogin)
router.get("/read/customer" , verifyToken , customerController.readCustomer)



module.exports=router
