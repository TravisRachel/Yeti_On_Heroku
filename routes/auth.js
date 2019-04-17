const express = require("express"),
      router  = express.Router(),
      passport    = require("passport"),
      User        = require("../models/user");



//Authen Routes

router.get("/register", (req,res) =>{
    res.render("register");
});


router.post("/register",(req,res) =>{
    
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err,user) =>{
        if(err){
            console.log(err);
            return res.render("register");
        }
        else{
            passport.authenticate("local")(req,res, () =>{
                res.redirect("/camps");
            });
        }
    });
});


router.get("/login", (req,res) =>{
    res.render("login");
});


router.post("/login",passport.authenticate("local", 
{
    successRedirect: "/camps",
    failureRedirect: "/login"
    
}),
    
    (req,res) =>{
    
});


router.get("/logout",(req,res) =>{
    req.logout();
    req.flash("error", "Logged out!");
    res.redirect("/camps");
}); 


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = router;