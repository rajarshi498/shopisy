const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owner-model");
const bcrypt=require('bcrypt');
const {generateToken} = require("../utiles/generateTokens");
const isLoggedin= require("../middlewares/isLoggedin");
const productModel = require("../models/product-model");


// router.post("/create", async function (req, res) {
//   try {
//     let owners = await ownerModel.find();
//     if (owners.length > 0) {
//       return res.status(403).send("You don't have permission");
//     }

//     let { fullname, email, password } = req.body;

//     let createdOwner = await ownerModel.create({
//       fullname,
//       email,
//       password,
//       isadmin: true, // or false depending on your logic
//     });

//     res.status(201).send(createdOwner);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server error");
//   }
// });
router.post("/create", async (req, res)=>{
    try{
        let {email,password,fullname}= req.body;
        let owner= await ownerModel.findOne();
        if(owner)return res.status(401).send("You already have account");
        bcrypt.genSalt(10,function(err,salt){
            bcrypt.hash(password,salt,async function(err,hash){
                if(err)return res.send(err.message);
                else{
                    let owner= await ownerModel.create({
                        email,
                        password:hash,
                        fullname,
                    });
                }

            })
        })

    }catch(err){
        res.send(err.message);
        
    }
});
router.post("/login",async (req, res)=>{
  try {
    let { email, password } = req.body;

    let owner = await ownerModel.findOne({ email });
    if (!owner) {
      return res.status(401).send("Email or Password incorrect");
    }

    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) {
      return res.status(401).send("Email or Password incorrect");
    }

    let token = generateToken(owner);
    res.cookie("token", token);

    // ✅ only one response
    return res.redirect("/owners/admin");
  } catch (err) {
    return res.status(500).send(err.message);
  }
});






router.get("/admin", async function(req, res) {
  try {
    // Fetch all products from MongoDB
    let products = await productModel.find();

    // Flash success message (if any)
    let success = req.flash("success");

    // Render EJS template with products and success message
    res.render("createproducts", { success, products });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;












// const express= require('express');
// const router = express.Router();
// const ownerModel= require("../models/owner-model");

// if(process.env.NODE_ENV === "development"){
//     router.post("/create",async function(req,res){
//         let owners= await ownerModel.find();
//         if(owners.length>0){
//             return res.status(503).send("You don't have permission");
//         }
//         let {fullname,email,password}= req.body;
//         let createdOwner=await ownerModel.create({
//             fullname,
//             email,
//             password,
//             isadmin: false,
//         });
//         res.status(201).send(createdOwner);
//     })
// }
// router.get("/admin",function(req,res){
//     let success = req.flash("success");
//     res.render("createproducts",{success});
// })

// module.exports = router;
