import { useEffect, useRef, useState } from 'react'
import Answer from './Answer.jsx'
import { useNavigate } from 'react-router-dom'
import s from "./game.module.css"

export default function Game() {

    const navigate = useNavigate()

    const [approved, setApproved] = useState(false)
    const [timer, setTimer] = useState()
    const [score, setScore] = useState(0)

    const [data, setData] = useState()

    const [block, setBlock] = useState()

    const startTime = useRef(new Date())

    const getQuestion = (data) => {
        startTime.current=new Date()
        console.log('get question')
        setData(data)
        const interval = setInterval(() => {
            const timer = 5 - Math.floor((new Date() - startTime.current) / 1000)
            setTimer(timer)
            if (!timer) {
                console.log('done')
                socket.emit('timerIsDone')
            }
        }, 250);

        socket.once('stopInterval', () => clearInterval(interval))
    }

    useEffect(() => {

        socket.emit('isApproved_game')
        socket.once('isApproved_game', (res) => {
            setApproved(res)
            if (!res) {
                console.error(`Do not change the url (/game)`)
                navigate('/')
            }
        })
        
        const handleGetQuestion = (msg) => getQuestion(msg)
        const handleBlock = () => setBlock(true)
        const handleSetScore = (msg) => setScore(msg)

        socket.once('block', handleBlock)
        socket.once('getQuestion', handleGetQuestion)
        socket.once('getScore', handleSetScore)

        return () => {
            socket.off('block', handleBlock)
            socket.off('getQuestion', handleGetQuestion)
            socket.off('getScore', handleSetScore)
        }
    }, [])

    const choose = (i) => {
        socket.emit('setAnswer', i)
    }

    return (
        approved && data && <div className={`${s.smooth} wrapper`}>
            <div className='panel back'>
                <div>{data.question}</div>
                <div className='list'>
                    {data.answers.map((answer, i) => <Answer isBlocked={block} onClick={() => block || choose(i)} key={i} text={answer} />)}
                </div>
                <div className={s.bar}>
                    <div className={s.row}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="white" width="1.5rem" viewBox="0 0 32 32" version="1.1">
                            <path d="M3.488 13.184l6.272 6.112-1.472 8.608 7.712-4.064 7.712 4.064-1.472-8.608 6.272-6.112-8.64-1.248-3.872-7.808-3.872 7.808z" />
                        </svg>
                        <div>{score}</div>
                    </div>
                    <div className='comment'>{timer}</div>
                </div>
            </div>
        </div>
    )
}