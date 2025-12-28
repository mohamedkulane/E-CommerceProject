const productModel = require("../models/productModel");

const Postproduct = async (req, res) => {
    try {
        const newData = new productModel({
            name: req.body.name,
            price: req.body.price,
            desc: req.body.desc,
            quantity: req.body.quantity,
            category: req.body.category,
            prImage: req.file ? req.file.filename : "default.png",
        });
        await newData.save();
        res.status(201).send(newData);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const ReadProduct = async (req, res) => {
    try {
        const { category, status } = req.query;
        const filteredData = {};
        
        if (category) {
            filteredData.category = category;
        }
        if (status) {
            filteredData.status = status;
        }
        
        const getData = await productModel.find(filteredData);
        res.send(getData);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const deletProduct = async (req, res) => {
    try {
        const deleteDat = await productModel.findByIdAndDelete(req.params.id);
        if (deleteDat) {
            res.send({ message: "Product deleted successfully" });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const readSingleData = async (req, res) => {
    try {
        const readSingle = await productModel.findById(req.params.id);
        if (readSingle) {
            res.send(readSingle);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateData = async (req, res) => {
    try {
        const updateData = {
            name: req.body.name,
            price: req.body.price,
            desc: req.body.desc,
            quantity: req.body.quantity,
            category: req.body.category,
        };
        
        if (req.file) {
            updateData.prImage = req.file.filename;
        }
        
        const updateProduct = await productModel.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        );
        
        if (updateProduct) {
            res.send({ message: "Product updated successfully", product: updateProduct });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { Postproduct, ReadProduct, deletProduct, readSingleData, updateData };