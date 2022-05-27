import { socket } from "./start";

export default function NextPlayer() {
    function handleClick() {
        socket.emit("nextPlayer");
    }

    return (
        <button className="next-player" onClick={handleClick}>
            Next Player
        </button>
    );
}
