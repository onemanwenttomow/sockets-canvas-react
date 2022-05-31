import { useParams } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { socket } from "./start";
import Canvas from "./canvas";
import NextPlayer from "./next-player";
import Guess from "./guess";
import UserIcon from "./icons/user";
import DrawerTools from "./drawer-tools";

export default function Game() {
    const { id } = useParams();
    console.log("params: ", id);
    const wrapper = useRef(null);
    const [height, setHeight] = useState(null);
    const [width, setWidth] = useState(null);
    const [offsetLeft, setOffsetLeft] = useState(0);
    const [offsetTop, setOffsetTop] = useState(0);
    const [wordToDrawer, setWordToDrawer] = useState("");
    const [color, setColor] = useState("black");
    const [wrongGuess, setWrongGuess] = useState("");
    const [correctGuess, setCorrectGuess] = useState("");
    const [numberOfPlayers, setNumberOfPlayers] = useState(0);

    useEffect(() => {
        socket.emit("joinedRoom", id);

        socket.on("isDrawer", (data) => {
            console.log("data in isDrawer: ", data);
            setWordToDrawer(data);
        });
        socket.on("numberOfPlayers", (data) => {
            console.log("num players: ", data);
            setNumberOfPlayers(data);
        });
        socket.on("wrongGuess", (data) => {
            setWrongGuess(data);
            setTimeout(() => setWrongGuess(""), 1500);
        });
        socket.on("correctGuess", (data) => setCorrectGuess(data));

        onResize();

        window.addEventListener("resize", onResize, false);

        return () => {
            socket.removeListener("isDrawer");
            socket.removeListener("wrongGuess");
            socket.removeListener("correctGuess");
            socket.removeListener("numberOfPlayers");
            window.removeEventListener("resize", onResize, false);
        };
    }, [width, height]);

    function onResize() {
        setHeight(wrapper.current.clientHeight);
        setWidth(wrapper.current.clientWidth);
        setOffsetLeft(wrapper.current.offsetLeft);
        setOffsetTop(wrapper.current.getBoundingClientRect().top);
    }

    function handleColorChange(newColor) {
        setColor(newColor);
    }

    function resetGuesses() {
        setCorrectGuess("");
        setWrongGuess("");
    }

    console.log("wordToDrawer: ", wordToDrawer);

    return (
        <div ref={wrapper} className="wrapper">
            <div className="number-of-players-wrapper">
                <UserIcon />
                <div className="number-of-players">{numberOfPlayers}</div>
            </div>
            <Canvas
                height={height}
                width={width}
                offsetLeft={offsetLeft}
                offsetTop={offsetTop}
                color={color}
                isDrawer={wordToDrawer}
            />

            <div className={`wrong-guess ${wrongGuess ? "display" : ""}`}>
                {wrongGuess}
            </div>
            <div className={`correct-guess ${correctGuess ? "display" : ""}`}>
                {correctGuess}
            </div>
            {wordToDrawer && (
                <DrawerTools
                    wordToDrawer={wordToDrawer}
                    handleColorChange={handleColorChange}
                    color={color}
                />
            )}
            <div className="bottom-wrapper">
                {wordToDrawer && (
                    <>
                        <NextPlayer resetGuesses={resetGuesses} />
                        <div
                            className="word-to-draw"
                            onClick={() => socket.emit("newWord")}
                        >
                            {wordToDrawer}
                        </div>
                    </>
                )}

                {!wordToDrawer && <Guess resetGuesses={resetGuesses} />}
            </div>
        </div>
    );
}
