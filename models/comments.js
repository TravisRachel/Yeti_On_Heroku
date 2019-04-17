const mongoose = require("mongoose");


 
const commentSchema =  mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        },
        username: String
    }
    
});
 
module.exports = mongoose.model("Comment", commentSchema);










