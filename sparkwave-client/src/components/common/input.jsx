import React from 'react'

export default function Input({ name, state, setState, required, label = false }) {
    return (
        <div className="flex gap-1 flex-col">
            {
                label && (
                    <label htmlFor={name} className="text-teal-light text-lg px-1">
                        {name}
                    </label>
                )
            }
            <div >
                <input type="text" name={name} value={state} required={required} onChange={(e) => setState(e.target.value)} 
                className="bg-input-background text-start focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-full"
                />
            </div>
        </div>
    )
}
