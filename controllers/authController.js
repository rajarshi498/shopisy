const userModel =require("../models/user-model");
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const {generateToken} = require("../utiles/generateTokens")

module.exports.registerUser=async function(req,res){
    try{
        let {email,password,fullname}= req.body;
        let user= await userModel.findOne({email:email});
        if(user)return res.status(401).send("You already have account");
        bcrypt.genSalt(10,function(err,salt){
            bcrypt.hash(password,salt,async function(err,hash){
                if(err)return res.send(err.message);
                else{
                    let user= await userModel.create({
                        email,
                        password:hash,
                        fullname,
                    });
                    let token = generateToken(user);
                    res.cookie("token",token);
                    // res.send("Registered successfully");
                    req.flash("success","Registered successfully");
                    res.redirect("/");

                }

            })
        })

    }catch(err){
        res.send(err.message);
        
    }
};



module.exports.loginUser = async function (req, res) {
  try {
    let { email, password } = req.body;

    let user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).send("Email or Password incorrect");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
    //   return res.status(401).send("Email or Password incorrect");
        req.flash("error","Email or password is incorrect");
        return res.redirect("/");
    }

    let token = generateToken(user);
    res.cookie("token", token);


    return res.redirect("/shop");
  } catch (err) {
    return res.status(500).send(err.message);
  }
};




module.exports.logout = async function (req, res) {
    try {

        let token = req.cookies.token;

        if (token) {
            let decoded = jwt.verify(token, process.env.JWT_KEY);


            await userModel.findByIdAndUpdate(
                decoded.id,
                { $set: { cart: [] } }
            );
        }


        res.cookie("token", "");
        res.redirect("/");
    } catch (err) {
        console.error("Logout error:", err);
        res.redirect("/");
    }
};

