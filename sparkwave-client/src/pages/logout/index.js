import { reducerCases } from '@/context/constants'
import { useStateProvider } from '@/context/stateContext'
import { firebaseAuth } from '@/utils/firebaseConfig'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { toast } from 'react-toastify'

export default function Index() {
  const [{ socket, userInfo }, dispatch] = useStateProvider()
  const router = useRouter()

  useEffect(() => {
    socket.current.emit("signout", userInfo.id)
    dispatch({
      type: reducerCases.SET_USER_INFO,
      userInfo: undefined
    })

    signOut(firebaseAuth)

    toast.success("You have been logged out successfully!")

    localStorage.removeItem('appState')

    router.push('/login')
  }, [socket])
  return (
    <div className="bg-conversation-panel-background">
    </div>
  )
}
