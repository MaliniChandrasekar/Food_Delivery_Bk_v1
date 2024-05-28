const User = require("../Models/UserModel")

// add items to userCart
exports.addToCart = async (req, res) => {
    try{
        let userData = await User.findById(req.body.userId)
        let cartData = await userData.cartData;
        if( !cartData[req.body.itemId] ){
            cartData[req.body.itemId] = 1
        }
        else{
            cartData[req.body.itemId] += 1
        }
        await User.findByIdAndUpdate(req.body.userId, {cartData})
        res.json({success : true, message : "Added to Cart"})
    }catch (error){
        console.log(error)
        return res.json({success : false, message : "Error"})
    }
} 

//  remove item from UserCart
exports.removeFromCart = async (req, res) => {
    try{
        let userData = await User.findById(req.body.userId)
        let cartData = await userData.cartData
        if(cartData[req.body.itemId] > 0){
            cartData[req.body.itemId] -= 1
        }
        await User.findByIdAndUpdate(req.body.userId, {cartData})
        res.json({success : true, message : "Removed From Cart"})
    }catch (error){ 
        console.log(error)
        return res.json({success : false, message : "Error"})
    }
}

// fetch UserCart data
exports.getCart = async (req, res) => {
    try{
        let userData = await User.findById(req.body.userId)
        let cartData = await userData.cartData
        return res.json({success : true, cartData})
    }catch (error){
        console.log(error)
        return res.json({success : true, message : "Error"})
    }
}