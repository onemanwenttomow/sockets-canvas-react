import { useRef, useEffect, useState } from "react";
import { socket } from "./start";
import Canvas from "./canvas";
import NextPlayer from "./next-player";
import Guess from "./guess";
import UserIcon from "./icons/user";
import DrawerTools from "./drawer-tools";

export default function App() {
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
        socket.on("isDrawer", (data) => setWordToDrawer(data));
        socket.on("numberOfPlayers", (data) => setNumberOfPlayers(data));
        socket.on("wrongGuess", (data) => {
            setWrongGuess(data);
            setTimeout(() => setWrongGuess(""), 1500);
        });
        socket.on("correctGuess", (data) => setCorrectGuess(data));

        onResize();

        window.addEventListener("resize", onResize, false);

        return () => {
            socket.removeListener("isDrawer");
            socket.removeListener("id");
            socket.removeListener("wrongGuess");
            socket.removeListener("correctGuess");
            socket.removeListener("numberOfPlayers");
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
    console.log("numberOfPlayers: ", numberOfPlayers);

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
