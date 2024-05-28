const express = require("express")
const router = express.Router()

const authMiddleware = require("../Middleware/Auth")
const OrderController = require("../Controller/OrderController")

router.post("/placeorder", authMiddleware , OrderController.placeOrder)
router.post("/verifyorder", OrderController.verifyOrder)
router.get("/getorder", authMiddleware , OrderController.usersOrder)
router.get("/listorders", OrderController.listOrders)
router.post("/status", OrderController.updateStatus)

module.exports = router