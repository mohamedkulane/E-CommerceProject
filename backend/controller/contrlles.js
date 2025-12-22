const productModel=require("../models/productModel")

const Postproduct=async(req,res)=>{
    try{
        const newData= productModel({
            name:req.body.name,
            price:req.body.price,
            desc:req.body.desc,
            quantity:req.body.quantity,
            category:req.body.category,
            prImage:req.file.filename,
        })
        await newData.save()
        res.send(newData)
    }

    catch(error){
        res.status(400).json({message:"server error"})
    }
   
}

const ReadProduct=async(req,res)=>{
    
    const {category} = req.body || {}
    const filteredData={}
    if(category){
        filteredData ={category}
    }
    try{
        const getData=await productModel.find(filteredData)
        res.send(getData)
    }
    catch(error){
        res.status(400).json({message:"server error"})
    }
}
const deletProduct=async(req,res)=>{
    const deleteDat= await productModel.deleteOne({_id:req.params.id})

    if(deleteDat){
        res.send("success delete")
    }
}

const readSingleData=async(req,res)=>{
    const readSingle=await productModel.find({_id:req.params.id})
    if(readSingle){
        res.send(readSingle)
    }
}
const updateData=async(req,res)=>{
    const updateProduct=await productModel.updateOne(
        {_id:req.params.id},
        {$set:{
            name:req.body.name,
            price:req.body.price,
            desc:req.body.desc,
            quantity:req.body.quantity,
            category:req.body.category,
            prImage:req.file?req.file.filename:undefined
        }}
    )
    if(updateProduct){
        res.send("succes update")
    }
}

module.exports={Postproduct,ReadProduct,deletProduct,readSingleData,updateData}