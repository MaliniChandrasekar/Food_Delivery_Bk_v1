const jwt = require("jsonwebtoken")

async function authMiddleware(req, res, next)  {
    const{token} = req.headers

    if(!token){
        return res.json({succes : false, message : "Not Authorized Login Again"})
    }
    try{
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        req.body.userId = token_decode.id;
        next()
    }catch (error){
        console.log(error)
        return res.json({success : false, message : "Error"})
    }
}

module.exports = authMiddleware