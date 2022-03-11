const subAdmin = require('../models/subAdmin')
const bcrypt = require("bcryptjs");
const { genSalt } = require('bcrypt');
const  nodemailer  = require('nodemailer')
const { issueJWT } = require('../utils/jwt');
const params = require('params');
const { login } = require('./superAdmin');

//===============================email function for reset password============//

function sendEmail(email,token){
        var transporter = nodemailer.createTransport({
            service:"Gmail",
            auth:{
                user:"rkawachaleems@gmail.com",
                pass:"Rushabh@471"
            }
        })
        var mailOptions = {
            from : "rkawachaleems@gmail.com",
            to:email,
            subject:"reset password link",
            html:`<html>
            <header></header>
            <body>
            <b>Please click on this link to reset your password</b>
            <a href="http://localhost:8080/api/v1/subAdmin/changepassword/${token}">Link...</a>
            </body>
            </html>           
            `
            
        }
        transporter.sendMail(mailOptions,function(err,info){
            if (err){
                console.log(err)
            }else{
                console.log("email sent for reset password" + info.response)
            }
        })

        return("email sent for reset password")
}


//===============================create sub admin=================================//

module.exports.createSubAdmin = async(req,res)=>{
    try{
     let {name,email,password,phone,address} = req.body
     let findEmail = await subAdmin.findOne({email:email})
     console.log(findEmail,"findEmail");
     let hashPassword = await bcrypt.hash(password,await bcrypt.genSalt(10))
     console.log(hashPassword,"hashPassword");
     if (findEmail){
         res.status(400).json({
             success:false,
             message: "sub admin already exist"
         })
     }else{
         let data = new subAdmin ({
             name:name,
             email:email,
             password:hashPassword,
             phone:phone,
             address:address
         })

         let createSubAdmin = await data.save();
        
         if (createSubAdmin){
             res.json({
                 status:200,
                 success:true,
                 message:"sub admin added successfully"
             })
         }else{
             res.status(400).json({
                 success:false,
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
//==========================================sub admin login=========================//

module.exports.login = async(req,res)=>{
    try{
         let {email,password} = req.body
        let login = await subAdmin.findOne({email:email})

        if (login != ""){
            let response = await bcrypt.compare(password,login.password)
            if(response == true){
                let token = await issueJWT(login)
                res.json({
                    status:200,
                    success:true,
                    message:"sub admin login success",
                    token:token
                })
            }else{
                res.status(400).json({
                    success:false,
                    message:"invalid password"
                })
            }
        }else{
            res.status(400).json({
                success:false,
                message:"sub admin not found"
            })
        }
    }catch(error){
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}
//======================================show sub admin=================================//

module.exports.showSubAdmin = async(req,res)=>{
    try{
         let {id} = req.user
         let findSubAdmin = await subAdmin.findOne({id:id})
         if (findSubAdmin){
             res.json({
                 status:200,
                 success:true,
                 data: findSubAdmin
             })
         }else{
             res.status(400).json({
                 success:false,
                 message:"sub admin not found"
             })
         }
    }catch(error){
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}
//=========================================update sub admin==========================//

module.exports.updateSubAdmin = async(req,res)=>{
    try{
         let {id}= req.user
         let {name,email,phone,address} = req.body
         let updateSubAdmin = await subAdmin.findOneAndUpdate({_id:id},{
             $set:{
                 name:name,
                 email:email,
                 phone:phone,
                 address:address,
                 updated_at: Date.now()
             }
         })
         if (updateSubAdmin){
             res.json({
                 status:200,
                 success:true,
                 message:"sub admin updated successfully"
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
//================================change password================================//

module.exports.changePassword = async(req,res)=>{
    try{
      let {id} = req.user
      let {password,confirmPassword} = req.body
      let change = await subAdmin.findOne({_id:id})
      console.log(change,"change");
      if (password==confirmPassword){
          let hashPassword = await bcrypt.hash(confirmPassword,await bcrypt.genSalt(10))
          let update = await subAdmin.findOneAndUpdate({_id:id},{
              $set:{
                  password:hashPassword
              }
          })
          console.log(update,"update");

          if(update){
              res.json({
                  status:200,
                  success:true,
                  message:"password changed successfully"
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
    }catch(error){
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}

//====================================forget reset=================================//

module.exports.forgetReset = async(req,res)=>{
    try{
        let {email} = req.body
       let user = await subAdmin.findOne({email:email})
       if (user!=""){
           let payload= {
               id: user._id,
               email: user.email
           }

           let token = await issueJWT(payload)

           let update = await subAdmin.findOneAndUpdate({email:email},
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

         let findSubAdmin = await subAdmin.findOne({remember_token:token})
         console.log(findSubAdmin,"gggdfdfdfdfd");
        if(findSubAdmin!=""){
            if(newPassword==newConfirmPassword){
                let hashPassword = await bcrypt.hash(newConfirmPassword,await bcrypt.genSalt(10))
                let updateSubAdmin = await subAdmin.findOneAndUpdate({_id:findSubAdmin.id},{
                    $set:{
                        remember_token:"",
                        password:hashPassword
                    }
                })
                
                if(updateSubAdmin!=""){
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