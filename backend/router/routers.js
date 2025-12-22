const express=require("express")
const uploadImage=require("../middleware/uploadimage")
const PostController=require("../controller/contrlles")

const router=express.Router()

router.post("/create/ProductPost", uploadImage.single("img"), PostController.Postproduct)
router.get("/read/ProductPost", PostController.ReadProduct)
router.delete("/delete/ProductPost/:id", PostController.deletProduct)
router.get("/readSingle/ProductPost/:id", PostController.readSingleData)
router.put("/update/ProductPost/:id", uploadImage.single("img"), PostController.updateData)


module.exports=router
