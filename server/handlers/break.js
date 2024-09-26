// Function-helper for defining users (and their score) in defined room
const getTop = (io, roomId) =>
    Array.from(io.sockets.adapter.rooms.get(roomId))
        .map((id) => ({
            id,
            isOwner:
                io.sockets.sockets.get(id).id ==
                io.sockets.sockets.get(id).inRoomId,
            name: io.sockets.sockets.get(id).name,
            score: io.sockets.sockets.get(id).score,
        }))
        .sort((a, b) => b.score - a.score);

const handleBreakLogic = (io, socket) => {
    socket.on("isApproved_break", () => {
        socket.emit("isApproved_break", socket.onBreak);
    });

    socket.on("doBreak_final", () => {
        socket.emit("getTop", getTop(io, socket.inRoomId));
    });

    socket.on("breakIsDone", () => {
        if (socket.onBreak) {
            socket.emit("stopInterval");

            const ownerId = socket.inRoomId;
            const owner = io.sockets.sockets.get(ownerId);

            if (!owner.hasOwnProperty("breakIsDoneAcc"))
                owner.breakIsDoneAcc = 1;
            else owner.breakIsDoneAcc++;

            const roomSocketCount = Array.from(
                io.sockets.adapter.rooms.get(ownerId)
            ).length;

            if (owner.breakIsDoneAcc >= roomSocketCount) {
                console.log(owner.id, "break is done");

                io.sockets.adapter.rooms.get(owner.id).forEach((socketId) => {
                    const socket = io.sockets.sockets.get(socketId);
                    socket.onBreak = false;
                    socket.inGame = true;
                    console.log(socket.id, "is going to game from break");
                    socket.emit("returnToGame");
                });
            }
        }
    });
};

module.exports = { handleBreakLogic, getTop };
