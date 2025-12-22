const customerModel = require("../models/customerModel")
const bcyrpt = require("bcryptjs")

const createCustomer = async (req, res) => {
    try {
        const { name, phone, email,address, password } = req.body

        // check if email already exists
        const existEmail = await customerModel.findOne({ email })
        if (existEmail) {
            return res.status(400).send({ error: "the email is already" })
        } 
        
            // hash password
            const hashPassword = await bcyrpt.hash(password, 10)

            const newData = new customerModel({
                name,
                phone,
                email,
                address,
                password: hashPassword
            })

            await newData.save()
            res.send(newData)
        

    } catch (error) {
       
       return res.status(500).json({ message: "server error", error: error.message })
    }
}

const customerLogin = async (req,res) => {
    try{
        const {email,password } = req.body

        // email-check

        const existEmail = await customerModel.findOne({ email })
        if (!existEmail) {
            return res.status(400).json({ error: "invalid email" })
        } 

        const checkPassword = await bcyrpt.compare(password,existEmail.password )
        if(!checkPassword){
             return res.status(400).json({ error: "invalid password" })

        }
        
        res.send({
            message: "succes login",
            customer: {
                name: existEmail.name,
                phone: existEmail.phone,
                email: existEmail.email
            }
        })

    }catch(error){
        res.status(400).json({error: "server error"})
    }
}

const readCustomer=async(req,res)=>{
    const getCustomer=await customerModel.find()

    if(getCustomer){
        res.send(getCustomer)
    }
}

module.exports = { createCustomer, customerLogin, readCustomer }