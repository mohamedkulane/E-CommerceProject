// controller/adminController.js - Ku beddel
const adminModel = require("../models/adminModel")
const bcyrpt = require("bcryptjs")
const jwt=require("jsonwebtoken")

const createAdmin = async (req, res) => {
    try {
        const { name, email, password, role } = req.body

        // check if email already exists
        const existEmail = await adminModel.findOne({ email })
        if (existEmail) {
            return res.status(400).send({ error: "the email is already" })
        } 
        
        // hash password
        const hashPassword = await bcyrpt.hash(password, 10)

        const newData = new adminModel({
            name,
            email,
            password: hashPassword,
            role: role || "admin"  // <-- TAN BAA LAGU DARAY!
        })

        await newData.save()
        res.send(newData)

    } catch (error) {
       return res.status(500).json({ message: "server error", error: error.message })
    }
}

const adminLogin = async (req,res) => {
    try{
        const {email,password } = req.body

        // email-check
        const existEmail = await adminModel.findOne({ email })
        if (!existEmail) {
            return res.status(400).json({ error: "invalid email" })
        } 

        const checkPassword = await bcyrpt.compare(password,existEmail.password )
        if(!checkPassword){
             return res.status(400).json({ error: "invalid password" })
        }
        
        // XAL DEGDEG AH: Marka hore u samee admin-ka email-kaaga
        if (email === "mohamedkulane@gmail.com" && existEmail.role !== "admin") {
            existEmail.role = "admin";
            await existEmail.save();
            console.log(`✅ ${email} role-ka loo beddelay 'admin'`);
        }
        
        const token= jwt.sign(
            {id:existEmail._id, name:existEmail.name, email:existEmail.email, role:existEmail.role},
            process.env.JWT_secret,
            {expiresIn:"1h"}
        )

        res.send({
            message: "succes login",
            Admin: {
                name: existEmail.name,
                email: existEmail.email,
                role: existEmail.role
            },
            token
        })

    }catch(error){
        res.status(400).json({error: "server error"})
    }
}

module.exports = { createAdmin, adminLogin }