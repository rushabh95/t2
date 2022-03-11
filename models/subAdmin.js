const mongoose = require("mongoose")

var subAdminSchema = new mongoose.Schema({
    name:{type:String},
    email:{type:String,
        unique:true},
    phone:{type:Number},
    address:{type:String},
    profileimage:{type:String,
        default:""},
    password:{type:String},
    remember_token:{type:""},
    created_at:{type:Date,
        default:Date.now()},
    updated_at:{type:Date}
})

module.exports = new mongoose.model('sub-admin',subAdminSchema)