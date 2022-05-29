import { useRef } from "react";
import { socket } from "./start";

export default function Guess() {
    const input = useRef(null);

    function handleClick() {
        socket.emit("guess", input.current.value);
        input.current.value = "";
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            socket.emit("guess", input.current.value);
            input.current.value = "";
        }
    }

    return (
        <>
            <div className="input-wrapper">
                <input
                    placeholder="your guess"
                    ref={input}
                    onKeyDown={handleKeyDown}
                />
            </div>
            <button className="next-player" onClick={handleClick}>
                Guess
            </button>
        </>
    );
}
