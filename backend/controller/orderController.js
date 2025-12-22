const orderModel=require("../models/ordersModel")
const productModel=require("../models/productModel")
const { get } = require("../router/orderRouter")

const createOrder=async(req,res)=>{
    const {customer,products}=req.body

    if(!products || products.length ===0){
        return res.status(400).json({error: "product is required"})

    }

    let TotalAmount=0
    let orders=[]

    for(let items of products){
        const productData=await productModel.findById(items.productId)

        if(!productData){
            return res.status(4000).json({error:"product is not found"})
        }

        // total amount calculation

        let price=productData.price
        let total= price *items.quantity
        TotalAmount +=total

        // checks if quantity is how it needs

        if(items.quantity > productData.quantity){
            return res.status(400).json({error:"this product is out of stock"})
        }

        productData.quantity -=items.quantity

        await productData.save()
        // 
        orders.push({
            productId:productData._id,
            quantity:items.quantity,
            price,
            total

        })
    }
    if(!customer){
        res.status(400).json({message: "customer is required.."})
    }
    const newData= new orderModel({
        TotalAmount,
        customer,
        products:orders
    })
    await newData.save()

    res.send(newData)
}

const readOrder=async(req,res)=>{
    const getOrder=await orderModel.find()
    if(getOrder){
        res.send(getOrder)
    }
}

const getTotalIncome=async(req,res)=>{
    const total=await orderModel.aggregate([
        {
            $group:{_id:null, TotalIncome:{$sum: "$TotalAmount"}}
        }
    ])
    if(total){
        res.send(total)
    }
}

const getTopCustomers=async(req,res)=>{
    const topCustomers= await orderModel.aggregate([
        {
            $group:{
               _id: "$customer" ,
               totalSpend:{$sum: "$TotalAmount"},
               orderCount:{$sum: 1}
            }
        },
        {$sort: {totalSpend: -1}},
        {$limit:3}
    ])
    if(topCustomers.length===0){
        return res.status(404).json({message: "customer not found"})
    }
    res.json(
        topCustomers.map(item=>({
            customer:item._id,
            totalSpend:item.totalSpend,
            orderCount:item.orderCount
        }))
    )
}

module.exports={createOrder,readOrder,getTotalIncome,getTopCustomers}