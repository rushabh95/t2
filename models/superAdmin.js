const mongoose = require('mongoose')

var superAdminSchema = new mongoose.Schema({
    name:{type:String},
    email:
           {type:String,
           unique: true
            },
    profileimage:
           {type:String,
            default:""
           },
    phone:{type:Number},
    password:{type:String},
    address:{type:String},
    remember_token:"",
    otp:{type:"String",
       default:""},
    isVerified:{ type:Boolean,
              default:false},
    created_at:{type:Date,
               default:Date.now()},
    updated_at:{type:Date}
})

module.exports = new mongoose.model('super-admin',superAdminSchema)


