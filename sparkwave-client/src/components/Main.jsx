import React, {useEffect, useState} from 'react'
import ChatList from './chatlist/ChatList'
import Empty from './Empty'
// import { onAuthStateChanged } from 'firebase/auth'
// import { firebaseAuth } from '@/utils/firebaseConfig'
// import axios from 'axios'
// import { CHECK_USER_ROUTE } from '@/utils/apiRoutes'
import { useRouter } from 'next/router'
import { useStateProvider } from '@/context/stateContext'
// import { reducerCases } from '@/context/constants'

export default function Main() {
    // const [redirectLogin, setRedirectLogin] = useState(false)
    const router = useRouter()

    const [{ userInfo }, dispatch] = useStateProvider()

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

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[400px_1fr] h-screen w-screen max-h-screen max-w-full overflow-hidden">
                <ChatList />
                <Empty />
            </div>
        </>
    )
}
