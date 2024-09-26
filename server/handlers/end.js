const { getTop } = require("./break.js");

const handleEndLogic = (io, socket) => {
    socket.on("isApproved_end", () => {
        socket.emit("isApproved_end", socket.atGameEnd);
    });

    socket.on("goToEnd_final", () =>
        socket.emit("getTop", getTop(io, socket.inRoomId))
    );
};

module.exports = handleEndLogic;
