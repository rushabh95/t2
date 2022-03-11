var mongoose = require('mongoose')

const planSchema = new mongoose.Schema({
    title:{type:String},
    description:{type:String},
    price:{type:Number},
    features:{type:String},
    modules:{type:String},
    sub_modules:{type:String},
    duration:{type:Number},
    offer_price:{type:String},
    discount_percentage:{type:Number},
    is_deleted:{type:Boolean,
            default:0},
    created_at:{type:Date,default:Date.now},
    updated_at:{type:Date}

})

module.exports = new mongoose.model('plan',planSchema)
