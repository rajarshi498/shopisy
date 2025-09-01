const express=require('express');

const db=require("./config/mongoose-connection");
const expressSession = require("express-session");
const flash = require("connect-flash");
const app=express();

const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
require("dotenv").config();


const path=require('path');
const cookieParser= require('cookie-parser');
const ownersRouter = require("./routes/ownersRouter");
const productsRouter = require("./routes/productsRouter");
const userRouter = require("./routes/userRouter");
const indexRouter= require("./views/index");


app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(
    expressSession({
        secret: process.env.EXPRESS_SESSION_SECRET || "mySuperSecretKey",
        resave: false,
        saveUninitialized: false,
        
    })
);
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});
// secret: process.env.EXPRESS_SESSION_SECRET,

app.use("/",indexRouter);

app.use("/owners",ownersRouter);
app.use("/users",userRouter);
app.use("/products",productsRouter);
app.get("/create-login",(req,res)=>{
    res.render("owner-login");
})

app.get("/place-order", (req, res) => {
    req.flash("success", "Order placed successfully!");
    res.redirect("/users/account");
});


app.listen(1231);
