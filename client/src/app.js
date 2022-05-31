import { BrowserRouter, Route, Link } from "react-router-dom";
import Game from "./game";

export default function App() {
    return (
        <BrowserRouter>
            <>
                <Route exact path="/">
                    <div className="wrapper">
                        <div className="welcome">
                            <h1>Draw / Guess</h1>
                            <Link to="/play/1">Room 1</Link>
                            <Link to="/play/2">Room 2</Link>
                            <Link to="/play/3">Room 3</Link>
                            <Link to="/play/4">Room 4</Link>
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
