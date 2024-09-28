import { useEffect, useState } from "react";
import User from "../Break/User.jsx";
import { useNavigate } from "react-router-dom";
import socket from "../../socket.js"

export default function End() {
    const [top, setTop] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        socket.emit("isApproved_end");
        socket.once("isApproved_end", (res) => {
            if (!res) {
                console.error(`Do not change the url (/end)`);
                navigate("/");
            }
        });

        socket.on("getTop", setTop);
        return () => {
            socket.off("getTop", setTop);
        };
    });

    const exitGame = () => {
        socket.emit("reset");
        navigate("/");
    };

    return (
        !!top.length && (
            <div className={`smooth-active wrapper`}>
                <div className="panel back">
                    <div>The end</div>
                    <div className="list">
                        {top.map((user) => (
                            <User
                                key={user.id}
                                name={user.name}
                                isOwner={user.isOwner}
                                score={user.score}
                            />
                        ))}
                    </div>
                    <div onClick={exitGame} className="btn interactive">
                        Exit
                    </div>
                </div>
            </div>
        )
    );
}
