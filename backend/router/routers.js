const express = require("express")
const uploadImage = require("../middleware/uploadimage")
const PostController = require("../controller/contrlles")
const { verifyToken, verifyAdmin } = require("../middleware/verifyToken")

const router = express.Router()

// Public routes
router.get("/read/ProductPost", PostController.ReadProduct)
router.get("/readSingle/ProductPost/:id", PostController.readSingleData)

// Admin only routes
router.post("/create/ProductPost", verifyToken, verifyAdmin, uploadImage.single("img"), PostController.Postproduct)
router.delete("/delete/ProductPost/:id", verifyToken, verifyAdmin, PostController.deletProduct)
router.put("/update/ProductPost/:id", verifyToken, verifyAdmin, uploadImage.single("img"), PostController.updateData)

module.exports = router