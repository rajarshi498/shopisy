const express= require('express');
const router = express.Router();
const isLoggedin= require("../middlewares/isLoggedin");
const productModel = require('../models/product-model');
const userModel = require('../models/user-model');
const { disconnect } = require('mongoose');

router.get("/",function(req,res){
    let error = req.flash("error");
    res.render("index",{error, loggedin: false});
})


router.get("/shop", async (req, res) => {
    try {
        let filter = req.query.filter || "";
        let sortby = req.query.sortby || "";
        let query = {};
        let sortOption = {};

        // Filtering
        if (filter === "discounted") {
            query.discount = { $gt: 0 };
        } else if (filter === "availability") {
            query.inStock = true; // assuming you have `inStock`
        } else if (filter === "new") {
            query.createdAt = { $gte: new Date(Date.now() - 7*24*60*60*1000) };
        }

        // Sorting
        if (sortby === "newest") {
            sortOption.createdAt = -1;
        } else if (sortby === "popular") {
            sortOption.sold = -1; // assuming product has a `sold` count
        }

        let products = await productModel.find(query).sort(sortOption);

        res.render("shop", { 
            success: req.flash("success"), 
            products, 
            sortby 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});



router.get("/addtocart/:productid",isLoggedin,async function(req,res){
    let user = await userModel.findOne({email: req.user.email});
    user.cart.push(req.params.productid);
    await user.save();
    req.flash("success","Added to cart");
    res.redirect("/shop");
})
router.get("/cart", isLoggedin, async function(req, res) {
    let user = await userModel.findOne({ email: req.user.email }).populate("cart");

    let bill = 0;
    if (user.cart && user.cart.length > 0) {
        bill = user.cart.reduce((total, product) => {
            return total + (Number(product.price) - Number(product.discount));
        }, 20); 
    }

    res.render("cart", { user, bill });
});
module.exports= router;