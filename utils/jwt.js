const jsonwebtoken = require('jsonwebtoken')

const jwt = {
    issueJWT: async user =>{
        let payload = {
            id : user.id,
            email: user.email
        }

        let options = {
            expiresIn: '365d'
        }

        const jwtToken = await jsonwebtoken.sign(payload,"SiGn",options)
        

        return jwtToken
    },

    verifyTokenFn: async (req,res,next)=>{
        let token = req.headers.authorization
        await jsonwebtoken.verify(token,'SiGn',function(err,decoded){
            if(err){
                return res.json({
                    status:400,
                    success: false,
                    message: 'token not found'
                })
            }else{
                req.user = {
                    id : decoded.id,
                    email: decoded.email
                }
                return next();
            }
        })
    }
}

module.exports = jwt


