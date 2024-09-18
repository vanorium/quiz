import { useEffect, useState } from "react"
import s from "./roomOption.module.css"

export default function Room({data}){
    
    const [roomName, setRoomName] = useState('')

    
    useEffect(() =>{
        console.log("Создается панелька с этой инфой: ", data)
        socket.emit('defineIdName', data.roomId)
        const handleGetIdName = (msg) => {
            console.log(msg)
            setRoomName(msg)
        }
        socket.once('getIdName', handleGetIdName)
    }, [data])
    

    return(
        <div className={`${s.room} hover`}>
            <div>{`${roomName}'s room`}</div>
            <div>{`${data.sockets.length}`}</div>
        </div>
    )
} 