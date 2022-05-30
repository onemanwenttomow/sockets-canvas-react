import { useRef, useState } from "react";
import { socket } from "./start";
import BackSpaceIcon from "./icons/back-space";

const keyboardRows = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["enter", "z", "x", "c", "v", "b", "n", "m", "backspace"],
];

export default function Guess() {
    const input = useRef(null);
    const [userInput, setUserInput] = useState("");

    function handleSubmit() {
        socket.emit("guess", userInput);
        setUserInput("");
    }

    function handleKeyPress(key) {
        console.log("clicked: ", key);
        if (key === "backspace") {
            return setUserInput((old) => old.slice(0, -1));
        }
        if (key === "enter") {
            return handleSubmit();
        }
        setUserInput((old) => old + key);
    }

    return (
        <>
            <div className="extra-wrapper keyboard">
                {keyboardRows.map((row, i) => (
                    <div
                        key={i}
                        className={`keyboard-row ${
                            i === 1 ? "keyboard-row-2" : ""
                        }`}
                    >
                        {row.map((key, i) => (
                            <div
                                className={`keyboard-key ${
                                    key === "enter" ? "enter-key" : ""
                                }`}
                                key={i}
                                onClick={() => handleKeyPress(key)}
                            >
                                {key === "backspace" ? <BackSpaceIcon /> : key}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="input-wrapper">
                <input
                    placeholder="your guess"
                    ref={input}
                    disabled
                    value={userInput}
                />
            </div>
            <button className="next-player" onClick={handleSubmit}>
                Guess
            </button>
        </>
    );
}
