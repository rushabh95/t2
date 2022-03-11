const express = require('express')
const router = express.Router()
const {verifyTokenFn} = require('../utils/jwt')
const controller = require('../controller/index')

router.post('/createPlan',verifyTokenFn,controller.plan.createPlan)
router.get('/showAllPlan',verifyTokenFn,controller.plan.showAllPlan)
router.put('/updatePlan',verifyTokenFn,controller.plan.updatePlan)
router.put('/deletePlan/:id',verifyTokenFn,controller.plan.deletePlan)
router.get('/showPlan',verifyTokenFn,controller.plan.showPlan)

module.exports = router