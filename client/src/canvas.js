import { useEffect, useRef, useState } from "react";
import { socket } from "./start";
// import Picker from "./picker";
// import NextPlayer from "./next-player";

export default function Canvas({
    height,
    width,
    offsetLeft,
    offsetTop,
    isDrawer,
    color,
}) {
    const canvasRef = useRef(null);
    const [isPainting, setIsPainting] = useState(false);
    const [mousePosition, setMousePosition] = useState(null);
    // const [isDrawer, setIsDrawer] = useState(false);
    // const [color, setColor] = useState("black");

    useEffect(() => {
        socket.on("drawing", (data) =>
            drawLine(data.mousePosition, data.newMousePosition, data.color)
        );
        // socket.on("isDrawer", (data) => setIsDrawer(data));
        socket.on("drawDot", (data) =>
            drawDot({ x: data.x, y: data.y }, data.color)
        );
        socket.on("clearCanvas", clearCanvas);
        return () => {
            socket.removeListener("clearCanvas");
            socket.removeListener("drawing");
            socket.removeListener("isDrawer");
        };
    }, [width, height]);

    function startPaint(event) {
        if (!isDrawer) return;
        const coordinates = getCoordinates(event);
        if (coordinates) {
            setMousePosition(coordinates);
            setIsPainting(true);
            drawDot(coordinates, color);
            socket.emit("drawDot", { ...coordinates, color });
        }
    }

    function drawDot({ x, y }, color) {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.beginPath();
        context.arc(x * width, y * height, 5, 0, 2 * Math.PI, false);
        context.lineWidth = 1;
        context.lineJoin = "round";
        context.fillStyle = color;
        context.strokeStyle = color;
        context.fill();
        context.stroke();
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

        const x = event.pageX || event.touches[0].clientX;
        const y = event.pageY || event.touches[0].clientY;
        return {
            x: (x - offsetLeft) / width,
            y: (y - offsetTop) / height,
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
                originalMousePosition.x * width,
                originalMousePosition.y * height
            );
            context.lineTo(
                newMousePosition.x * width,
                newMousePosition.y * height
            );
            context.closePath();

            context.stroke();
        }
    }

    // function handleColorChange(newColor) {
    //     setColor(newColor);
    // }

    function clearCanvas() {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, width, height);
    }

    return (
        <>
            <canvas
                ref={canvasRef}
                height={height}
                width={width}
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
