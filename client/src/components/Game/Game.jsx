import { useEffect, useRef, useState } from "react";
import Answer from "./Answer.jsx";
import { useNavigate } from "react-router-dom";

const timeToAnswer = 5;

export default function Game() {
    const navigate = useNavigate();
    const [anim, setAnim] = useState("active");
    const [data, setData] = useState();
    const [block, setBlock] = useState();
    const startTime = useRef(new Date());
    const [selectedIndex, setSelectedIndex] = useState();

    const getQuestion = (data) => {
        startTime.current = new Date();
        console.log("get question");
        setData(data);
        const interval = setInterval(() => {
            const timer =
                timeToAnswer -
                Math.floor((new Date() - startTime.current) / 1000);
            if (!timer) socket.emit("timerIsDone");
        }, 250);

        socket.on("stopInterval", () => clearInterval(interval));
    };

    useEffect(() => {
        socket.emit("isApproved_game");
        socket.once("isApproved_game", (res) => {
            if (!res) {
                console.error(`Do not change the url (/game)`);
                navigate("/");
            }
        });

        const handleGetQuestion = (msg) => getQuestion(msg);
        const handleBlock = () => setBlock(true);
        const handleGoToEnd = () => {
            navigate("/end");
            socket.emit("goToEnd_final");
        };

        socket.on("block", handleBlock);

        socket.once("doBreak", () => {
            navigate("/break");
            socket.emit("doBreak_final");
        });

        socket.on("getQuestion", handleGetQuestion);
        socket.on("goToEnd", handleGoToEnd);

        return () => {
            socket.off("block", handleBlock);
            socket.off("getQuestion", handleGetQuestion);
            socket.off("goToEnd", handleGoToEnd);
        };
    }, []);

    useEffect(() => {
        if (data?.question /* preventing double execution */) {
            setAnim("");
            requestAnimationFrame(() => setAnim("active"));
            setBlock(false);
            setSelectedIndex(null);
        }
    }, [data]);

    const choose = (i) => {
        socket.emit("setAnswer", i);
        setSelectedIndex(i);
    };

    return (
        anim &&
        data && (
            <div className={`smooth-${anim} wrapper`}>
                <div className="panel back">
                    <div>{data.question}</div>
                    <div className="list">
                        {data.answers.map((answer, i) => (
                            <Answer
                                isSelected={i == selectedIndex}
                                isBlocked={block}
                                onClick={() => block || choose(i)}
                                key={i}
                                text={answer}
                            />
                        ))}
                    </div>
                    <div
                        style={{ animationDuration: `${timeToAnswer}s` }}
                        className={`timer timer-${anim || ""} }`}
                    ></div>
                </div>
            </div>
        )
    );
}
