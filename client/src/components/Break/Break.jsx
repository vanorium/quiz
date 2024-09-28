import { useEffect, useState, useRef } from "react";
import User from "./User.jsx";
import { useNavigate } from "react-router-dom";
import socket from "../../socket.js"

const breakTime = 4;

export default function Break() {
    const navigate = useNavigate();
    const [top, setTop] = useState([]);
    const startTime = useRef(new Date());

    useEffect(() => {
        socket.emit("isApproved_break");
        socket.once("isApproved_break", (res) => {
            if (!res) {
                console.error(`Do not change the url (/break)`);
                navigate("/");
            }
        });

        socket.on("getTop", setTop);

        console.log("break");

        const interval = setInterval(() => {
            const timer =
                breakTime - Math.floor((new Date() - startTime.current) / 1000);
            if (!timer) socket.emit("breakIsDone");
        }, 250);

        socket.on("stopInterval", () => clearInterval(interval));

        const handleReturnToGame = () => {
            navigate("/game");
            socket.emit("initialSetupRound_final");
        };

        socket.on("returnToGame", handleReturnToGame);

        return () => {
            socket.off("getTop", setTop);
            socket.off("returnToGame", handleReturnToGame);
        };
    }, []);

    return (
        !!top.length && (
            <div className={`smooth-active wrapper`}>
                <div className="panel back">
                    <div className="list">
                        {top.map((user, i) => (
                            <User
                                key={user.id}
                                name={user.name}
                                isOwner={user.isOwner}
                                score={user.score}
                            />
                        ))}
                    </div>
                    <div
                        style={{ animationDuration: `${breakTime}s` }}
                        className={`timer timer-active`}
                    ></div>
                </div>
            </div>
        )
    );
}
