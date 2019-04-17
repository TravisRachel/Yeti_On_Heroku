const express  = require("express"),
 app           = express(),
 bodyParser    = require("body-parser"),
 mongoose      = require("mongoose"),
 Camp          = require("./models/camps"),
 passport      = require("passport"),
 flash         =require("connect-flash"),
 LocalStrategy = require("passport-local"),
 methodOverride =require("method-override"),
 User           = require("./models/user"),
 Comment        = require("./models/comments");
  
 //required packages^^^
 
 const PORT = process.env.PORT || 5500;
 
 
//App config

mongoose.connect("mongodb+srv://Travis:Yellow.333@t-ui7yy.mongodb.net/test?retryWrites=true", {useNewUrlParser: true}); 


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname +"/public"));
app.use(methodOverride("_method"));

app.use((req,res,next) =>{
    res.locals.currentUser = req.user;
   
    next();
});

app.use(flash());

//passport configs ^^

app.use(require("express-session")({
    secret:  "yeti",
    resave: false,
    saveUnitiaized: false
}));



//passport configs
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Router configs
const campRoutes   = require("./routes/camps"),
       commentsRoutes   = require("./routes/cooments"),
       authRoutes   = require("./routes/auth");
 
 
app.use(campRoutes);
app.use("/camps/:id/comments",commentsRoutes);
app.use(authRoutes);







app.listen(PORT, () => console.log(`Listening on ${ PORT }`))