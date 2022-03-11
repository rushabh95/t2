const express = require('express')
const router = express.Router()
const controller = require('../controller/index')
const {verifyTokenFn} = require('../utils/jwt')


router.post('/createSubAdmin',controller.subAdmin.createSubAdmin)
router.post('/login',controller.subAdmin.login)
router.get('/showSubAdmin',verifyTokenFn,controller.subAdmin.showSubAdmin)
router.put('/updateSubAdmin',verifyTokenFn,controller.subAdmin.updateSubAdmin)
router.post('/changePassword',verifyTokenFn,controller.subAdmin.changePassword)
router.post('/forgetReset',verifyTokenFn,controller.subAdmin.forgetReset)
router.post('/forgetChange/:token',controller.subAdmin.forgetChange)

module.exports = router;