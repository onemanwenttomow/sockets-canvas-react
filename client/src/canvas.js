import { useCallback, useEffect, useRef, useState } from "react";
import { socket } from "./start";

export default function Canvas() {
    const canvasRef = useRef(null);
    const [isPainting, setIsPainting] = useState(false);
    const [mousePosition, setMousePosition] = useState(null);
    const [isDrawer, setIsDrawer] = useState(false);
    const [canvasWidth, setCanvasWidth] = useState(window.innerWidth);
    const [canvasHeight, setCanvasHeight] = useState(window.innerHeight);

    useEffect(() => {
        socket.on("drawing", (data) =>
            drawLine(data.mousePosition, data.newMousePosition)
        );
        socket.on("isDrawer", (data) => setIsDrawer(data));
        window.addEventListener("resize", onResize, false);
    }, []);

    function onResize() {
        console.log("resizing,...");
        setCanvasWidth(window.innerWidth);
        setCanvasHeight(window.innerHeight);
    }

    const startPaint = useCallback((event) => {
        const coordinates = getCoordinates(event);
        if (coordinates) {
            setMousePosition(coordinates);
            setIsPainting(true);
        }
    }, []);

    const paint = useCallback(
        (event) => {
            if (isPainting && isDrawer) {
                const newMousePosition = getCoordinates(event);
                if (mousePosition && newMousePosition) {
                    drawLine(mousePosition, newMousePosition);
                    setMousePosition(newMousePosition);
                    socket.emit("drawing", { mousePosition, newMousePosition });
                }
            }
        },
        [isPainting, mousePosition]
    );

    const exitPaint = useCallback(() => {
        setIsPainting(false);
        setMousePosition(undefined);
    }, []);

    const getCoordinates = (event) => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const x = event.pageX || event.touches[0].clientX;
        const y = event.pageY || event.touches[0].clientY;
        return {
            x: (x - canvas.offsetLeft) / canvasWidth,
            y: (y - canvas.offsetTop) / canvasHeight,
        };
    };

    const drawLine = (originalMousePosition, newMousePosition) => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (context) {
            context.strokeStyle = "hotpink";
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
    };

    return (
        <>
            {/* <h1>isDrawer: {`${isDrawer}`}</h1> */}
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
