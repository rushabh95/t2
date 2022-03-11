const express = require('express')
const router = express.Router()
const {verifyTokenFn} = require('../utils/jwt')
const controller = require('../controller/index')

router.post('/createCompany',verifyTokenFn,controller.company.createCompany)

module.exports = router