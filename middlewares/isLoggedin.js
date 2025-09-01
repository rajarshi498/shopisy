const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

module.exports = async function (req, res, next) {
  try {
    // check token in cookies
    const token = req.cookies?.token;  // <-- FIXED (added ? for safety)

    if (!token) {
      req.flash("error", "Need to login");
      return res.redirect("/");
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    // find user
    const user = await userModel.findOne({ email: decoded.email }).select("-password");

    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/");
    }

    req.user = user;
    next();
  } catch (err) {
    req.flash("error", "Something went wrong.");
    res.redirect("/");
  }
};
