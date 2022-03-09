const express = require('express')
const router = express.Router()
const controller = require('../controller/index')
const {verifyTokenFn} = require('../utils/jwt')

router.post('/createSuperAdmin',controller.superAdmin.createSuperAdmin)
router.post('/login',controller.superAdmin.login)
router.get('/showSuperAdmin',verifyTokenFn, controller.superAdmin.showSuperAdmin)
router.put('/updateSuperAdmin',verifyTokenFn, controller.superAdmin.updateSuperAdmin)
router.get('/showAllSuperAdmin',verifyTokenFn, controller.superAdmin.showAllSuperAdmin)
router.put('/changePassword',verifyTokenFn,controller.superAdmin.changePassword)
router.post('/forgetReset',verifyTokenFn,controller.superAdmin.forgetReset)
router.post('/forgetChange/:token',controller.superAdmin.forgetChange)

module.exports = router;
