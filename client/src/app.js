import { useRef, useEffect, useState } from "react";
import { socket } from "./start";
import Canvas from "./canvas";
import Picker from "./picker";
import NextPlayer from "./next-player";

export default function App() {
    const wrapper = useRef(null);
    const [height, setHeight] = useState(null);
    const [width, setWidth] = useState(null);
    const [offsetLeft, setOffsetLeft] = useState(0);
    const [offsetTop, setOffsetTop] = useState(0);
    const [isDrawer, setIsDrawer] = useState(false);
    const [color, setColor] = useState("black");

    useEffect(() => {
        socket.on("isDrawer", (data) => setIsDrawer(data));
        setHeight(wrapper.current.clientHeight);
        setWidth(wrapper.current.clientWidth);
        setOffsetLeft(wrapper.current.offsetLeft);
        setOffsetTop(wrapper.current.getBoundingClientRect().top);
        window.addEventListener("resize", onResize, false);
        return () => {
            socket.removeListener("isDrawer");
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

    console.log("isDrawer: ", isDrawer);

    return (
        <div ref={wrapper} className="wrapper">
            {isDrawer && (
                <Picker color={color} handleColorChange={handleColorChange} />
            )}
            <Canvas
                height={height}
                width={width}
                offsetLeft={offsetLeft}
                offsetTop={offsetTop}
                color={color}
                isDrawer={isDrawer}
            />
            {isDrawer && <NextPlayer />}
            {!isDrawer && <button className="next-player">Guess</button>}
        </div>
    );
}
