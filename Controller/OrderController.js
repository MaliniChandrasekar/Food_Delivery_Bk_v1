const Order = require("../Models/OrderModel")
const User = require("../Models/UserModel")
const Stripe = require("stripe")

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// placing user order from frontend
exports.placeOrder = async (req, res) => {

    const frontend_url = "http://localhost:3000"

    try {
        const newOrder = new Order({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        })
        await newOrder.save()
        await User.findByIdAndUpdate(req.body.userId, { cartData: {} })

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 * 80
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: 2 * 100 * 80
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,

        })

        res.json({ success: true, session_url: session.url })

    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: "Error" })
    }
}

exports.verifyOrder = async (req, res) => {
    const { orderId, success } = req.body

    try {
        if (success == "true") {
            await Order.findByIdAndUpdate(orderId, { payment: true })
            res.json({ success: true, message: "Paid" })
        }
        else {
            await Order.findByIdAndDelete(orderId)
            res.json({ success: false, message: "Not Paid" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}

// user orders for frontend
exports.usersOrder = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.body.userId })
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}

// Listing orders for admin
exports.listOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}

//  api for updating order status
exports.updateStatus = async (req, res) => {
    try {
        await Order.findByIdAndUpdate(req.body.orderId, {status : req.body.status})
        res.json({success :true, message : "Status Updated"})
    } catch (error) {
        console.log(error)
        res.json({success : false, message : "Error"})
    }
}