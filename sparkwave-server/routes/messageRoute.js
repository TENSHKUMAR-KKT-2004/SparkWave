const express = require('express')
const multer = require("multer")
const path = require('path')
const fs = require('fs')

const { addMessages, getMessages, addImageMessage } = require('../controllers/messagesController')

const router = express.Router()

const uploadDir = path.join(__dirname, '../uploads/images')
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const date = Date.now()
        const ext = path.extname(file.originalname)
        const filename = `${date}${ext}`
        cb(null, filename)
    }
})

const uploadImage = multer({storage})

router.route('/send-message').post(addMessages)
router.route('/get-messages/:from/:to').get(getMessages)
router.route('/send-image-message').post(uploadImage.single('image'),addImageMessage)

module.exports = router