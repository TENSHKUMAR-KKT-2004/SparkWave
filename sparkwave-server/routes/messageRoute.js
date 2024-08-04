const express = require('express')
const multer = require("multer")
const path = require('path')
const fs = require('fs')

const { addMessages, getMessages, addImageMessage, addAudioMessage } = require('../controllers/messagesController')

const router = express.Router()

const uploadImageDir = path.join(__dirname, '../uploads/images')
const uploadAudioDir = path.join(__dirname, '../uploads/recordings')

if (!fs.existsSync(uploadImageDir)){
    fs.mkdirSync(uploadImageDir, { recursive: true })
}

if (!fs.existsSync(uploadAudioDir)){
    fs.mkdirSync(uploadAudioDir, { recursive: true })
}

const ImgStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadImageDir)
    },
    filename: (req, file, cb) => {
        const date = Date.now()
        const ext = path.extname(file.originalname)
        const filename = `${date}${ext}`
        cb(null, filename)
    }
})

const AudioStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadAudioDir)
    },
    filename: (req, file, cb) => {
        const date = Date.now()
        const ext = path.extname(file.originalname)
        const filename = `${date}${ext}`
        cb(null, filename)
    }
})

const uploadImage = multer({storage: ImgStorage})
const uploadAudio = multer({storage: AudioStorage})

router.route('/send-message').post(addMessages)
router.route('/get-messages/:from/:to').get(getMessages)
router.route('/send-image-message').post(uploadImage.single('image'),addImageMessage)
router.route('/send-audio-message').post(uploadAudio.single('audio'),addAudioMessage)

module.exports = router