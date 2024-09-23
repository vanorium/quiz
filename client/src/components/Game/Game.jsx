import { useEffect, useRef, useState } from 'react'
import Answer from './Answer.jsx'
import { useNavigate } from 'react-router-dom'
import s from "./game.module.css"
import { style } from 'framer-motion/client'

const timeToAnswer = 5

export default function Game() {

    const navigate = useNavigate()
    const [approved, setApproved] = useState(false)
    const [timer, setTimer] = useState()
    const [anim, setAnim] = useState()
    const [score, setScore] = useState(0)
    const [data, setData] = useState()
    const [block, setBlock] = useState()
    const startTime = useRef(new Date())

    const getQuestion = (data) => {
        startTime.current = new Date()
        console.log('get question')
        setData(data)
        const interval = setInterval(() => {
            const timer = timeToAnswer - Math.floor((new Date() - startTime.current) / 1000)
            setTimer(timer)
            if (!timer) socket.emit('timerIsDone')
            
        }, 250);

        socket.on('stopInterval', () => clearInterval(interval))
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

        socket.on('block', handleBlock)
        socket.on('getQuestion', handleGetQuestion)
        socket.on('getScore', handleSetScore)

        return () => {
            socket.off('block', handleBlock)
            socket.off('getQuestion', handleGetQuestion)
            socket.off('getScore', handleSetScore)
        }
    }, [])

    useEffect(() =>{
        setAnim(''); setTimeout(() => setAnim('active'), 0)
    }, [data])

    const choose = (i) => {
        socket.emit('setAnswer', i)
    }

    return (
        approved && data && <div className={`${s[`smooth-${anim}`]} wrapper`}>
            <div className='panel back'>
                <div>{data.question}</div>
                <div className='list'>
                    {data.answers.map((answer, i) => <Answer isBlocked={block} onClick={(event) => block || choose(event, i)} key={i} text={answer} />)}
                </div>
                <div style={{animationDuration:`${timeToAnswer}s`}} className={`${s.timer} ${s[`timer-${anim}`] || '' }`}></div>
            </div>
        </div>
    )
}