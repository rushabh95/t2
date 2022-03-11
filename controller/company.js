const company = require("../models/company");
const superAdmin = require("../models/superAdmin");
const subAdmin = require("../models/subAdmin");

//==============================Add company===========================================//

module.exports.createCompany = async (req, res) => {
  try {
    let id = req.user.id;

    let findSuperAdmin = await superAdmin.findOne({ _id: id });
    let findSubAdmin = await subAdmin.findOne({ _id: id });

    let {
      company_name,
      company_email,
      company_contact,
      timezone,
      company_logo,
      weather_feed_location,
      currency,
      holiday_calender,
      size_in_sqft,
      occupancy_of_people,
      green_certification,
      plan_title,
      space_billing_info,
      space_subscription_info,
    } = req.body;

    let findCompany = await company.findOne({ company_email: company_email });

    if (findSuperAdmin || findSubAdmin) {
      if (!company_email) {
        let data = new company({
          company_name,
          company_email,
          company_contact,
          timezone,
          company_logo,
          weather_feed_location,
          currency,
          holiday_calender,
          size_in_sqft,
          occupancy_of_people,
          green_certification,
          plan_title,
          space_billing_info,
          space_subscription_info,
        });

        let createCompany = await data.save();
        console.log(createCompany,"createCompany");
        if(createCompany){
            res.json({
                status:200,
                success:true,
                message:"company created successfully"
            })
        }else{
            res.status(400).json({
                success:false,
                message:"something went wrong"
            })
        }
      } else {
        res.status(400).json({
          success: false,
          message: "company email already exists",
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "invalid user",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
