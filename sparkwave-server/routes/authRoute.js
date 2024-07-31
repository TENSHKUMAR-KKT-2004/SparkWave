const express = require('express')

const { checkUser } = require('../controllers/authController')

const router = express.Router()

router.route('/check-user').post(checkUser)

module.exports = router