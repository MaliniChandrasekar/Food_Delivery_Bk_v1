const express = require("express")
const router = express.Router()

const authMiddleware = require("../Middleware/Auth")
const CartController = require("../Controller/CartController")

router.post("/addcart",authMiddleware, CartController.addToCart)
router.post("/removecart",authMiddleware, CartController.removeFromCart)
router.get("/getcart",authMiddleware, CartController.getCart)

module.exports = router