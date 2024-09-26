/*
From 'Lobby' component.
Reseting all information that could break the logic.
*/
const reset = (socket) => {
    socket.inRoomId = null;
    socket.roomOwner = false;
    socket.isOpen = false;

    socket.inRoom = false;
    socket.isCounting = false;
    socket.inGame = false;
    socket.onBreak = false;
    socket.atGameEnd = false;

    socket.timerIsDoneAcc = 0;
    socket.countingIsDoneAcc = 0;
    socket.score = 0;
    socket.question = 0;

    socket.breakIsDoneAcc = 0;

    console.log(socket.id, "reseted");
};

// Updating for everyone information about rooms
const all_updateRooms = (io) => {
    io.emit(
        "updateRooms",
        Array.from(io.sockets.adapter.rooms)
            .filter(
                (room) => io.sockets.sockets.get(room[0])?.isOpen
            ) /* define only those servers that are searching for people */
            .map((visibleRoom) => ({
                ownerName: io.sockets.sockets.get(visibleRoom[0]).name,
                sockets: Array.from(visibleRoom[1]),
            }))
    );
};

// Function-helper for defining users in defined room
const defineRoomUsers = (io, roomId) =>
    Array.from(io.sockets.adapter.rooms.get(roomId)).map((id) => ({
        id,
        name: io.sockets.sockets.get(id).name,
    }));

const updateRoomUsers = (io, roomId) => {
    const data = defineRoomUsers(io, roomId);
    io.to(roomId).emit("updateRoomUsers", data);
};

// When the room creator leaves => everybody else leaves
const destroyRoom = (io, roomId) => {
    Array.from(io.sockets.adapter.rooms.get(roomId)).forEach((id) => {
        const socket = io.sockets.sockets.get(id);
        if (socket.id != socket.inRoomId) socket.leave(roomId);
        reset(socket);
        socket.emit("go2lobby");
    });
};

/*
From 'Room' component.
Sending a message to others that defined user left
*/
const leaveRoom = (io, socket) => {
    if (socket.inRoomId) {
        // Firstly, the user have to be in a room
        if (socket.inRoomId != socket.id) {
            socket.leave(socket.inRoomId); // Removing from the set of joined sockets
            updateRoomUsers(io, socket.inRoomId); // Sending this information
            reset(socket); // Reseting all keys
        } else {
            destroyRoom(io, socket.id);
        }
    }
};

module.exports = {
    all_updateRooms,
    updateRoomUsers,
    leaveRoom,
    defineRoomUsers,
};
