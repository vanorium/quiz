const { all_updateRooms } = require("./room/roomUtils.js");
const parseCsv = require("../parseCsv.js");
const quiz = require("../quiz.js");

const questions = parseCsv(quiz);

const handlerCountingLogic = (io, socket) => {
    socket.on("startGame", () => {
        socket.isOpen = false;
        all_updateRooms(io);

        io.sockets.adapter.rooms.get(socket.id).forEach((socketId) => {
            const socket = io.sockets.sockets.get(socketId);
            socket.inRoom = false;
            socket.isCounting = true;
            socket.emit("goCounting");
        });
    });

    socket.on("isApproved_counting", () => {
        socket.emit("isApproved_counting", socket.isCounting);
    });

    socket.on("countingFinished", () => {
        if (socket.isCounting) {
            socket.emit("stopInterval");

            const ownerId = socket.inRoomId;
            const owner = io.sockets.sockets.get(ownerId);

            if (!owner.hasOwnProperty("countingIsDoneAcc"))
                owner.countingIsDoneAcc = 1;
            else owner.countingIsDoneAcc++;

            const roomSocketCount = Array.from(
                io.sockets.adapter.rooms.get(socket.inRoomId)
            ).length;

            if (owner.countingIsDoneAcc >= roomSocketCount) {
                owner.questions = questions;
                owner.question = 0;

                io.sockets.adapter.rooms.get(owner.id).forEach((socketId) => {
                    const socket = io.sockets.sockets.get(socketId);
                    socket.isCounting = false;
                    socket.inGame = true;
                    socket.score = 0;
                    console.log(socket.id, "is going to game");
                    socket.emit("go2game");
                });
            }
        }
    });
};

module.exports = handlerCountingLogic;
