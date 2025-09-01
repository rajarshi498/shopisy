const express= require('express');
const router = express.Router();
const userModel =require("../models/user-model");
const jwt= require("jsonwebtoken");
const isLoggedin = require("../middlewares/isLoggedin");
const {registerUser,loginUser,logout}= require("../controllers/authController");




//joy
router.post("/register",registerUser);
router.post("/login",loginUser);


router.get("/account", isLoggedin, async (req, res) => {
  try {
    // req.user is already attached by middleware
    let user = await userModel.findById(req.user._id).populate("cart");

    if (!user) return res.status(404).send("User not found");

    res.render("account", { user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});



router.get("/logout",logout);


module.exports = router;