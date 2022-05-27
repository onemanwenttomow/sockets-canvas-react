import { useEffect, useRef, useState } from "react";
import { socket } from "./start";

export default function Canvas() {
    const canvasRef = useRef(null);
    const [isPainting, setIsPainting] = useState(false);
    const [mousePosition, setMousePosition] = useState(null);
    const [isDrawer, setIsDrawer] = useState(false);
    const [canvasWidth, setCanvasWidth] = useState(window.innerWidth);
    const [canvasHeight, setCanvasHeight] = useState(window.innerHeight);
    const [color, setColor] = useState("black");

    useEffect(() => {
        socket.on("drawing", (data) =>
            drawLine(data.mousePosition, data.newMousePosition, data.color)
        );
        socket.on("isDrawer", (data) => setIsDrawer(data));
        window.addEventListener("resize", onResize, false);
    }, []);

    function onResize() {
        setCanvasWidth(window.innerWidth);
        setCanvasHeight(window.innerHeight);
    }

    function startPaint(event) {
        const coordinates = getCoordinates(event);
        if (coordinates) {
            setMousePosition(coordinates);
            setIsPainting(true);
        }
    }

    function paint(event) {
        if (isPainting && isDrawer) {
            const newMousePosition = getCoordinates(event);
            if (mousePosition && newMousePosition) {
                drawLine(mousePosition, newMousePosition, color);
                setMousePosition(newMousePosition);
                socket.emit("drawing", {
                    mousePosition,
                    newMousePosition,
                    color,
                });
            }
        }
    }

    function exitPaint() {
        setIsPainting(false);
        setMousePosition(undefined);
    }

    function getCoordinates(event) {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const x = event.pageX || event.touches[0].clientX;
        const y = event.pageY || event.touches[0].clientY;
        return {
            x: (x - canvas.offsetLeft) / canvasWidth,
            y: (y - canvas.offsetTop) / canvasHeight,
        };
    }

    function drawLine(originalMousePosition, newMousePosition, color) {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (context) {
            context.strokeStyle = color;
            context.lineJoin = "round";
            context.lineWidth = 10;

            context.beginPath();
            context.moveTo(
                originalMousePosition.x * canvasWidth,
                originalMousePosition.y * canvasHeight
            );
            context.lineTo(
                newMousePosition.x * canvasWidth,
                newMousePosition.y * canvasHeight
            );
            context.closePath();

            context.stroke();
        }
    }

    function handleColorChange(newColor) {
        setColor(newColor);
    }

    return (
        <>
            {isDrawer && (
                <div className="colors-wrapper">
                    <div
                        className={`hotpink ${
                            color === "hotpink" ? "active" : ""
                        }`}
                        onClick={() => handleColorChange("hotpink")}
                    ></div>
                    <div
                        className={`blue ${color === "blue" ? "active" : ""}`}
                        onClick={() => handleColorChange("blue")}
                    ></div>
                    <div
                        className={`yellow ${
                            color === "yellow" ? "active" : ""
                        }`}
                        onClick={() => handleColorChange("yellow")}
                    ></div>
                    <div
                        className={`black ${color === "black" ? "active" : ""}`}
                        onClick={() => handleColorChange("black")}
                    ></div>
                    <div
                        className={`red ${color === "red" ? "active" : ""}`}
                        onClick={() => handleColorChange("red")}
                    ></div>
                </div>
            )}
            <canvas
                ref={canvasRef}
                height={canvasHeight}
                width={canvasWidth}
                onMouseDown={startPaint}
                onMouseMove={paint}
                onMouseUp={exitPaint}
                onMouseLeave={exitPaint}
                onTouchStart={startPaint}
                onTouchMove={paint}
                onTouchEnd={exitPaint}
            />
        </>
    );
}
