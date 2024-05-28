require('dotenv').config();

const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")



// app config
const app = express()
const port = 8080

// middleware
app.use(express.json())
app.use(cors(
    {
        origin : "*"
    }
))

// DB Connect
const MONGODB_URL = "mongodb://localhost:27017/Food-Delivery"

mongoose.connect(MONGODB_URL)
    .then(() => {
        console.log(`${MONGODB_URL} connection Successful...`)
    })
    .catch((err) => {
        console.log(`Error in connecting to mongodb`, err.message)
    })

// API endpoints
const FoodRouter = require("./Routes/FoodRoute")
app.use("/", FoodRouter)

const UserRouter = require("./Routes/UserRoute")
app.use("/", UserRouter)

const CartRouter = require("./Routes/CartRoute")
app.use("/", CartRouter)

const OrderRouter = require("./Routes/OrderRoute")
app.use("/", OrderRouter)

app.use("/images", express.static('Uploads'))

app.get("/", (req, res) => {
    res.send("API WORKING")
})

app.listen(port,() => {
    console.log(`Server started on http://localhost:${port}`)
})