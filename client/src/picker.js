export default function Picker({ color, handleColorChange }) {
    return (
        <div className="colors-wrapper">
            {/* <div
                className="picker hotpink"
                onClick={() => handleColorChange("hotpink")}
            ></div> */}
            <div
                className="picker blue"
                onClick={() => handleColorChange("blue")}
            ></div>
            <div
                className="picker yellow"
                onClick={() => handleColorChange("yellow")}
            ></div>
            <div
                className="picker black"
                onClick={() => handleColorChange("black")}
            ></div>
            <div
                className="picker red"
                onClick={() => handleColorChange("red")}
            ></div>
            <div
                className="picker white"
                onClick={() => handleColorChange("white")}
            ></div>
            <div className={`active active-${color}`}></div>
        </div>
    );
}
