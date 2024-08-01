import React from 'react'
import ReactDom from 'react-dom'

export default function PhotoPicker({onChange }) {
    const component= (<input type="file" hidden id="photo-picker" accept='image/*' onChange={onChange}/>)
    return ReactDom.createPortal(component, document.getElementById("photo-picker-element"))
}
