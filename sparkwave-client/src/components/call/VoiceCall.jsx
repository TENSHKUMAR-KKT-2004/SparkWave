import React from 'react'
import dynamic from 'next/dynamic'
import { useStateProvider } from '@/context/stateContext'
const Container = dynamic(()=> import('./Container'),{ssr:false})

export default function VoiceCall() {
    const [{VoiceCall,socket,userInfo}] = useStateProvider()

    return ( 
      <Container data={VoiceCall} />
    )
}
