const superAdmin = require('./superAdmin')
const subAdmin = require('./subAdmin')
const company = require('./company')
const plan = require('./plan')

const controller = {
    superAdmin,
    subAdmin,
    company,
    plan
}

module.exports = controller