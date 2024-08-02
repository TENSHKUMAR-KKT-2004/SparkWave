import React from 'react'
import Image from 'next/image'

export default function Empty() {
  return (
    <div className="border-conversation-border border-l w-full bg-panel-header-background flex flex-col h-[100vh] border-b-4 border-b-icon-green items-center justify-center">
        <Image src="/SparkWave.gif" alt="SparkWave" unoptimized height={300} width={300}/>
    </div>
  )
}
