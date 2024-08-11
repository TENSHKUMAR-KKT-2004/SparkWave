import React, { useEffect, useState, useRef } from 'react'
import ChatList from './chatlist/ChatList'
import Empty from './Empty'
// import { onAuthStateChanged } from 'firebase/auth'
// import { firebaseAuth } from '@/utils/firebaseConfig'
// import { CHECK_USER_ROUTE } from '@/utils/apiRoutes'
import { useRouter } from 'next/router'
import { useStateProvider } from '@/context/stateContext'
import Chat from './chat/Chat'
import axios from 'axios'
import { GET_MESSAGES_ROUTE, HOST, UPDATE_MESSAGE_STATUS } from '@/utils/apiRoutes'
import { reducerCases } from '@/context/constants'
// import { reducerCases } from '@/context/constants'
import { io } from 'socket.io-client'
import SearchMessages from './chat/SearchMessages'
import VideoCall from './call/VideoCall'
import VoiceCall from './call/VoiceCall'
import IncomingVoiceCall from './call/IncomingVoiceCall'
import IncomingVideoCall from './call/IncomingVideoCall'

export default function Main() {
    // const [redirectLogin, setRedirectLogin] = useState(false)
    const router = useRouter()
    const socket = useRef()
    const [socketEvent, setSocketEvent] = useState(false)
    const [handleMessage, setHandleMessage] = useState(false)
    const [messageData, setMessageData] = useState(null)

    const [{ userInfo, messages, onBoarded, currentChatUser, messagesSearch, videoCall, voiceCall, incomingVoiceCall, incomingVideoCall }, dispatch] = useStateProvider()

    useEffect(() => {
        if (!userInfo?.email && !onBoarded) {
            router.push("/login")
        } else if (userInfo?.email && !onBoarded) {
            router.push('/onboarding')
        }
    }, [userInfo, onBoarded, router])

    // useEffect(() => {
    //     if (redirectLogin) {
    //         router.push('/login')
    //     }
    // }, [redirectLogin])

    // onAuthStateChanged(firebaseAuth, async (currentUser) => {
    //     if (!currentUser) {
    //         setRedirectLogin(true)
    //     }

    //     if (!userInfo && currentUser?.email) {
    //         const { data } = await axios.post(CHECK_USER_ROUTE, { email: currentUser.email })
    //         if (!data.status) {
    //             router.push('/login')
    //         }

    //         dispatch({
    //             type: reducerCases.SET_USER_INFO,
    //             userInfo: {
    //                 id: data.data.id,
    //                 name: data.data.name,
    //                 email: data.data.email,
    //                 profileImage: data.data.profile_picture,
    //                 status: data.data.about
    //             },
    //             onBoarded: true
    //         })

    //         const serializedState = JSON.stringify(
    //             {
    //                 userInfo: {
    //                     id: data.data.id,
    //                     name: data.data.name,
    //                     email: data.data.email,
    //                     profileImage: data.data.profile_picture,
    //                     status: data.data.about
    //                 },
    //                 newuser: false,
    //                 onBoarded: true
    //             }

    //         )
    //         await localStorage.setItem('appState', serializedState)
    //     }
    // })

    useEffect(() => {
        if (userInfo) {
            socket.current = io(HOST)

            socket.current.emit("add-user", userInfo.id)

            dispatch({
                type: reducerCases.SET_SOCKET,
                socket: socket
            })
        }
    }, [userInfo])

    const handleMessageReceive = (data) => {
        if (!currentChatUser) return

        const isFromCurrentChatUser = data.message.senderId === currentChatUser.id

        if (isFromCurrentChatUser) {
            dispatch({
                type: reducerCases.ADD_NEW_MESSAGE,
                newMessage: {
                    ...data.message
                }
            })
        }
        setHandleMessage(false)
        setMessageData(null)
    }

    useEffect(() => {
        if (socket.current && !socketEvent) {
            socket.current.on('message-recieve', (data) => {
                dispatch({
                    type: reducerCases.UPDATE_USER_CONTACTS,
                    newMessage: {
                        ...data.message
                    },
                    fromSelf: false,
                    user: data.user
                })

                setHandleMessage(true)
                setMessageData(data)
            }
            )

            socket.current.on('message-readed', async (chatUser) => {
                dispatch({
                    type: reducerCases.UPDATE_MESSAGE_STATUS,
                    userID: chatUser
                })

                const response = await axios.post(UPDATE_MESSAGE_STATUS, { senderId: userInfo.id, receiverId: chatUser.chatUser })
            })

            socket.current.on('online-users', (data) => {
                dispatch({
                    type: reducerCases.SET_ONLINE_USERS,
                    onlineUsers: data.onlineUsers
                })
            })

            socket.current.on("incoming-voice-call", ({ from, roomId, callType }) => {
                dispatch({
                    type: reducerCases.SET_INCOMING_VOICE_CALL,
                    incomingVoiceCall: {
                        ...from, roomId, callType
                    }
                })
            })

            socket.current.on("incoming-video-call", ({ from, roomId, callType }) => {
                dispatch({
                    type: reducerCases.SET_INCOMING_VIDEO_CALL,
                    incomingVideoCall: {
                        ...from, roomId, callType
                    }
                })
            })

            setSocketEvent(true)
        }
    }, [messages, socket.current])

    useEffect(() => {
        const getMessages = async () => {
            const { data: { messages } } = await axios.get(`${GET_MESSAGES_ROUTE}/${userInfo.id}/${currentChatUser?.id}`)

            dispatch({
                type: reducerCases.SET_MESSAGES,
                messages
            })
        }
        if (currentChatUser?.id) {
            getMessages()

            if (handleMessage) {
                handleMessageReceive(messageData)
            }
        }
    }, [currentChatUser, messageData, handleMessage])

    return (
        <>

            {
                incomingVideoCall && <IncomingVideoCall />
            }

            {
                incomingVoiceCall && <IncomingVoiceCall />
            }

            {
                videoCall && <div className="h-screen w-screen max-h-full overflow-hidden">
                    <VideoCall />
                </div>
            }

            {
                voiceCall && <div className="h-screen w-screen max-h-full overflow-hidden">
                    <VoiceCall />
                </div>
            }

            {/* grid-col-1 md:grid-cols-[300px_1fr] lg:grid-cols-[400px_1fr] */}
            {!videoCall && !voiceCall && <div className="grid grid-cols-[300px_1fr] lg:grid-cols-[400px_1fr] md:grid-cols-[300px_1fr]  h-screen w-screen max-h-screen max-w-full overflow-hidden">
                <ChatList />
                {
                    currentChatUser ?
                        <div className={messagesSearch ? "grid grid-cols-2" : "grid-cols-2"}>
                            <Chat />
                            {
                                messagesSearch && <SearchMessages />
                            }
                        </div> : <Empty />
                }

            </div>
            }
        </>
    )
}
