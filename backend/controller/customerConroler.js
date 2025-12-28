const customerModel = require("../models/customerModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createCustomer = async (req, res) => {
    try {
        const { name, phone, email, address, password } = req.body;

        // Check if email already exists
        const existEmail = await customerModel.findOne({ email });
        if (existEmail) {
            return res.status(400).send({ error: "Email already exists" });
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        const newData = new customerModel({
            name,
            phone,
            email,
            address,
            password: hashPassword,
            role: "user" // Default role
        });

        await newData.save();
        res.status(201).send(newData);

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

const customerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Email check
        const existEmail = await customerModel.findOne({ email });
        if (!existEmail) {
            return res.status(400).json({ error: "Invalid email" });
        }

        // Password check
        const checkPassword = await bcrypt.compare(password, existEmail.password);
        if (!checkPassword) {
            return res.status(400).json({ error: "Invalid password" });
        }

        // Create token
        const token = jwt.sign(
            { 
                id: existEmail._id, 
                name: existEmail.name, 
                email: existEmail.email, 
                role: existEmail.role 
            },
            process.env.JWT_secret,
            { expiresIn: "24h" }
        );

        res.send({
            message: "Login successful",
            customer: {
                id: existEmail._id,
                name: existEmail.name,
                phone: existEmail.phone,
                email: existEmail.email,
                address: existEmail.address,
                role: existEmail.role
            },
            token
        });

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

const readCustomer = async (req, res) => {
    try {
        const getCustomer = await customerModel.find({}, { password: 0 });
        res.send(getCustomer);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

const getCustomerById = async (req, res) => {
    try {
        const customer = await customerModel.findById(req.params.id, { password: 0 });
        if (!customer) {
            return res.status(404).json({ error: "Customer not found" });
        }
        res.send(customer);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = { createCustomer, customerLogin, readCustomer, getCustomerById };