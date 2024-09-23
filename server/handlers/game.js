const setupRound = (io, socket) => {
	const owner = io.sockets.sockets.get(socket.inRoomId);
	const data = owner.questions[owner.question];

	owner.timerIsDoneAcc = 0;

	const res = {
		question: data.question,
		answers: data.answers,
	};

	socket.emit("getQuestion", res);
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
				owner.question++;

				io.sockets.adapter.rooms.get(ownerId).forEach((socketId) => {
					const socket = io.sockets.sockets.get(socketId);
					setTimeout(() => {
						setupRound(io, socket);
						socket.emit("getScore", socket.score);
					}, 100);
				});
				io.to(owner.id).emit("log", "hello");
			}
		}
	});

	socket.on("getScore", () => {
		socket.emit("getScore", socket.score);
	});

	socket.on("setAnswer", (i) => {
		const owner = io.sockets.sockets.get(socket.inRoomId);

		const add = Number(i == owner.questions[owner.question].correct);
		if (!socket.hasOwnProperty("score")) socket.score = add;
		else socket.score += add;

		socket.emit("block");

		console.log(socket.id, socket.score);
	});

	socket.on("initialSetupRound_final", () => setupRound(io, socket));
}

module.exports = handleGameLogic