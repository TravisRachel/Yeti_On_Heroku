const express = require("express"),
      router  = express.Router({mergeParams: true}),
      Camp      = require("../models/camps"),
      Comment       = require("../models/comments");
      
//====================================
//Comments///

router.get("/new", isLoggedIn, (req,res) =>{
   Camp.findById(req.params.id, (err,camps) =>{
       if(err){
           console.log(err);
       }else{
           res.render("comments/new", {camps: camps});
       }
   });
    
});


router.post("/", isLoggedIn, (req,res) => {
   Camp.findById(req.params.id, (err, camp) =>{
       if(err){
           console.log(err.message);
           res.send ( 500 );
       }
      else{
          req.body = req.body || {};
          if ( typeof req.body.comment.text !== 'string' && req.body.comment.text ) req.body.text = '';
          if ( typeof req.body.comment.author !== 'string' && req.body.comment.author ) req.body.author = '';
           console.log ( req.body );
          Comment.create({ text: req.body.comment.text, author: req.body.comment.author }, (err,comment) =>{
              if(err){
                  console.log(err);
                  res.redirect("/camps");
                res.send ( 400 );
              }else{
                 comment.author.id = req.user._id;
                 comment.author.username = req.user.username;
                 comment.save()
                  camp.comments.push(comment);
                  camp.save ();
                  res.redirect("/camps/"+req.params.id);
                  console.log(req.body.comment);
              }
               
       
          });
      }
   });
});

//edii comments
router.get("/:comment_id/edit", checkCommentUser, (req,res) =>{
    Comment.findById(req.params.comment_id, (err,comments) =>{
        if(err){
            res.redirect("back");
        }else{
             res.render("comments/edit", {camps_id: req.params.id, comment: comments});
        }
    });
   
});

//Update comments

router.put("/:comment_id", checkCommentUser, (req,res) =>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err,update) =>{
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/camps/" + req.params.id);
        }
    });
});


//Destroy

router.delete("/:comment_id",checkCommentUser, (req,res) =>{
   Comment.findByIdAndRemove(req.params.comment_id, (err) =>{
       if(err){
           res.redirect("back");
       }else{
             res.redirect("back");
       }
   });
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login");
    }
    
}




function checkCommentUser (req,res,next){
     if(req.isAuthenticated()){
        Camp.findById(req.params.comment_id, (err, found) =>{
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