import { useEffect, useState } from "react";
import User from "./User.jsx";
import { useNavigate } from "react-router-dom";

export default function Room() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const [isOwner, setOwner] = useState(false);

    useEffect(() => {
        const updateRoomUsers = (msg) => {
            console.log(msg);
            setUsers(msg);
        };

        socket.emit("isApproved_room");
        socket.once("isApproved_room", (res) => {
            if (!res) {
                console.error(`Do not change the url (/room)`);
                navigate("/");
            }
        });

        //defining who the user is
        socket.emit("amIOwner");
        socket.once("amIOwner", setOwner);

        socket.on("updateRoomUsers", updateRoomUsers);
        socket.once("go2lobby", () => navigate("/"));

        socket.once("goCounting", () => navigate("/counting"));

        return () => socket.off("updateRoomUsers", updateRoomUsers);
    }, []);

    const exitRoom = () => {
        socket.emit("reset");
        navigate("/");
    };

    const start = () => {
        socket.emit("startGame");
    };

    return (
        <div className="wrapper smooth-active">
            <div className="panel back">
                <div className="list">
                    {users.map((user, i) => (
                        <User key={user.id} name={user.name} isOwner={i == 0} />
                    ))}
                </div>
                {isOwner && (
                    <div onClick={start} className="btn interactive">
                        Start
                    </div>
                )}
                <div onClick={exitRoom} className="btn interactive">
                    Exit
                </div>
            </div>
        </div>
    );
}
