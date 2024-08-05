import { useStateProvider } from '@/context/stateContext'
import React, {useState} from 'react'

export default function Container({data}) {
    const [{socket, userInfo}, dispatch] = useStateProvider()
    const [callAccepted, setCallAccepted] = useState(false)

  return (
    <div>Container</div>
  )
}
