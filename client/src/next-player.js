import { socket } from "./start";

export default function NextPlayer({ resetGuesses }) {
    function handleClick() {
        socket.emit("nextPlayer");
        resetGuesses(resetGuesses);
    }

    return (
        <button className="next-player" onClick={handleClick}>
            Next Player
        </button>
    );
}
