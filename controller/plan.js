const plan = require('../models/plan')
const subAdmin = require('../models/subAdmin')
const superAdmin = require('../models/superAdmin')
const company = require('../models/company')

//================================add plan===========================================//

module.exports.createPlan = async(req,res)=>{
    try{
        let id = req.user.id
        let { title,
            description,
            feature,
            module,
            sub_module,
            price,
            duration,
            offer_price,
            discount_percentage
                                } = req.body
        let findSuperAdmin = await superAdmin.findOne({_id:id})
        let findSubAdmin = await subAdmin.findOne({_id:id})
        console.log(findSuperAdmin,findSubAdmin);

        if(findSuperAdmin||findSubAdmin){
                if(findSubAdmin.permission_to_add_plans==true){
                    let findPlan = await plan.findOne({title:req.body.title})
                    if (findPlan){
                    let data = new plan({
                        title,
                        description,
                        feature,
                        module,
                        sub_module,
                        price,
                        duration,
                        offer_price,
                        discount_percentage
                    })

                    let createPlan = await data.save();
                    if(createPlan){
                        res.json({
                            status:200,
                            success:true,
                            message:"plan added successfully"
                        })
                    }else{
                        res.status(400).json({
                            success:false,
                            message:"something went wrong"
                        })
                    }
                }else{
                    res.status(400).json({
                        success:false,
                        message:"plan already exist"
                    })
                }
                }else{
                    res.status(400).json({
                        success:false,
                        message:"user does not have access for this"
                    })
                }
                
        }else{
            let findPlan = await plan.findOne({title:req.body.title})
            if (findPlan){
            let data = new plan({
                title,
                description,
                feature,
                module,
                sub_module,
                price,
                duration,
                offer_price,
                discount_percentage
            })

            let createPlan = await data.save();
            if(createPlan){
                res.json({
                    status:200,
                    success:true,
                    message:"plan added successfully"
                })
            }else{
                res.status(400).json({
                    success:false,
                    message:"something went wrong"
                })
            }
        }else{
            res.status(400).json({
                success:false,
                message:"plan already exist"
            })
        }
            
        }

    }catch(error){
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}
//===========================================show plan==============================//

module.exports.showAllPlan = async(req,res)=>{
    try{
          let id = req.user.id
          let findSubAdmin = await subAdmin.findOne({_id:id})
          let findSuperAdmin = await superAdmin.findOne({_id:id})
            if(findSuperAdmin||findSubAdmin){
                  let allPlan = await plan.find()
                  console.log(allPlan);
                  if(allPlan.length > 0){
                      res.json({
                          status:200,
                          success:true,
                          data:allPlan
                      })
                  }else{
                      res.status(400).json({
                          success:false,
                          message:"something went wrong"
                      })
                  }
            }else{
                res.status(400).json({
                    success:false,
                    message:"UnAuthorized"
                })
            }

    }catch(error){
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}

//===========================================update plan==============================//

module.exports.updatePlan = async(req,res)=>{
    try{
        let id = req.user.id
        let {title,
            description,
            feature,
            module,
            sub_module,
            price,
            duration,
            offer_price,
            discount_percentage} = req.body
        let findSubAdmin = await subAdmin.findOne({_id:id})
        let findSuperAdmin = await superAdmin.findOne({_id:id})
          if(findSuperAdmin||findSubAdmin){
            let findPlan = await plan.findOne({title:title})
            if(findPlan!=""){
                let update = await plan.findOneAndUpdate({title:title},{
                    $set:{
                        title:title,
                        description:description,
                        feature:feature,
                        module:module,
                        sub_module:sub_module,
                        price:price,
                        duration:duration,
                        offer_price:offer_price,
                        discount_percentage:discount_percentage 
                    }
                })

                if(update){
                    res.json({
                        status:200,
                        success:true,
                        message:"plan updated successfully"
                    })
                }else{
                    res.status(400).json({
                        success:false,
                        message:"something went wrong"
                    })
                }
            }
          }else{
            res.status(400).json({
                success:false,
                message:"UnAuthorized"
            })
          }
    }catch(error){
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}
//======================================delete plan====================================//

module.exports.deletePlan = async(req,res)=>{
    try{
       let id = req.user.id
       let planId = req.params.id
       console.log(planId,"planid");
       let findSubAdmin = await subAdmin.findOne({_id:id})
        let findSuperAdmin = await superAdmin.findOne({_id:id})
        if(findSuperAdmin||findSubAdmin){
            let findPlan = await plan.findOneAndUpdate({_id:planId},{
                $set:{
                    is_deleted:1,
                    updated_at:Date.now()
                }
            })
            if(findPlan){
                res.json({
                    status:200,
                    success:true,
                    message:"plan deleted successfully"
                })
            }else{
                res.status(400).json({
                    success:false,
                    message:"something went wrong"
                })
            }
        }else{
            res.status(400).json({
                success:false,
                message:"UnAuthorized"
            })
        }

    }catch(error){
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}
//================================show plan=========================================//
module.exports.showPlan = async(req,res)=>{
    try{
          let id = req.user.id
          let {title} = req.body
          let findSubAdmin = await subAdmin.findOne({_id:id})
          let findSuperAdmin = await superAdmin.findOne({_id:id})
            if(findSuperAdmin||findSubAdmin){
                  let findPlan = await plan.findOne({title:title})
                  if(findPlan){
                      if(findPlan.is_deleted==false){
                      res.json({
                          status:200,
                          success:true,
                          data:findPlan
                      })
                    }else{
                        res.status(400).json({
                            success:false,
                            message:"something went wrong"
                        })
                    }
                  }else{
                      res.status(400).json({
                          success:false,
                          message:"plan dont exist"
                      })
                  }
            }else{
                res.status(400).json({
                    success:false,
                    message:"UnAuthorized"
                })
            }

    }catch(error){
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}