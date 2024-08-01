import Image from 'next/image';
import React from 'react'
import { IoClose } from 'react-icons/io5'

export default function PhotoLibrary({ setImage, hidePhotoLib}) {

    const images = [
        "/avatars/batman.png",
        "/avatars/billy_butcher.png",
        "/avatars/cool_kitty.png",
        "/avatars/daenerys_targaryen.png",
        "/avatars/elon_musk.png",
        "/avatars/joi.png",
        "/avatars/kratos.png",
        "/avatars/neo.png",
        "/avatars/old_man_logan.png",
    ]
  return (
    <div className="fixed top-0 left-0 max-h-[100vh] max-w-[100vw] h-full w-full flex justify-center items-center">
        <div className="h-max w-max bg-gray-900 gap-9 rounded-ld p-4">
            <div className="pt-2 pe-2 cursor-pointer flex items-end justify-end" 
            onClick={()=> hidePhotoLib(false)}>
                <IoClose className="h-10 w-10 cursor-pointer" alt="close photo library"/>
            </div>
            <div className="grid grid-cols-3 justify-center items-center gap-16 p-15 pr-8 w-full">
                {
                    images.map((image, index)=>
                    (
                        <dir onClick={()=> {setImage(images[index]); hidePhotoLib(false)}}>
                            <div className="h-24 w-24 cursor-pointer relative">
                                <Image src={image} alt="avatar" fill />
                            </div>
                        </dir>
                    )
                    )
                }
            </div>
        </div>
    </div>
  )
}
