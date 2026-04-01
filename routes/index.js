const express = require('express');
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");

router.get('/', function (req, res) {
    let error = req.flash("error");
    res.render("index", { error, loggedin: false });
})

router.get("/shop", isLoggedIn, async function (req, res) {
    let products = await productModel.find();
    let success = req.flash("success");
    res.render("shop", { products, success });
});

router.get("/cart", isLoggedIn, async function (req, res) {
    let user = await userModel
        .findOne({ email: req.user.email })
        .populate("cart");

    let cartTotal = 0;

    user.cart.forEach(item => {
        cartTotal += Number(item.price) - Number(item.discount);
    });

    cartTotal += 20;

    res.render("cart", { user, cartTotal });
});

router.get("/addtocart/:productid", isLoggedIn, async function (req, res) {
    let user = await userModel.findOne({ email: req.user.email });
    user.cart.push(req.params.productid);
    await user.save();
    req.flash("success", "Added to cart");
    res.redirect("/shop");
});

router.get("/logout", function(req, res) {
    res.cookie("token", "");
    req.flash("success", "Logged In successfully");
    res.redirect("/");
});

router.get("/removefromcart/:productid", isLoggedIn, async function (req, res) {
    try {
        let user = await userModel.findOne({ email: req.user.email });
        
        // Find the index of the specific item to remove only ONE instance 
        // (in case they added the same bag twice)
        const index = user.cart.indexOf(req.params.productid);

        if (index > -1) {
            user.cart.splice(index, 1); // Removes 1 element at that index
            await user.save();
            req.flash("success", "Removed from cart");
        } else {
            req.flash("error", "Item not found in cart");
        }

        res.redirect("/cart");
    } catch (err) {
        res.send(err.message);
    }
});

module.exports = router;