const mongoose =require("mongoose")
const AutoIncrement = require('mongoose-sequence')(mongoose);
const ProductSchema=mongoose.Schema({
    name:{type:String, required:true},
    price:{
        type:Number,
        required:true},
    desc:{
        type:String,
        },
    quantity:{
        type:Number,
        required:true
    },

    category:{
        type:String,
        required:true
    },
    prImage:{
        type:String,
        required:true
    },
    status:{
        type:String, enum:["avialable","out of Stock" ], default:"avialable"
    }

}, {timestamps: true})

ProductSchema.plugin(AutoIncrement, { inc_field: 'prId' });
ProductSchema.pre("save", function(next){
    this.status=this.quantity>0 ? "avialable" :"out of Stock"
    next()
})
ProductSchema.pre("updateOne",function(next){
    const update=this.getUpdate()
    const quantity=update.$set?.quantity

    if(quantity != undefined){
        update.$set.status =quantity>0?"avialable" : "out of Stock"
    }
    next()
})
module.exports=mongoose.model("Products", ProductSchema)