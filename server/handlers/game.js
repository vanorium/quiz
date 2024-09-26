const setupRound = (io, socket) => {
    const owner = io.sockets.sockets.get(socket.inRoomId);
    const data = owner.questions[owner.question];

    owner.timerIsDoneAcc = 0;

    const round = {
        question: data.question,
        answers: data.answers,
    };

    socket.emit("getQuestion", round);
};

const handleGameLogic = (io, socket) => {
    socket.on("isApproved_game", () => {
        socket.emit("isApproved_game", socket.inGame);
    });

    socket.on("timerIsDone", () => {
        if (socket.inGame) {
            socket.emit("stopInterval");

            const ownerId = socket.inRoomId;
            const owner = io.sockets.sockets.get(ownerId);

            if (!owner.hasOwnProperty("timerIsDoneAcc"))
                owner.timerIsDoneAcc = 1;
            else owner.timerIsDoneAcc++;

            const roomSocketCount = Array.from(
                io.sockets.adapter.rooms.get(ownerId)
            ).length;

            if (owner.timerIsDoneAcc >= roomSocketCount) {
                console.log(owner.id, "timer is done");

                if (owner.question < owner.questions.length - 1) {
                    owner.question++;

                    const breakCondition =
                        owner.questions[owner.question + 2] != null &&
                        owner.question % 2 == 0;
                    const goingTo = breakCondition ? "break" : "game";

                    if (goingTo == "game") {
                        io.sockets.adapter.rooms
                            .get(ownerId)
                            .forEach((socketId) => {
                                const socket = io.sockets.sockets.get(socketId);

                                socket.onBreak = false;
                                socket.inGame = true;
                                setupRound(io, socket);
                            });
                    } else {
                        io.sockets.adapter.rooms
                            .get(ownerId)
                            .forEach((socketId) => {
                                const socket = io.sockets.sockets.get(socketId);

                                socket.inGame = false;
                                socket.onBreak = true;
                            });
                        io.to(owner.id).emit("doBreak");
                    }
                } else {
                    io.sockets.adapter.rooms
                        .get(ownerId)
                        .forEach((socketId) => {
                            const socket = io.sockets.sockets.get(socketId);
                            socket.inGame = false;
                            socket.atGameEnd = true;
                        });
                    io.to(owner.id).emit("goToEnd");
                }
            }
        }
    });

    socket.on("getScore", () => {
        socket.emit("getScore", socket.score);
    });

    socket.on("setAnswer", (i) => {
        const owner = io.sockets.sockets.get(socket.inRoomId);

        const add = Number(i == owner.questions[owner.question].correct);
        socket.score += add;

        socket.emit("block");

        console.log(socket.id, socket.score);
    });

    socket.on("initialSetupRound_final", () => setupRound(io, socket));
};

module.exports = { handleGameLogic, setupRound };
