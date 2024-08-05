import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useStateProvider } from '@/context/stateContext'
const Container = dynamic(() => import('./Container'), { ssr: false })

export default function VideoCall() {
    const [{ videoCall, socket, userInfo }] = useStateProvider()

    useEffect(() => {
        if(voiceCall.type === "out-going"){
            socket.current.emit("outgoing-voice-call",{
                to: voiceCall.id,
                from:{ 
                id: userInfo.id,
                profilePicture: userInfo.profile_picture,
                name: userInfo.name
                },
                callType: voiceCall.callType,
                roomId: voiceCall.roomId
            }
        )
        }
    }, [voiceCall])

    return (
        <Container data={videoCall} />
    )
}
