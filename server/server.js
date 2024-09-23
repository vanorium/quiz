const parseCsv = require("./parseCsv.js")
const http = require('http').createServer()
const io = require('socket.io')(http, {
    cors: { origin: '*' }
})

const updateRooms = () => {
    io.emit('updateRooms', Array.from(io.sockets.adapter.rooms)
        .filter((room) => io.sockets.sockets.get(room[0])?.isOpen) /* define only those servers that are searching for people */
        .map((visibleRoom) => ({
            ownerName: io.sockets.sockets.get(visibleRoom[0]).name,
            sockets: Array.from(visibleRoom[1])
        })
        ))
}

const defineRoomUsers = (roomId) => Array.from(io.sockets.adapter.rooms.get(roomId)).map(id => ({ id, name: io.sockets.sockets.get(id).name }))


const updateRoomUsers = (roomId) => {
    const data = defineRoomUsers(roomId)
    io.to(roomId).emit('updateRoomUsers', data)
}


const destroyRoom = (roomId) => {
    Array.from(io.sockets.adapter.rooms.get(roomId))
        .forEach(id => {
            const socket = io.sockets.sockets.get(id)
            if (socket.id != socket.inRoomId) socket.leave(roomId)
            reset(socket)
            socket.emit('go2lobby')
        })
}

const reset = (socket) => {
    socket.inRoomId = null
    socket.roomOwner = false
    socket.isOpen = false

    socket.inRoom = false
    socket.isCounting = false
    socket.inGame = false

    socket.score = null
    socket.questions = null
    socket.question = null

    console.log(socket.id, 'reseted')
}

const leaveRoom = (socket) => {
    if (socket.inRoomId) {
        if (socket.inRoomId != socket.id) {
            socket.leave(socket.inRoomId)
            updateRoomUsers(socket.inRoomId)
            reset(socket)
        }

        else {
            destroyRoom(socket.id)
        }

    }
}

const getQuestion = (socket) => {
    const ownerId = socket.inRoomId == socket.id ? socket.id : socket.inRoomId
    const owner = io.sockets.sockets.get(ownerId)
    const data = owner.questions[owner.question]
    
    const res = {
        question: data.question,
        answers: data.answers
    }

    socket.emit('getQuestion', res)
}

const csv = 
`вопрос1, сложность2, 1, 2, 3, 4, 0
вопрос2, сложность3, 2, 1, 2, 3, 1
вопрос3, сложность1, 0, 1, 2, 4, 2`

const questions = parseCsv(csv)
console.log(questions)

io.on('connection', socket => {
    console.log(`${socket.id} connected`)

    socket.emit('log', socket.id)
    socket.on('getId', () => socket.emit('getId', socket.id))

    socket.on('isApproved_room', () => {
        socket.emit('isApproved_room', socket.inRoom)
    })

    socket.on('isApproved_counting', () => {
        socket.emit('isApproved_counting', socket.isCounting)
    })

    socket.on('isApproved_game', () => {
        socket.emit('isApproved_game', socket.inGame)
    })

    socket.on('createRoom', (name) => {
        socket.name = name
        socket.roomOwner = true
        socket.isOpen = true
        socket.inRoomId = socket.id
        socket.inRoom = true

        socket.emit('roomCreated')
        updateRooms()
        socket.emit('updateRoomUsers', defineRoomUsers(socket.id))

    })

    socket.on('joinRoom', (joinedRoom, name) => {
        socket.name = name
        socket.inRoomId = joinedRoom
        socket.inRoom = true

        socket.join(joinedRoom)
        socket.emit('approveJoinRoom', joinedRoom)
    })

    socket.on('approvedJoinRoom', (joinedRoom) => {
        // sometimes it just doesn't send to a socket required info, so there is a little delay to fix it
        setTimeout(() => {
            updateRoomUsers(joinedRoom)
            updateRooms()
        }, 100)
    })

    socket.on('startGame', () => {
        socket.isOpen = false
        updateRooms()

        io.sockets.adapter.rooms.get(socket.id).forEach(socketId => {
            const socket = io.sockets.sockets.get(socketId)
            socket.inRoom = false; socket.isCounting = true
            socket.emit('goCounting')
        })
    })

    socket.on('timerIsDone', () => {
        socket.emit('stopInterval')

        const ownerId = socket.inRoomId == socket.id ? socket.id : socket.inRoomId
        const owner = io.sockets.sockets.get(ownerId)
        
        if(!owner.hasOwnProperty('timerIsDoneAcc')) owner.timerIsDoneAcc=1 
        else owner.timerIsDoneAcc++

        const roomSocketCount = Array.from(io.sockets.adapter.rooms.get(ownerId)).length

        if(owner.timerIsDoneAcc >= roomSocketCount){
            console.log(socket.id, owner.id, 'timer is done')
            owner.question++

            // io.to(owner.id).emit('getQuestion', getQuestion(owner))
            io.to(owner.id).emit('log', 'hello')
        }
    })

    socket.on('getScore', () => {
        socket.emit('getScore', socket.score)
    })

    socket.on('setAnswer', (i) => {
        const ownerId = socket.inRoomId == socket.id ? socket.id : socket.inRoomId
        const owner =  io.sockets.sockets.get(ownerId)
        
        const add = Number(i==owner.questions[owner.question].correct)
        if(!socket.hasOwnProperty('score')) socket.score = add
        else socket.score += add

        socket.emit('block')

        console.log(socket.id, socket.score)

    })

    socket.on('countingFinished', () => {
        socket.emit('stopInterval')

        const ownerId = socket.inRoomId == socket.id ? socket.id : socket.inRoomId
        const owner = io.sockets.sockets.get(ownerId)
        
        if(!owner.hasOwnProperty('countingIsDoneAcc')) owner.countingIsDoneAcc=1 
        else owner.countingIsDoneAcc++

        const roomSocketCount = Array.from(io.sockets.adapter.rooms.get(ownerId)).length
        
        if(owner.countingIsDoneAcc >= roomSocketCount){
            owner.questions = questions
            owner.question = 0

            io.sockets.adapter.rooms.get(owner.id).forEach(socketId => {
                const socket = io.sockets.sockets.get(socketId)
                socket.isCounting = false; socket.inGame = true
                console.log(socket.id, 'is going to game')
                socket.emit('go2game')
                setTimeout(() => {
                    getQuestion(socket)
                }, 100)
            })
        }
    })

    socket.on('amIOwner', () => {
        socket.emit('amIOwner', socket.inRoomId == socket.id)
    })
    
    socket.on('reset', () => {
        socket.emit('log', 'going back to the main page')
        leaveRoom(socket)
        updateRooms()
    })
    
    socket.on('disconnecting', () => {
        leaveRoom(socket)
    })

    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`);
        updateRooms()
    });
})

const PORT = process.env.PORT || 8080
http.listen(PORT, () => console.log('Server started'))   