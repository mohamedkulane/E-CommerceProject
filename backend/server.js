const express =require("express")
const mongoose=require("mongoose")
require("dotenv").config()
const Postrouter=require("../backend/router/routers")
const customerRouter=require("../backend/router/customerRouter")
const OrderRouter=require("../backend/router/orderRouter")
const AdminRouter=require("../backend/router/adminRouter")
const app=express()
app.use(express.json())
const cors=require("cors")
app.use(cors())

const PORT=process.env.Port || 7000

mongoose.connect(process.env.db_Url).then(()=>console.log("success connection"))

app.use(Postrouter)
app.use(customerRouter)
app.use(OrderRouter)
app.use(AdminRouter)

app.use("/Allimages", express.static("images"))
app.listen(PORT, ()=>console.log("is running ...."))


