import { useEffect, useState } from "react"
import s from "./roomOption.module.css"

export default function Room({data}){
    
    const [roomName, setRoomName] = useState('')

    
    console.log("Создается панелька с этой инфой: ", data)
    useEffect(() =>{
        socket.emit('getIdName', data.roomId)
        socket.on('getIdName2', (msg) => setRoomName(msg))
    }, [])

    return(
        <div className={`${s.room} hover`}>
            <div>{`${roomName}'s room`}</div>
            <div>{`${data.sockets.length}`}</div>
        </div>
    )
} 