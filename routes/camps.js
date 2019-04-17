const express = require("express"),
      router  = express.Router(),
      Camp      = require("../models/camps");
     
//Routes!

router.get("/", (req,res) => {

    res.render("camps/landing");
});


router.get("/camps", (req,res) =>{
    //INDEX ROUTE
    Camp.find({}, (err,camps) =>{
        if(err){
            console.log(err);
        } else {
           res.render("camps/index", {camps:camps}); 
        }
        
    });
    
    
});

router.get("/camps/new", isLoggedIn, (req, res) =>{
    res.render("camps/new");
});


router.post("/camps", isLoggedIn, (req,res) =>{
    
    let  name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let author = {
            id: req.user._id,
            username: req.user.username 
    };
    let newCampGround = {name: name, image: image, description:description, author:author};
      
      Camp.create(newCampGround, (err,newcreate) =>{
          if(err){
              console.log(err);
          }else{
              
              res.redirect("/camps");
          }
      });
      
    
});

//show route

router.get("/camps/:id", (req,res) =>{
    Camp.findById(req.params.id).populate("comments").exec(function(err,found){
        if(err){
            console.log(err);
        }else{
             res.render("camps/show", {camps: found});
        }
    
    
    });
});

//Edit 
router.get("/camps/:id/edit",userOwnerCheck, (req,res) =>{
    if(req.isAuthenticated()){
        Camp.findById(req.params.id, (err, found) =>{
            if(err){
               res.redirect("/camps");
            } else {
                    if(found.author.id.equals(req.user._id)){
                       res.render("camps/edit", {camps: found});  
                    }else{
                        res.send("Need permission");
                    }
                }
                
                });
                
                }else{
                    res.send("Need permissions");
                }
                
            });

//update

router.put("/camps/:id", (req,res) =>{
    Camp.findByIdAndUpdate(req.params.id, req.body.camps, (err,update) =>{
        if(err){
             res.redirect("/camps");
        }
        else{
            res.redirect("/camps/" + req.params.id );
        }
       
    });
});

//Destroy

router.delete("/camps/:id", (req,res) =>{
   Camp.findByIdAndRemove(req.params.id,(err) =>{
       if(err){
           res.redirect("/camps");
       }
       else{
            res.redirect("/camps");
       }
   });
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please login first!");
    res.redirect("/login");
}

function userOwnerCheck(req,res,next){
     if(req.isAuthenticated()){
        Camp.findById(req.params.id, (err, found) =>{
            if(err){
               res.redirect("/camps");
            } else {
                    if(found.author.id.equals(req.user._id)){
                       next(); 
                    }else{
                        res.redirect("back");
                    }
                }
                
                });
                
                }else{
                    res.redirect("back");
                }
                
            }


module.exports = router;