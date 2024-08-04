import React, { useEffect, useState, useRef } from 'react'
import ChatList from './chatlist/ChatList'
import Empty from './Empty'
// import { onAuthStateChanged } from 'firebase/auth'
// import { firebaseAuth } from '@/utils/firebaseConfig'
// import axios from 'axios'
// import { CHECK_USER_ROUTE } from '@/utils/apiRoutes'
import { useRouter } from 'next/router'
import { useStateProvider } from '@/context/stateContext'
import Chat from './chat/Chat'
import axios from 'axios'
import { GET_MESSAGES_ROUTE, HOST } from '@/utils/apiRoutes'
import { reducerCases } from '@/context/constants'
// import { reducerCases } from '@/context/constants'
import {io} from 'socket.io-client'

export default function Main() {
    // const [redirectLogin, setRedirectLogin] = useState(false)
    const router = useRouter()
    const socket = useRef()
    const [ socketEvent, setSocketEvent ] = useState(false)

    const [{ userInfo, currentChatUser }, dispatch] = useStateProvider()

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

    useEffect(()=>{
        if(userInfo){
            socket.current = io(HOST)
            socket.current.emit("add-user", userInfo.id)

            dispatch({
                type: reducerCases.SET_SOCKET,
                socket: socket
            })
        }
    }, [userInfo])

    useEffect(()=>{
        if(socket.current && !socketEvent){
            socket.current.on('msg-recieve',(data)=>{
                dispatch({
                    type: reducerCases.ADD_MESSAGE,
                    newMessage: {
                        ...data.message
                    }
                })
            })
            setSocketEvent(true)
        }
    },[socket.current])

    useEffect(() => {
        const getMessages = async () => {
            const { data: { messages } } = await axios.get(`${GET_MESSAGES_ROUTE}/${userInfo.id}/${currentChatUser?.id}`)

            dispatch({
                type: reducerCases.SET_MESSAGES,
                messages
            })
        }
        if(currentChatUser?.id){
            getMessages()
        }
    }, [currentChatUser])

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[400px_1fr] h-screen w-screen max-h-screen max-w-full overflow-hidden">
                <ChatList />
                {
                    currentChatUser ? <Chat /> : <Empty />
                }

            </div>
        </>
    )
}
