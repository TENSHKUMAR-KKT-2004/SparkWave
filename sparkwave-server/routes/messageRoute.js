const express = require('express')

const { addMessages, getMessages } = require('../controllers/messagesController')

const router = express.Router()

router.route('/send-message').post(addMessages)
router.route('/get-messages/:from/:to').get(getMessages)

module.exports = router