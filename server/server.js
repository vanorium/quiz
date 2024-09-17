const http = require('http').createServer()

const io = require('socket.io')(http, {
    cors: {origin: '*'}
})
  
const getNormalizedRooms = () => Array.from(io.sockets.adapter.rooms)
                                    .map(([roomId, sockets]) => ({roomId, sockets: Array.from(sockets)}))
                                    .filter(room => {
                                        return io.sockets.sockets.get(room.sockets[0]).isRoomOwner==1
                                    }); 

io.on('connection', socket => {
    console.log(`${socket.id} connected`)
    
    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`);
        // io.emit('log',  Array.from(io.sockets.sockets.keys()))
        io.emit('getRooms', getNormalizedRooms())
    });
    
    socket.on('updateRooms', () => {
        io.emit('getRooms', getNormalizedRooms())
    })

    socket.on('logSocketID', () => {
        socket.emit('log', `${socket.id}`)
    })

    socket.on('getIdName', (id) => {
        const name = io.sockets.sockets.get(id)?.name
        socket.emit('getIdName2', name)
    })

    socket.on('setName', name => socket.name=name)

    socket.on('createRoom', () => {
        console.log(`( ${socket.id} ) ${socket.name}'s room has been created`);
        socket.isRoomOwner=1
        console.log(getNormalizedRooms())
        io.emit('getRooms', getNormalizedRooms())
        // io.emit('log', getNormalizedRooms())
      });
})

const PORT = process.env.PORT || 8080

http.listen(PORT, () => console.log(`http://localhost:${PORT}`))   