const orderModel = require("../models/ordersModel");
const productModel = require("../models/productModel");
const customerModel = require("../models/customerModel");
const nodemailer = require("nodemailer"); // For email notifications

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // Or your email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const createOrder = async (req, res) => {
    try {
        const { customer, products, customerEmail, customerId } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({ error: "Products are required" });
        }

        let TotalAmount = 0;
        let orderProducts = [];

        for (let item of products) {
            const productData = await productModel.findById(item.productId);

            if (!productData) {
                return res.status(400).json({ error: `Product ${item.productId} not found` });
            }

            if (item.quantity > productData.quantity) {
                return res.status(400).json({ error: `Product ${productData.name} is out of stock or insufficient quantity` });
            }

            let price = productData.price;
            let total = price * item.quantity;
            TotalAmount += total;

            // Update product quantity
            productData.quantity -= item.quantity;
            await productData.save();

            orderProducts.push({
                productId: productData._id,
                productName: productData.name,
                quantity: item.quantity,
                price,
                total
            });
        }

        if (!customer) {
            return res.status(400).json({ message: "Customer is required" });
        }

        const newOrder = new orderModel({
            TotalAmount,
            customer,
            products: orderProducts,
            customerEmail,
            customerId,
            status: "pending"
        });

        await newOrder.save();

        // Send confirmation email to customer
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: customerEmail || customer,
                subject: 'Order Confirmation - Your Order Has Been Received',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #4F46E5;">Order Confirmation</h2>
                        <p>Dear ${customer},</p>
                        <p>Thank you for your order! Your order has been received and is being processed.</p>
                        <h3>Order Details:</h3>
                        <p><strong>Order ID:</strong> ${newOrder._id}</p>
                        <p><strong>Total Amount:</strong> $${TotalAmount.toFixed(2)}</p>
                        <p><strong>Status:</strong> Pending</p>
                        <p>We will notify you once your order is confirmed and shipped.</p>
                        <p>Best regards,<br>Your Store Team</p>
                    </div>
                `
            });
        } catch (emailError) {
            console.log("Email sending failed:", emailError.message);
            // Continue even if email fails
        }

        res.status(201).send(newOrder);

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const readOrder = async (req, res) => {
    try {
        console.log("🔍 Starting to read orders...");
        
        // FIX: Use correct model name in populate
        const getOrder = await orderModel.find()
            .populate({
                path: 'products.productId',
                select: 'name price category',
                model: 'Products' // <- Change "Product" to "Products"
            })
            .populate({
                path: 'customerId',
                select: 'name email phone',
                model: 'customer' // <- Keep lowercase "customer"
            })
            .sort({ createdAt: -1 });
            
        console.log("✅ Populated orders successfully");
        res.status(200).send(getOrder);
        
    } catch (error) {
        console.error("❌ Error in readOrder:", error.message);
        
        // Fallback: return orders without populate
        const orders = await orderModel.find().sort({ createdAt: -1 });
        res.status(200).json(orders);
    }
};

// Get single order by ID
const getOrderById = async (req, res) => {
    try {
        const order = await orderModel.findById(req.params.id)
            .populate('products.productId', 'name price category')
            .populate('customerId', 'name email phone');
        
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.send(order);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNote } = req.body;

        console.log(`🔄 Updating order ${id} to status: ${status}`);

        const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        // Find order without validation
        const order = await orderModel.findById(id);
        
        if (!order) {
            console.log(`❌ Order ${id} not found`);
            return res.status(404).json({ error: "Order not found" });
        }

        console.log(`📦 Found order: ${order._id}, current status: ${order.status}`);

        // Store old status before updating
        const oldStatus = order.status;
        
        // Update fields
        order.status = status;
        
        // Only add adminNote if field exists in schema
        if (adminNote && order.schema.path('adminNote')) {
            order.adminNote = adminNote;
        }

        // ✅ FIX: Save without validating the entire document
        await order.save({ validateBeforeSave: false });
        
        console.log(`✅ Order ${order._id} saved with new status: ${status}`);

        // If order is cancelled, restore product quantities
        if (status === "cancelled" && oldStatus !== "cancelled") {
            console.log(`🔄 Restoring quantities for cancelled order`);
            for (let item of order.products) {
                try {
                    const product = await productModel.findById(item.productId);
                    if (product) {
                        product.quantity += item.quantity;
                        await product.save();
                        console.log(`✅ Restored ${item.quantity} units to product ${product.name}`);
                    }
                } catch (productError) {
                    console.error(`❌ Error restoring product:`, productError.message);
                }
            }
        }

        // Return success response
        res.json({
            success: true,
            message: `Order status updated from ${oldStatus} to ${status}`,
            order: {
                id: order._id,
                customer: order.customer,
                status: order.status,
                TotalAmount: order.TotalAmount
            }
        });

    } catch (error) {
        console.error("❌ Error in updateOrderStatus:", error.message);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

const getTotalIncome = async (req, res) => {
    try {
        const total = await orderModel.aggregate([
            {
                $group: { _id: null, TotalIncome: { $sum: "$TotalAmount" } }
            }
        ]);
        res.send(total.length > 0 ? total[0] : { TotalIncome: 0 });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getTopCustomers = async (req, res) => {
    try {
        const topCustomers = await orderModel.aggregate([
            {
                $group: {
                    _id: "$customer",
                    totalSpend: { $sum: "$TotalAmount" },
                    orderCount: { $sum: 1 },
                    email: { $first: "$customerEmail" }
                }
            },
            { $sort: { totalSpend: -1 } },
            { $limit: 5 }
        ]);
        
        res.json(
            topCustomers.map(item => ({
                customer: item._id,
                totalSpend: item.totalSpend,
                orderCount: item.orderCount,
                email: item.email
            }))
        );
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get revenue over time
const getRevenueOverTime = async (req, res) => {
    try {
        const { period = 'monthly' } = req.query;
        
        let groupByFormat;
        switch(period) {
            case 'daily': groupByFormat = '%Y-%m-%d'; break;
            case 'weekly': groupByFormat = '%Y-%u'; break;
            case 'monthly': groupByFormat = '%Y-%m'; break;
            case 'yearly': groupByFormat = '%Y'; break;
            default: groupByFormat = '%Y-%m';
        }

        const revenueData = await orderModel.aggregate([
            {
                $match: {
                    status: { $ne: 'cancelled' }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: groupByFormat, date: "$createdAt" }
                    },
                    revenue: { $sum: "$TotalAmount" },
                    orders: { $sum: 1 },
                    avgOrderValue: { $avg: "$TotalAmount" }
                }
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    period: "$_id",
                    revenue: 1,
                    orders: 1,
                    avgOrderValue: 1,
                    _id: 0
                }
            }
        ]);

        res.status(200).json(revenueData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get most sold products
const getMostSoldProducts = async (req, res) => {
    try {
        const topProducts = await orderModel.aggregate([
            { $unwind: "$products" },
            {
                $group: {
                    _id: "$products.productId",
                    productName: { $first: "$products.productName" },
                    totalSold: { $sum: "$products.quantity" },
                    totalRevenue: { $sum: { $multiply: ["$products.quantity", "$products.price"] } }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 10 },
            {
                $project: {
                    _id: 0,
                    productId: "$_id",
                    productName: 1,
                    totalSold: 1,
                    totalRevenue: 1
                }
            }
        ]);

        res.status(200).json(topProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get sales by category
const getSalesByCategory = async (req, res) => {
    try {
        const productSales = await orderModel.aggregate([
            { $unwind: "$products" },
            {
                $lookup: {
                    from: "products",
                    localField: "products.productId",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            { $unwind: "$productDetails" },
            {
                $group: {
                    _id: "$productDetails.category",
                    totalSold: { $sum: "$products.quantity" },
                    totalRevenue: { $sum: { $multiply: ["$products.quantity", "$products.price"] } },
                    productCount: { $addToSet: "$products.productId" }
                }
            },
            {
                $project: {
                    category: "$_id",
                    totalSold: 1,
                    totalRevenue: 1,
                    uniqueProducts: { $size: "$productCount" },
                    _id: 0
                }
            },
            { $sort: { totalRevenue: -1 } }
        ]);

        res.status(200).json(productSales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    createOrder, 
    readOrder, 
    getOrderById,
    updateOrderStatus,
    getTotalIncome, 
    getTopCustomers,
    getRevenueOverTime,
    getMostSoldProducts,
    getSalesByCategory 
};