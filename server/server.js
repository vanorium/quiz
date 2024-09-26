const http = require("http").createServer();
const io = require("socket.io")(http, {
    cors: { origin: "*" },
});

const { all_updateRooms } = require("./handlers/room/roomUtils.js");
const handleRoomLogic = require("./handlers/room/room.js");
const handleCountingLogic = require("./handlers/counting.js");
const { handleGameLogic } = require("./handlers/game.js");
const { handleBreakLogic } = require("./handlers/break.js");
const handleEndLogic = require("./handlers/end.js");

io.on("connection", (socket) => {
    console.log(`${socket.id} connected`);

    // From 'Lobby' component.
    socket.on("getId", () => {
        socket.emit("getId", `connected as ${socket.id}`);
    });

    // From 'Lobby' component.
    socket.on("getName", () => {
        if (socket.name) socket.emit("getName", socket.name);
    });

    handleRoomLogic(io, socket);
    handleCountingLogic(io, socket);
    handleGameLogic(io, socket);
    handleBreakLogic(io, socket);
    handleEndLogic(io, socket);

    socket.on("disconnect", () => {
        console.log(`${socket.id} disconnected`);
        all_updateRooms(io);
    });
});

const PORT = process.env.PORT || 8080;

http.listen(PORT, () => console.log("Server started"));
