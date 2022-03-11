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
    permission_to_add_plans:{type:Boolean},
    permission_to_add_company:{type:Boolean},
    permission_to_view_plans:{type:Boolean},
    permission_to_view_company:{type:Boolean},
    created_at:{type:Date,
        default:Date.now},
    updated_at:{type:Date}
})

module.exports = new mongoose.model('sub-admin',subAdminSchema)