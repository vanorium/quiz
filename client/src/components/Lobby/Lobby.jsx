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
        socket.emit('reset')

        socket.emit('getId')
        socket.once('getId', console.log)
        socket.once('log', console.log)
        
        socket.on('updateRooms', setRooms)
    
        socket.once('roomCreated', roomCreated)
        socket.once('approveJoinRoom', approveJoinRoom)
        
        return () => {
            socket.off('updateRooms', setRooms)
        }
    },[])

    const roomCreated = () => {
        console.log('created, going to /room')
        navigate('/room')
    }

    const joinRoom = (ownerId) => {
        if(isNameCorrect()) socket.emit('joinRoom', ownerId, name)
    }

    const approveJoinRoom = (roomId) => {
        console.log('approved (joined)')
        socket.emit('approvedJoinRoom', roomId)
        navigate('/room')
    }

    const handleSetName = (event) => {
        const name = event.target.value.slice(0,20)
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

    return (
        <div className='wrapper'>
            <div className='panel back'>
                    <div className={s['input-container']}>
                        <input className={`interactive ${s[shaking] || ''}`} placeholder="My name is..." value={name} onChange={handleSetName} />
                    </div>
                <div className='list'>
                    {rooms.length==0 && <div className='comment'>No rooms</div>}
                    {rooms.map(room => <RoomOption onClick={() => joinRoom(room.sockets[0])} key={room.sockets[0]} size={room.sockets.length} ownerName={room.ownerName} />)}
                </div>
                <div className='btn interactive' onClick={createRoom}>Create a room</div>
            </div>
        </div>
    )
}