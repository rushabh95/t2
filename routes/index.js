const express = require('express')
const router = express.Router()

router.use('/superAdmin',require('./superAdmin'))
router.use('/subAdmin',require('./subAdmin'))

module.exports = router