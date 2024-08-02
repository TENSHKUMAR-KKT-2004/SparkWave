import Avatar from '@/components/common/avatar'
import Input from '@/components/common/input'
import { useStateProvider } from '@/context/stateContext'
import { ONBOARD_USER_ROUTE } from '@/utils/apiRoutes'
import axios from 'axios'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { reducerCases } from '@/context/constants';
import { useRouter } from 'next/router';

export default function index() {
    const [{ userInfo, newUser , onBoarded }, dispatch] = useStateProvider()
    const [name, setName] = useState(userInfo?.name || "")
    const [about, setAbout] = useState("")
    const [image, setImage] = useState('/default_avatar.png')

    const router = useRouter()

    useEffect(() => {
        if(!newUser && !userInfo?.email && !onBoarded){
            router.push("/login")
        } else if(!newUser && userInfo?.email && onBoarded){
            router.push('/')
        }
    }, [newUser, userInfo, onBoarded, router])

    const onboardUserHandler = async () => {
        if (validateDetails()) {
            const email = userInfo?.email
            try {
                const { data } = await axios.post(ONBOARD_USER_ROUTE, {
                    email,
                    name,
                    about,
                    image
                })

                if (data.status) {
                    dispatch({
                        type: reducerCases.SET_NEW_USER,
                        newUser: false
                    })

                    dispatch({
                        type: reducerCases.SET_USER_INFO,
                        userInfo: {
                            id: data.data.id,
                            name, 
                            email, 
                            profileImage: image, 
                            status: about
                        },
                        onBoarded:true
                    })

                    const serializedState = JSON.stringify({
                        userInfo:{
                        id: data.data.id,
                        name,
                        email,
                        profileImage: image,
                        status: about
                        },
                        newuser: false,
                        onBoarded:true
                    })
                    await localStorage.setItem('appState', serializedState)

                    router.push('/')
                }
            } catch (err) {
                console.log(err)
            }
        }
    }

    const validateDetails = () => {
        if (name.length < 3) {
            return false
        }
        return true
    }

    return (
        <div className="bg-panel-header-background min-h-screen min-w-screen text-white flex flex-col items-center justify-center">
            <div className="flex items-center justify-center gap-2">
                <Image
                    src="/SparkWave.gif"
                    alt="SparkWave"
                    height={300}
                    width={300}
                    unoptimized
                />
                <span className="text-7xl">
                    SparkWave
                </span>
            </div>
            <h2 className="text-2xl">
                Create your profile
            </h2>
            <div className="flex gap-6 mt-6 ">
                <div className="flex flex-col items-center justify-center mt-5 gap-6">
                    <Input name="Display Name" required={false} state={name} setState={setName} label />
                    <Input name="About" required={true} state={about} setState={setAbout} label />
                    <div className="flex items-center justify-center">
                        <button
                            onClick={onboardUserHandler}
                            className="flex items-center justify-center gap-7 bg-search-input-container-background p-5 rounded-lg">
                            Create Profile
                        </button>
                    </div>
                </div>
                <div>
                    <Avatar type="xl" image={image} setImage={setImage} />
                </div>
            </div>
        </div>
    )
}
