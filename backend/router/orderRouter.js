const express=require("express")
const orderController=require("../controller/orderController")

const router=express.Router()

router.post("/create/order", orderController.createOrder)
router.get("/read/order", orderController.readOrder)
router.get("/getIncome/order", orderController.getTotalIncome)
router.get("/getTopCustomers/order", orderController.getTopCustomers)



module.exports=router
