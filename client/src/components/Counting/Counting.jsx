import { useEffect, useState, useRef } from 'react'
import s from './counting.module.css'
import { useNavigate } from 'react-router-dom';
import socket from "../../socket.js"

const wait = 5

export default function Counting() {
    
    const navigate = useNavigate()
    const startTime = useRef(new Date())
    const [count, setCount] = useState(false)

    useEffect(() => {

        socket.emit('isApproved_counting')
        socket.once('isApproved_counting', (res) => {
            if (!res) {
                console.error(`Do not change the url (/counting)`)
                navigate('/')
            }
            else setCount(wait)
        })
        
        
        const interval = setInterval(() => {
            const count = wait - Math.floor((new Date() - startTime.current) / 1000)
            setCount(count)
            if (!count) {
                socket.emit('countingFinished')
            }
        }, 250);

        const handleGo2Game = () => {
            navigate('/game')
        }

        const handleStopInterval = () => {
            clearInterval(interval)
        }

        socket.on('stopInterval', handleStopInterval)

        socket.on('go2game', handleGo2Game)

        return () => {
            clearInterval(interval)
            socket.off('go2game', handleGo2Game)
            socket.off('stopInterval', handleStopInterval)
        };
    }, []);

    return (
        <div className={s.centered}>
            {!!count && <div style={{ scale: `${1 / count * 10}`, transition: '0.5s linear(0 0%, 0 2.27%, 0.02 4.53%, 0.04 6.8%, 0.06 9.07%, 0.1 11.33%, 0.14 13.6%, 0.25 18.15%, 0.39 22.7%, 0.56 27.25%, 0.77 31.8%, 1 36.35%, 0.89 40.9%, 0.85 43.18%, 0.81 45.45%, 0.79 47.72%, 0.77 50%, 0.75 52.27%, 0.75 54.55%, 0.75 56.82%, 0.77 59.1%, 0.79 61.38%, 0.81 63.65%, 0.85 65.93%, 0.89 68.2%, 1 72.7%, 0.97 74.98%, 0.95 77.25%, 0.94 79.53%, 0.94 81.8%, 0.94 84.08%, 0.95 86.35%, 0.97 88.63%, 1 90.9%, 0.99 93.18%, 0.98 95.45%, 0.99 97.73%, 1 100%)' }}>{count}</div>}
        </div>
    )
}