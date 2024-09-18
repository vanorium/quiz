import { useEffect, useState } from 'react'
import s from './lobby.module.css'
import RoomOption from '../RoomOption/RoomOption.jsx'

export default function Lobby() {

    const [name, setName] = useState('')
    const [rooms, setRooms] = useState([])

    const handleSetName = (event) => {
        const name = event.target.value
        setName(name)
        socket.emit('setName', name)
    }

    useEffect(() => {
        socket.emit('updateRooms')
        socket.emit('logSocketID')
        socket.on('log', (msg) => console.log(msg));
        socket.on('getRooms', (msg) => setRooms(msg))
    }, [])

    const createRoom = () => {
        if (name) {
            socket.emit('createRoom')
        }
    }

    return (
        <div className='wrapper'>
            <div className='panel back'>
                    <div className={s['input-container']}>
                        <input className='hover' placeholder="My name is..." value={name} onChange={handleSetName} />
                    </div>
                {/* <div className={s.combined}>
                    <div className='btn hover' onClick={createRoom}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" viewBox="0 0 24 24" fill="none">
                            <path stroke="white" d="M21 12C21 16.9706 16.9706 21 12 21C9.69494 21 7.59227 20.1334 6 18.7083L3 16M3 12C3 7.02944 7.02944 3 12 3C14.3051 3 16.4077 3.86656 18 5.29168L21 8M3 21V16M3 16H8M21 3V8M21 8H16" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div> */}
                <div className={s['room-container']}>
                    <div style={{marginTop:'1rem'}}></div>
                    {rooms.map(room => <RoomOption key={room.roomId} data={room} />)}
                </div>
                <div className='btn hover' onClick={createRoom}>Create a room</div>
            </div>
        </div>
    )
}