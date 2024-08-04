const express = require('express')
const multer = require("multer")

const { addMessages, getMessages, addImageMessage } = require('../controllers/messagesController')

const router = express.Router()

const uploadImage = multer({ dest: 'uploads/images'})

router.route('/send-message').post(addMessages)
router.route('/get-messages/:from/:to').get(getMessages)
router.post('/add-image-message',uploadImage.single('image'),addImageMessage)

module.exports = router