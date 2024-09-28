const {
    all_updateRooms,
    updateRoomUsers,
    leaveRoom,
    defineRoomUsers,
} = require("./roomUtils.js");

// Socket interaction with room related stuff
const handleRoomLogic = (io, socket) => {
    // From 'Lobby' component.
    socket.on("createRoom", (name) => {
        socket.name = name;
        socket.isOpen = true;
        socket.inRoomId = socket.id;
        socket.inRoom = true;

        socket.emit("roomCreated");
        all_updateRooms(io);
        socket.emit("updateRoomUsers", defineRoomUsers(io, socket.id));
    });

    // From 'Lobby' component.
    socket.on("joinRoom", (joinedRoom, name) => {
        socket.name = name;
        socket.inRoomId = joinedRoom;
        socket.inRoom = true;

        socket.join(joinedRoom);

        // Now, addresing a user to '/room', then load a list
        socket.emit("go2room");
    });

    /*
    From 'Room' component.
    Сreating the list of users (updateRoomUsers) and updating the status of the room.
    */
    socket.on("joinRoom_final", () => {
        updateRoomUsers(io, socket.inRoomId);
        all_updateRooms(io);
    });

    /*
    From 'Room' component.
    Readdresing in a case of using wrong url (user wrote '/room' by himself in url and it has to be prevented).
    */
    socket.on("isApproved_room", () => {
        socket.emit("isApproved_room", socket.inRoom);
    });

    /*
    From 'Room' component.
    Defining an icon for a user in a list of room users (owner icon or default icon).
    */
    socket.on("amIOwner", () => {
        socket.emit("amIOwner", socket.inRoomId == socket.id);
    });

    /*
    From 'Lobby' component.
    When a user leaves a room by using browser arrows, we have to kick him out from current room.
    */
    socket.on("reset", () => {
        leaveRoom(io, socket);
        all_updateRooms(io);
    });

    socket.on("disconnecting", () => {
        leaveRoom(io, socket);
    });
};

module.exports = handleRoomLogic;
