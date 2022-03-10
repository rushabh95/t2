const superAdmin = require('../models/superAdmin')
const bcrypt = require("bcryptjs");
const { genSalt } = require('bcrypt');
const  nodemailer  = require('nodemailer')
const { issueJWT } = require('../utils/jwt');
const params = require('params');
const otpGenerator = require('otp-generator');


//======================================mail function for reset password===================================//
function sendEmail (email,token){
    var transporter = nodemailer.createTransport({
        service: "Gmail",
        auth:{
            user:"rkawachaleems@gmail.com",
            pass:"Rushabh@471"
        }
    })

    var mailOptions = {
        from: "rkawachaleems@gmail.com",
        to:email,
        subject:"reset password",
        html:`
        <html>
        <header></header>
        <body>
        <b>Please click on this link to reset your password
        <a href="http://localhost:8080/api/v1/superAdmin/forgetChange/${token}">Link....</a></b>
        </body>
        </html>
        `
    }

    transporter.sendMail(mailOptions,function(error,info){
        if (error){
            console.log(error)
        }else{
            console.log("email sent", email + info.response)
        }
    })
}
//==================================mail function for account verification=========//

function sendVmail(email,token,otp){
    var transporter = nodemailer.createTransport({
        service: "Gmail",
        auth:{
            user:"rkawachaleems@gmail.com",
            pass:"Rushabh@471"
        }
    })
    var mailOptions = {
        from: "rkawachaleems@gmail.com",
        to:email,
        subject:"Account activation",
        html:`
        <html>
        <header></header>
        <body>
        <p>Your validation code is ${otp}
        <b>Please click on this link to activate your account
        <a href="http://localhost:8080/api/v1/superAdmin/verifyAccount/${token}">Link....</a></b></p>
        </body>
        </html>
        `
    }
    transporter.sendMail(mailOptions,function(error,info){
        if (error){
            console.log(error)
        }else{
            console.log("email sent for account activation", email + info.response)
        }
    })
return ("email sent")
} 




//===========================================create=======================================//


module.exports.createSuperAdmin = async(req,res)=>{
    try{
        
        let {name,email,password,address,phone} = req.body;
        let findEmail = await superAdmin.findOne({email:email})
        console.log(findEmail,"findEmail")
        if(findEmail){
            res.status(400).json({
                success:false,
                message:"this email already exist,please try with other email"
            })
    }else{
        let payload = {
            email:req.body.email
        }
        let token = await issueJWT(payload)
        console.log(token,"token");
        let otp = otpGenerator.generate(6, { alphabets: false, upperCase: false, specialChars: false });
        console.log(otp,"otp");
        let hashPassword = await bcrypt.hash(password,await bcrypt.genSalt(10));
        let data = new superAdmin({
            name,
            email,
            password:hashPassword,
            address,
            phone,
            remember_token:token,
            otp:otp
        })

        let createSuperAdmin = await data.save()
        console.log(createSuperAdmin,"createSuperAdmin")
        

        if (createSuperAdmin){
            var emailPart = sendVmail(email,token,otp)
            console.log(emailPart,"emailPart");
            res.json({
                status:200,
                success:true,
                message:"super admin created successfullyS",
                
            })
        }else{
            res.status(400).json({
                success: false,
                message:"something went wrong"
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
//===================================verify account======================================//

module.exports.verifyAccount = async(req,res)=>{
    try{
        let token = req.params.token
        let {otp} = req.body
        let findSuperAdmin = await superAdmin.findOne({remember_token:token})
        if(findSuperAdmin){
            let response = await superAdmin.findOne({otp:otp})
            console.log(response,"response")
            if(response){
            let update = await superAdmin.findOneAndUpdate({remember_token:token},{
                $set:{
                    isVerified:"true"
                }
            })
            res.json({
                status:200,
                success:true,
                message:"User verified account activated"
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
            message:"invalid otp"
        })
    }
         
    }catch(error){
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}





//===================================superAdmin login===================================//
module.exports.login = async (req,res)=>{
    try{
    let {email,password}= req.body; 
    let login = await superAdmin.findOne({email:email})
   let isVerify = login.isVerified
    if(isVerify==true){
   
    if(login != null){
        let comparePassword = await bcrypt.compare(password, login.password)
        if(comparePassword){ 
            let token = await issueJWT(login);
            
                    res.json({
                        status: 200,
                        success: true,
                        message: "superAdmin LogIn Successful!",
                        token: token,
                    });
        }else{
            res.status(400).json({
                success:false,
                message:"invalid password"
            })
        } 
    }else{
        res.status(400).json({
            success:false,
            message:"UnAuthorized"
        })
    }
}else{
    res.status(400).json({
        success:false,
        message:"User account is not verified "
    })
}
}catch(error){
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}


//====================================show super admin====================================//

module.exports.showSuperAdmin = async(req,res)=>{
    try{
        let { id } = req.user
         let response = await superAdmin.findOne({_id:id})
         if(response){
             res.json({
                 status:200,
                 success:true,
                 data: response
             })
         }else{
             res.status(400).json({
                 success:false,
                 message: "super admin does not exist"
             })
         }
    }catch(err){
        res.status(400).json({
            success:false,
            message: err.message
        })
    }
}
//===================================update super admin========================================//

module.exports.updateSuperAdmin = async(req,res)=>{
    try{
        let { id } = req.user
        console.log(id,'id')
        let{
            name,
            email,
            phone,
            profileimage,
            address
        }= req.body

        let findSuperAdmin = await superAdmin.findOneAndUpdate({_id:id},{
        $set: {
            name:name,
            email:email,
            phone:phone,
            profileimage:profileimage,
            address:address,
            updated_at: Date.now()

        }
    })
    if(findSuperAdmin!=""){
        res.json({
            status:200,
            success:true,
            message:"super admin updated successfully"
        })
    }else{
        res.status(400).json({
            success:false,
            message:"something went wrong"
        })
    }
        
    }catch(err){
        res.status(400).json({
            success:false,
            message:err.message
        })
    }
}
//===============================show all super admin=============================//

module.exports.showAllSuperAdmin = async(req,res)=>{
    try{
        let showAllSuperAdminData = await superAdmin.find()
        console.log(showAllSuperAdminData,"showalldata")

        if(showAllSuperAdminData.length>0){
            res.json({
                status:200,
                success:true,
                data: showAllSuperAdminData
            })
        }else{
            res.status(400).json({
                success:false,
                message:"something went wrong"
            })
        }
    }catch(err){
        res.status(400).json({
            success:false,
            message:err.message
        })
    }
}
//==============================================change password=======================//
module.exports.changePassword = async(req,res)=>{
    try{
            let {oldPassword,newPassword,confirmNewPassword} = req.body
            
            let {id}=req.user
            let findSuperAdmin = await superAdmin.findOne({_id:id})
            let data1 = findSuperAdmin.password
            let data2 = req.body.oldPassword
            let response = await bcrypt.compare(data2,data1)
            if(response===true){
                if(newPassword==confirmNewPassword){
                    let hashPassword = await bcrypt.hash(confirmNewPassword,await bcrypt.genSalt(10))
                    let updateSuperAdmin = await superAdmin.findOneAndUpdate({_id:id},{
                        $set:{
                            password:hashPassword
                        }
                    })
                    res.json({
                        status:200,
                        success:true,
                        message:"password changes successfully"
                    })
                } else{
                    res.status(400).json({
                        success:false,
                        message:"passwords does not match"
                    })
                }    
             }else{
                 res.status(400).json({
                     success:false,
                     message:"invalid old password"
                 })
             }
           
                
            
            
    }catch(error){
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}



//=======================================forget reset==========================//
module.exports.forgetReset = async(req,res)=>{
        try{
            let {email} = req.body
           let user = await superAdmin.findOne({email:email})
           if (user!=""){
               let payload= {
                   id: user._id,
                   email: user.email
               }

               let token = await issueJWT(payload)

               let update = await superAdmin.findOneAndUpdate({email:email},
                {
                    $set:{
                        remember_token: token
                    }
                })

                var emailPart = sendEmail(email,token)
                res.json({
                    status:200,
                    success:true,
                    remember_token:token
                })
           }else{
               res.status(400).json({
                   success:false,
                   message:"something went wrong"
               })
           }
        }catch(error){
            res.status(400).json({
                success:false,
                message:error.message
            })
        }
}

//=========================================forget change===============================//

module.exports.forgetChange = async(req,res)=>{
    try{
            let {newPassword,newConfirmPassword} = req.body
             let token = req.params.token

             console.log(token,"token")

             let findSuperAdmin = await superAdmin.findOne({remember_token:token})
             console.log(findSuperAdmin,"gggdfdfdfdfd");
            if(findSuperAdmin!=""){
                if(newPassword==newConfirmPassword){
                    let hashPassword = await bcrypt.hash(newConfirmPassword,await bcrypt.genSalt(10))
                    let updateSuperAdmin = await superAdmin.findOneAndUpdate({_id:findSuperAdmin.id},{
                        $set:{
                            remember_token:"",
                            password:hashPassword
                        }
                    })
                    
                    if(updateSuperAdmin!=""){
                        res.json({
                            status:200,
                            success:true,
                            message:"password reset successfull"
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
                        message:"passwords does not match"
                    })
                }
            }else{
                res.status(400).json({
                    success:false,
                    message:"user not found"
                })
            }
    }catch(error){
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}