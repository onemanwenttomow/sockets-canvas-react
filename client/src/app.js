import { useRef, useEffect, useState } from "react";
import Canvas from "./canvas";

export default function App() {
    const wrapper = useRef(null);
    const [height, setHeight] = useState(null);
    const [width, setWidth] = useState(null);
    const [offsetLeft, setOffsetLeft] = useState(0);

    useEffect(() => {
        setHeight(wrapper.current.clientHeight);
        setWidth(wrapper.current.clientWidth);
        setOffsetLeft(wrapper.current.offsetLeft);
        window.addEventListener("resize", onResize, false);
    }, []);

    function onResize() {
        setHeight(wrapper.current.clientHeight);
        setWidth(wrapper.current.clientWidth);
        setOffsetLeft(wrapper.current.offsetLeft);
    }

    return (
        <div ref={wrapper} className="wrapper">
            <Canvas height={height} width={width} offsetLeft={offsetLeft} />
        </div>
    );
}
