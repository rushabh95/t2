const express = require('express')
const router = express.Router()

router.use('/superAdmin',require('./superAdmin'))

module.exports = router