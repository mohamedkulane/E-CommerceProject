const JWT=require("jsonwebtoken")

require("dotenv").config()

const verifyToken=(req,res,next)=>{
    const token =req.headers["authorization"]

    if(!token){
        return res.status(401).json({message: "no token is provided"})
    }
    try {
        const decoded=JWT.verify(token.split(" ")[1],process.env.JWT_secret)
        req.user=decoded
        next()
    } catch (error) {
        res.status(401).json({message: "invalid token"})
    }
}

module.exports={verifyToken}