import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useStateProvider } from '@/context/stateContext'
const Container = dynamic(() => import('./Container'), { ssr: false })

export default function VideoCall() {
    const [{ videoCall, socket, userInfo }] = useStateProvider()

    useEffect(() => {
        if(videoCall.type === "out-going"){
            socket.current.emit("outgoing-video-call",{
                to: videoCall.id,
                from:{ 
                id: userInfo.id,
                profile_picture: userInfo.profileImage,
                name: userInfo.name
                },
                callType: videoCall.callType
            }
        )
        }
    }, [videoCall])

    return (
         <Container data={videoCall} />
    )
}
