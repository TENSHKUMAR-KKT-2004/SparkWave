const express = require('express')

const { checkUser, userOnboarding } = require('../controllers/authController')

const router = express.Router()

router.route('/check-user').post(checkUser)
router.route('/onboard-user').post(userOnboarding)

module.exports = router