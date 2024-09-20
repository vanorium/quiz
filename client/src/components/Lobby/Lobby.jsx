import { useEffect, useState } from 'react'
import s from './lobby.module.css'
import RoomOption from '../RoomOption/RoomOption.jsx'
import { useNavigate } from 'react-router-dom';

export default function Lobby() {

    const [name, setName] = useState('')
    const [rooms, setRooms] = useState([])
    const [shaking, setShaking] = useState(false)

    const navigate = useNavigate()
    useEffect(() => {
        socket.emit('getId')
        socket.once('getId', console.log)
        socket.on('log', console.log)

        socket.emit('joined_updateRooms') // joined => show the old list of rooms 
        socket.on('updateRooms', setRooms)

        const created_go2room = () => navigate('/room')
        const joined_go2room = () => navigate('/room')
        socket.on('roomCreated', created_go2room)
        socket.on('joinedRoom', joined_go2room)

        return () => {
            socket.off('updateRooms', setRooms)
            socket.off('roomCreated', created_go2room)
            socket.off('joinedRoom', joined_go2room)
        }
    },[])

    const handleSetName = (event) => {
        const name = event.target.value
        setName(name)
        socket.emit('setName', name.trim())
    }

    const isNameCorrect = () => {
        if(name?.trim()) return true
        else {
            setShaking('not-shaking')
            setTimeout(() => setShaking('shaking'), 0)
        }
    }

    const createRoom = () => {
        if(isNameCorrect()) socket.emit('createRoom', name)
    }

    const joinRoom = (ownerId) => {
        if(isNameCorrect()) socket.emit('joinRoom', ownerId, name)
    }

    return (
        <div className='wrapper'>
            <div className='panel back'>
                    <div className={s['input-container']}>
                        <input className={`hover ${s[shaking]}`} placeholder="My name is..." value={name} onChange={handleSetName} />
                    </div>
                <div className='list'>
                    {rooms.length==0 && <div className='comment'>No rooms</div>}
                    {rooms.map(room => <RoomOption onClick={() => joinRoom(room.ownerId)} key={room.ownerId} size={room.sockets.length} ownerName={room.ownerName} />)}
                </div>
                <div className='btn hover' onClick={createRoom}>Create a room</div>
            </div>
        </div>
    )
}