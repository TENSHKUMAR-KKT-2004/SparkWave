const express = require('express')

const { addMessages } = require('../controllers/messagesController')

const router = express.Router()

router.route('/send-message').post(addMessages)

module.exports = router