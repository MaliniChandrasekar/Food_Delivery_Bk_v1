const Food = require("../Models/FoodModel")
const fs = require("fs")

// add food items

exports.addFood = async (req, res) => {

    let image_filename = `${req.file.filename}`

    const food = new Food({
        name : req.body.name,
        description : req.body.description,
        price : req.body.price,
        category : req.body.category,
        image : image_filename 
    })
    try{
        await food.save();
        res.json({success : true, message : "Food Added"})
    }catch (error){
        console.log(error)
        res.json({success: false, message : "Error"})
    }
}

exports.listFood = async(req, res) => {

    try{
        const foods = await Food.find({});
        res.json({success : true, data : foods})
    } catch (error){
        console.log(error)
        res.json({success : false, message : "Error"})
    }
}

exports.removeFood = async(req, res) => {

    try{
        const food = await Food.findById(req.body.id)
        fs.unlink(`Uploads/${food.image}`, () => {})

        await Food.findByIdAndDelete(req.body.id);
        res.json({success : true, message : "Food Removed"})
    } catch(error){
        console.log(error)
        res.json({success : false, message : "Error"})
    }
}
