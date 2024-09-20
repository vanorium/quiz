const http = require('http').createServer()
const io = require('socket.io')(http, {
    cors: { origin: '*' }
})

const defineRooms = () => {
    return Array.from(io.sockets.adapter.rooms)
        .filter((room) => io.sockets.sockets.get(room[0])?.roomOwner) /* define only those servers that are searching for people */
        .map((visibleRoom) => ({
                ownerId: visibleRoom[0],
                ownerName: io.sockets.sockets.get(visibleRoom[0]).name,
                sockets: Array.from(visibleRoom[1])
            })
        )
}

const defineRoomUsers = (roomId) => Array.from(io.sockets.adapter.rooms.get(roomId)).map(id => ({id, name: io.sockets.sockets.get(id).name}))


const updateRoomUsers = (roomId) => {
    Array.from(io.sockets.adapter.rooms.get(roomId))
        .forEach(id => io.sockets.sockets.get(id).emit('updateRoomUsers', defineRoomUsers(roomId)))
}

const destroyRoom = (roomId) => {
    Array.from(io.sockets.adapter.rooms.get(roomId))
        .forEach(id => {
            const socket = io.sockets.sockets.get(id) 
            socket.leave(roomId)
            socket.inRoomId=null
            socket.roomOwner = false
            socket.emit('go2lobby')
        })
}

io.on('connection', socket => {
    console.log(`${socket.id} connected`)

    // logs
    socket.emit('log', socket.id)
    socket.on('getId', () => socket.emit('getId', socket.id))

    // room 
    socket.on('createRoom', (name) => {
        socket.name = name
        socket.roomOwner = true
        socket.inRoomId = socket.id

        socket.emit('roomCreated')             
        io.emit('updateRooms', defineRooms())
        socket.emit('updateRoomUsers', defineRoomUsers(socket.id) )

    })

    socket.on('joined_updateRooms', () => socket.emit('updateRooms', defineRooms()))
    
    socket.on('joinRoom', (joinedRoom, name) => {
        socket.name = name
        socket.inRoomId = joinedRoom

        socket.join(joinedRoom)
        socket.emit('joinedRoom')
        
        console.log('joined', joinedRoom)
        updateRoomUsers(joinedRoom)
        
        io.emit('updateRooms', defineRooms())
    })

    socket.on('disconnecting', () => {
        if(socket.inRoomId != socket.id && socket.inRoomId){
            console.log(socket.inRoomId)
            socket.leave(socket.inRoomId)
            updateRoomUsers(socket.inRoomId)
            socket.in=null
        }

        else {
            destroyRoom(socket.id)
        }
    })

    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`);
        io.emit('updateRooms', defineRooms())
    });
})

const PORT = process.env.PORT || 8080
http.listen(PORT, () => console.log('Server started'))   