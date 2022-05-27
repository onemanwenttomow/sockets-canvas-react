import { useEffect, useRef, useState } from "react";
import { socket } from "./start";
import Picker from "./picker";
import NextPlayer from "./next-player";

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
        socket.on("clearCanvas", () => clearCanvas());
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

    function clearCanvas() {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvasWidth, canvasHeight);
    }

    return (
        <>
            {isDrawer && (
                <Picker color={color} handleColorChange={handleColorChange} />
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
            {isDrawer && <NextPlayer />}
        </>
    );
}
