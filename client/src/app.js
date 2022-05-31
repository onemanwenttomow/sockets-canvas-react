import { useEffect, useState } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { socket } from "./start";
import Game from "./game";

export default function App() {
    const [rooms, setRooms] = useState();

    useEffect(() => {
        socket.on("rooms", (data) => setRooms(data));
    }, [socket.removeListener("rooms")]);

    if (!rooms) {
        return null;
    }
    return (
        <BrowserRouter>
            <>
                <Route exact path="/">
                    <div className="wrapper">
                        <div className="welcome">
                            <h1>Draw / Guess</h1>
                            <div>
                                <Link to="/play/1">Room 1 </Link>({rooms[1]})
                            </div>
                            <div>
                                <Link to="/play/2">Room 2</Link>({rooms[2]})
                            </div>
                            <div>
                                <Link to="/play/3">Room 3</Link>({rooms[3]})
                            </div>
                            <div>
                                <Link to="/play/4">Room 4</Link>({rooms[4]})
                            </div>
                        </div>
                    </div>
                </Route>
                <Route path="/play/:id">
                    <Game />
                </Route>
            </>
        </BrowserRouter>
    );
}
