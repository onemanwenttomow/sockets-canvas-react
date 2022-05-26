import { useState, useEffect } from "react";
import { socket } from "./start";
import Canvas from "./canvas";

export default function App() {
    console.log("socket: ", socket);
    const [canvasDataUrl, setCanvasDataUrl] = useState("");

    useEffect(() => {
        socket.on("drawing", (dataUrl) => setCanvasDataUrl(dataUrl));
    }, []);

    return (
        <div className="wrapper">
            <Canvas setCanvasDataUrl={setCanvasDataUrl} />
            <img src={canvasDataUrl} alt="drawing" />
        </div>
    );
}
