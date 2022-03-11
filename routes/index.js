const express = require('express')
const router = express.Router()

router.use('/superAdmin',require('./superAdmin'))
router.use('/subAdmin',require('./subAdmin'))
router.use('/company',require('./company'))
router.use('/plan',require('./plan'))

module.exports = router