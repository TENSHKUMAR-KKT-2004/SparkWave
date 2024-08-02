const express = require('express')

const { checkUser, userOnboarding, getAllUsers } = require('../controllers/authController')

const router = express.Router()

router.route('/check-user').post(checkUser)
router.route('/onboard-user').post(userOnboarding)
router.route('/get-contacts').get(getAllUsers)

module.exports = router