import { reducerCases } from '@/context/constants';
import { useStateProvider } from '@/context/stateContext';
import { CHECK_USER_ROUTE } from '@/utils/apiRoutes';
import { firebaseAuth } from '@/utils/firebaseConfig';
import axios from 'axios';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import Image from 'next/image'
import { useRouter } from 'next/router';
import React, { useEffect } from "react";
import { FcGoogle } from 'react-icons/fc'

function Index() {
    const router = useRouter()
    const [{ userInfo, newUser }, dispatch] = useStateProvider()

    useEffect(() => {
        if (userInfo?.id && !newUser) {
            router.push('/')
        }
    }, [userInfo, newUser])

    const handleLogin = async () => {
        const provider = new GoogleAuthProvider()

        try {
            const { user: { displayName: name, email, photoURL: profileImage } } = await signInWithPopup(firebaseAuth, provider)

            if (email) {
                const { data } = await axios.post(CHECK_USER_ROUTE, { email })

                if (!data.status) {
                    dispatch({
                        type: reducerCases.SET_NEW_USER,
                        newUser: true,
                    })

                    dispatch({
                        type: reducerCases.SET_USER_INFO,
                        userInfo: {
                            name, email, profileImage, status: ""
                        },
                        onBoarded: false
                    })

                    router.push('/onboarding')
                } else {
                    dispatch({
                        type: reducerCases.SET_USER_INFO,
                        userInfo: {
                            id: data.data.id,
                            name: data.data.name,
                            email: data.data.email,
                            profileImage: data.data.profile_picture,
                            status: data.data.about
                        },
                        onBoarded: true
                    })

                    const serializedState = JSON.stringify(
                        {
                            userInfo: {
                                id: data.data.id,
                                name: data.data.name,
                                email: data.data.email,
                                profileImage: data.data.profile_picture,
                                status: data.data.about
                            },
                            newuser: false,
                            onBoarded: true
                        }

                    )
                    await localStorage.setItem('appState', serializedState)

                    router.push('/')
                }
            }
        } catch (err) {
            console.error(err.message)
        }
    }

    return (
        <div className="flex justify-center items-center bg-panel-header-background min-h-screen min-w-screen flex-col gap-6">
            <div className="flex items-center justify-center gap-2 text-white">
                <Image
                    src="/SparkWave.gif"
                    alt="SparkWave"
                    height={300}
                    width={300}
                    unoptimized
                />
                <span className="text-7xl">SparkWave</span>
            </div>
            <button
                onClick={handleLogin}
                className="flex items-center justify-center gap-7 bg-search-input-container-background p-5 rounded-lg">
                <FcGoogle className="text-4xl" />
                <span className="text-white text-2xl">Login with Google</span>
            </button>
        </div>
    )
}

export default index;