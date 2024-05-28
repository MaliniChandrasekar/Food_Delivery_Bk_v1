const User = require("../Models/UserModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const validator = require("validator")

// Login User
exports.loginUser = async (req, res) => {
    const {email, password} = req.body
    try{
        const user = await User.findOne({email})

        if( !user ){
            return res.json({success : false, message: "User doen't exist"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if( !isMatch ){
            return res.json({success : false, message : "Invalid credentials"})
        }

        const token = createToken(user._id)
        res.json({success : true, token})

    }catch (error){
        console.log(error)
        res.json({success : false, message : "Error"})
    }
}

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET)
}

//  register User
exports.registerUser = async (req, res) => {
    const {name, password, email} = req.body;
    try{
        const exists = await User.findOne({email});
        if(exists){
            return res.json({success : false, message : "User already exists"})
        }

        // validating email format and strong password
        if(!validator.isEmail(email)){
            return res.json({success : false, message : "Please enter valid email"})
        } 

        if(password.length < 8){
            return res.json({success : false, message : "Please enter a strong password"})
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            name : name,
            email : email,
            password : hashedPassword
        })

        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({success : true, token})

    }catch (error){ 
        console.log(error)
        res.json({success : false, message : "Error"})
    }
}