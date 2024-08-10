import { reducerCases } from '@/context/constants'
import { useStateProvider } from '@/context/stateContext'
import { firebaseAuth } from '@/utils/firebaseConfig'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/router'
import React,{ useEffect } from 'react'

export default function index() {
    const [{socket, userInfo}, dispatch ] = useStateProvider()
    const router = useRouter()
    
    useEffect(()=>{
        socket.current.emit("signout", userInfo.id)
        dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: undefined
        })

        signOut(firebaseAuth)

        localStorage.removeItem('appState')

        router.push('/login')
    }, [socket])
  return (
    <div className="bg-conversation-panel-background"></div>
  )
}
