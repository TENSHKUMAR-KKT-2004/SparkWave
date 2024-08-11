import { useStateProvider } from '@/context/stateContext'
import { calculateTime } from '@/utils/calculateTime'
import React, { useRef, useEffect, useState } from 'react'
import MessageStatus from '../common/MessageStatus'
import ImageMessage from './ImageMessage'

import dynamic from 'next/dynamic'
import { reducerCases } from '@/context/constants'
const VoiceMessage = dynamic(() => import('./VoiceMessage'), { ssr: false })

export default function ChatContainer() {
  const [{ socket, onlineUsers, messages, currentChatUser, userInfo }, dispatch] = useStateProvider()
  const [isBottom, setIsBottom] = useState(false)
  const [newMessage, setNewMessage] = useState(false)

  const messagesEndRef = useRef(null)
  const previousMessagesLength = useRef(0)
  const emittedRef = useRef(false)

  useEffect(() => {
    if (messages && messages.length > 0) {
      {
        if (messages.length > previousMessagesLength.current) {
          setNewMessage(true)
          emittedRef.current = false
        } else {
          setNewMessage(false)
        }
        previousMessagesLength.current = messages.length
      }
    }
  }, [messages])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })

      if (messages && messages.length > 0) {
        const lastMessage = messages[messages.length - 1]

        dispatch({
          type: reducerCases.UPDATE_TOTAL_UNREAD_MESSAGES,
          lastMessage
        })
      }

      if (isBottom && !emittedRef.current) {
        emittedRef.current = true
        if (onlineUsers[currentChatUser.id]) {
          socket.current.emit('message-status', { from: userInfo.id, to: onlineUsers[currentChatUser.id] })
        }
      }
    }
  }, [messages, isBottom, socket, onlineUsers, currentChatUser.id, userInfo.id])

  const handleScroll = () => {
    const bottom = messagesEndRef.current.getBoundingClientRect().bottom <= window.innerHeight
    setIsBottom(bottom)
    if (bottom) {
      emittedRef.current = false
    }
  }

  useEffect(() => {
    if (newMessage) {
      if (messagesEndRef.current && isBottom) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [newMessage])

  return (
    <div className="h-[80vh] w-full relative flex-grow overflow-auto custom-scrollbar" onScroll={handleScroll}>
      <div className="bg-chat-background bg-fixed h-full w-full opacity-5 fixed z-0"></div>
      <div className="mx-10 my-6 relative bottom-0 z-40 left-0">
        <div className="flex w-full ">
          <div className="flex flex-col justify-end w-full gap-1 overflow-auto">
            {
              messages && messages.map((message, index) => {
                return (<div key={message.id} className={`flex ${message.senderId === currentChatUser.id ? 'justify-start' : 'justify-end'}`}>
                  {message.type === 'text' && (
                    <div className={`text-white px-2 py-[5px] rounded-md flex gap-2 items-end max-w-[45%] ${message.senderId === currentChatUser.id ? 'bg-incoming-background' : 'bg-outgoing-background'}`}>
                      <span className="break-all">{message.message}</span>
                      <div className="flex gap-1 items-end">
                        <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
                          {
                            calculateTime(message.createdAt)
                          }
                        </span>
                        <span>
                          {
                            message.senderId === userInfo.id && <MessageStatus messageStatus={message.messageStatus} />
                          }
                        </span>
                      </div>
                    </div>
                  )}
                  {
                    message.type === 'image' && (
                      <ImageMessage message={message} />
                    )
                  }
                  {
                    message.type === 'audio' && (
                      <VoiceMessage message={message} />
                    )
                  }
                </div>
                )
              })
            }
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </div>
  )
}
