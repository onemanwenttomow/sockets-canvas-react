export default function Picker({ color, handleColorChange }) {
    return (
        <div className="colors-wrapper">
            <div
                className={`hotpink ${color === "hotpink" ? "active" : ""}`}
                onClick={() => handleColorChange("hotpink")}
            ></div>
            <div
                className={`blue ${color === "blue" ? "active" : ""}`}
                onClick={() => handleColorChange("blue")}
            ></div>
            <div
                className={`yellow ${color === "yellow" ? "active" : ""}`}
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
    );
}
