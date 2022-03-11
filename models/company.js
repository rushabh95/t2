const mongoose = require('mongoose')

let companySchema = new mongoose.Schema({
    company_name:{type:String},
    company_email:{type:String},
    company_contact:{type:Object},
    timezone:{type:String},
    company_logo:{type:String},
    weather_feed_location:{type:String},
    currency:{type:String},
    holiday_calender:{type:Object},
    size_in_sqft:{type:Number},
    occupancy_of_people:{type:Number},
    green_certification:{type:String},
    plan_title:{type:String},
    space_billing_info:{type:Object},
    space_subscription_info:{type:Object},
    created_by:{type:String},
    created_at:{type:Date,
                default:Date.now},
    updated_at:{type:Date}

}) 

module.exports = new mongoose.model('company',companySchema)
