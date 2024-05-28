const express = require("express")
const router = express.Router()
const multer = require("multer")


const FoodController = require("../Controller/FoodController")

// Image Storage Engine

const Storage = multer.diskStorage({
    destination : "uploads",
    filename : (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage : Storage})

router.post("/add", upload.single("image"), FoodController.addFood)
router.get("/list", FoodController.listFood)
router.post("/remove", FoodController.removeFood)

module.exports = router