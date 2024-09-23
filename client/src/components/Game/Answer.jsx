import { useState } from "react"

export default function Answer({isBlocked, text, onClick}){
    const [selected, setSelected] = useState(false) 
    
    const handleSetSelected = () => {
        if(!isBlocked) setSelected(true)
    }

    return(
        <div onClick={() => {onClick(); handleSetSelected(true)}} style={{justifyContent:"center", height:"100%"}} className={`option ${!isBlocked ? 'interactive' : ''} ${selected ? 'selected' : ''}`}>{text}</div>
    )
}