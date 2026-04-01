const express = require('express');
const router = express.Router();
const ownerModel = require("../models/owner-model");

// 1. GET: Show the Login Page
router.get('/', function (req, res) {
    res.render("owner-login", { user: null }); 
});

// 2. POST: Process the Login Submission
router.post('/login', async function (req, res) {
    let { email, password } = req.body;
    
    // Find the owner by email
    let owner = await ownerModel.findOne({ email: email });

    if (!owner) {
        // If owner doesn't exist, send back to login
        return res.redirect("/owners");
    }

    // Check password (In production, use bcrypt.compare)
    if (owner.password === password) {
        res.redirect("/owners/admin");
    } else {
        res.redirect("/owners");
    }
});

// 3. POST: Create Owner (Only in Development)
if (process.env.NODE_ENV === "development") {
    router.post('/create', async function (req, res) {
        let owners = await ownerModel.find();
        if (owners.length > 0) {
            return res
                .status(500)
                .send("You don't have permission to create a new owner");
        }

        let { fullname, email, password } = req.body;
        let createdOwner = await ownerModel.create({
            fullname,
            email,
            password,
        });
        res.status(201).send(createdOwner);
    })
};

// 4. GET: Admin Dashboard (Create Products)
router.get('/admin', function (req, res) {
    let success = req.flash("success");
    res.render("createproducts", { success, user: null }); 
});

router.get("/create-my-account", async function (req, res) {
    let owner = await ownerModel.create({
        fullname: "Md Mihran Sohail",
        email: "admin@cartify.com",
        password: "your-password"
    });
    res.send("Owner Created! Now delete this route from your code.");
});

module.exports = router;