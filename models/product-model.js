const mongoose = require('mongoose');


const productSchema = mongoose.Schema({
    image: Buffer,
    name: String,
    price: Number,
    password: String,
    discount: {
        type: Number,
        default: 0
    },
    bgcolor: String,
    panelcolor: String,
    textcolor: String,
},{timestamps:true});

module.exports= mongoose.model("product",productSchema);