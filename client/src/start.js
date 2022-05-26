import ReactDOM from "react-dom";
import App from "./app";
import io from "socket.io-client";
export const socket = io.connect();

ReactDOM.render(<App />, document.querySelector("main"));
