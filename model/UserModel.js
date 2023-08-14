const mongoose=require("mongoose")

let userSchema=mongoose.Schema({
        name: String,
        email: String,
        password: String
})

let userModel=mongoose.model("User",userSchema)

module.exports={userModel}