import { reducerCases } from '@/context/constants'
import { useStateProvider } from '@/context/stateContext'
import { SEND_IMAGE_MESSAGE_ROUTE, SEND_MESSAGE_ROUTE } from '@/utils/apiRoutes'
import axios from 'axios'
import React, { useState, useRef, useEffect } from 'react'
import { BsEmojiSmile } from "react-icons/bs"
import { ImAttachment } from "react-icons/im"
import { MdSend } from "react-icons/md"
import EmojiPicker from 'emoji-picker-react'
import PhotoPicker from '../common/PhotoPicker'
import { FaMicrophone } from 'react-icons/fa'

import dynamic from 'next/dynamic'

const CaptureAudio = dynamic(()=> import('../common/CaptureAudio '),{ssr:false})

export default function MessageBar() {
  const [{ userInfo, currentChatUser, socket }, dispatch] = useStateProvider()
  const [message, setMessage] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const emojiPickerRef = useRef(null)
  const [grabPhoto, setGrabPhoto] = useState(false)
  const [showAudioRecorder, setShowAudioRecorder] = useState()

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.id !== 'emoji-open') {
        if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
          setShowEmojiPicker(false)
        }
      }
    }

    document.addEventListener('click', handleOutsideClick)

    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [])

  useEffect(() => {
    if (grabPhoto) {
      const data = document.getElementById("photo-picker")
      data.click()
      document.body.onfocus = (e) => {
        setTimeout(() => {
          setGrabPhoto(false)
        }, 1000)
      }
    }

  }, [grabPhoto])

  const photoPickerChange = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('image', file)
    try {
      const res = await axios.post(SEND_IMAGE_MESSAGE_ROUTE, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        params: {
          from: userInfo.id,
          to: currentChatUser.id
        }
      })

      if (res.status === 201) {
        socket.current.emit('send-message', {
          to: currentChatUser.id,
          from: userInfo.id,
          message: res.data.message,
          user: userInfo
        })

        dispatch({
          type: reducerCases.ADD_NEW_MESSAGE,
          newMessage: {
            ...res.data.message
          },
        })

        dispatch({
          type: reducerCases.UPDATE_USER_CONTACTS,
          newMessage: {
            ...res.data.message,
            senderId: userInfo.id,
            recieverId: currentChatUser.id,
          },
          fromSelf: true,
          user : currentChatUser
        })

        setMessage('')
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleEmojiModel = () => {
    setShowEmojiPicker(!showEmojiPicker)
  }

  const handleEmojiClick = (emoji) => {
    setMessage((prevMessage) => (prevMessage += emoji.emoji))
  }

  const sendMessage = async () => {
    try {
      const { data } = await axios.post(SEND_MESSAGE_ROUTE, {
        to: currentChatUser.id,
        from: userInfo.id,
        message
      })

      socket.current.emit('send-message', {
        to: currentChatUser.id,
        from: userInfo.id,
        message: data.message,
        user: userInfo
      })

      dispatch({
        type: reducerCases.ADD_NEW_MESSAGE,
        newMessage: {
          ...data.message
        }
      })

      dispatch({
        type: reducerCases.UPDATE_USER_CONTACTS,
        newMessage: {
          ...data.message,
          senderId: userInfo.id,
          recieverId: currentChatUser.id,
        },
        fromSelf: true,
        user : currentChatUser
      })

      setMessage('')
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="bg-panel-header-background h-20 px-4 flex items-center gap-6 relative">
      {
        !showAudioRecorder &&
        <>
          <div className="flex gap-6">
            <BsEmojiSmile
              className="text-panel-header-icon cursor-pointer text-xl"
              title='Emoji'
              id="emoji-open"
              onClick={handleEmojiModel}
            />
            {
              showEmojiPicker && <div className="absolute bottom-24 left-16 z-40" ref={emojiPickerRef}>
                <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
              </div>
            }
            <ImAttachment
              className="text-panel-header-icon cursor-pointer text-xl"
              title='Attach File'
              onClick={() => setGrabPhoto(true)}
            />
            {
              grabPhoto && <PhotoPicker onChange={photoPickerChange} />
            }
          </div>

          <div className="w-full rounded-lg h-10 flex items-center">
            <input type="text" placeholder="Type a message"
              className="bg-input-background text-sm focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-full"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
          </div>
          <div className="flex w-10 items-center justify-center">

            <button>
              {
                message.length ?
                  <MdSend
                    className="text-panel-header-icon cursor-pointer text-xl"
                    title='Send message'
                    onClick={sendMessage}
                  /> :
                  <FaMicrophone
                    className="text-panel-header-icon cursor-pointer text-xl"
                    title='Record voice message'
                    onClick={() => setShowAudioRecorder(true)}
                  />
              }
            </button>
          </div>
        </>
      }
      {
        showAudioRecorder && <CaptureAudio hide={setShowAudioRecorder} />
      }
    </div>
  )
}
