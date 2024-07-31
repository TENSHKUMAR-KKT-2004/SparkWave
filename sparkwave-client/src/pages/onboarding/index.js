import { useStateProvider } from '@/context/stateContext'
import Image from 'next/image'
import React from 'react'

export default function index() {
const [{userInfo}] = useStateProvider()
  return (
    <div className="bg-panel-header-background h-screen w-screen text-white flex flex-col items-center justify-center">
        <div className="flex items-center justify-center gap-2">
            <Image 
            src="/SparkWave.gif"
            alt="SparkWave"
            height={300}
            width={300}
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
                    {userInfo.name}
                </div>
            </div>
    </div>
  )
}
