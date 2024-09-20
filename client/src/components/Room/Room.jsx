import { useEffect, useState } from 'react';
import User from './User/User.jsx'
import { useNavigate } from 'react-router-dom';

export default function Room() {    

    const [users, setUsers] = useState([])
    const navigate = useNavigate()

    useEffect(() =>{
        const updateRoomUsers = (msg) => {
            console.log(msg)
            setUsers(msg)
        }

        socket.on('updateRoomUsers', updateRoomUsers)
        socket.on('go2lobby', () => navigate('/'))
        return () => socket.off('updateRoomUsers', updateRoomUsers )
    }, [])

    return (
        <div className='wrapper'>
            <div className='panel back'>
                <div className='list'>
                    {users.map(user => <User key={user.id} name={user.name}/>)}
                </div>
                <div className='btn hover'>Start</div>
                <div className='btn hover'>Exit</div>
            </div>
        </div>
    )
}