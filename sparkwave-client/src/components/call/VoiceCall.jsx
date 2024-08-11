import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useStateProvider } from '@/context/stateContext'
const VoiceCallContainer = dynamic(() => import('./VoiceCallContainer'), { ssr: false })

export default function VoiceCall() {
    const [{ voiceCall, socket, userInfo }] = useStateProvider()

    useEffect(() => {
        if (voiceCall.type === "out-going") {
            socket.current.emit("outgoing-voice-call", {
                to: voiceCall.id,
                from: {
                    id: userInfo.id,
                    profile_picture: userInfo.profileImage,
                    name: userInfo.name
                },
                callType: voiceCall.callType
            }
            )
        }
    }, [voiceCall])

    return (
        <VoiceCallContainer data={voiceCall} />
    )
}
