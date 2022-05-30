import { useState, useEffect } from "react";
import Picker from "./picker";
import QuestionIcon from "./icons/question";

export default function DrawerTool({ wordToDrawer, handleColorChange, color }) {
    const [src, setSrc] = useState(null);

    useEffect(() => {
        setSrc("");
    }, [wordToDrawer]);

    async function handleClick() {
        console.log("clicked");
        const response = await fetch(
            `https://api.pexels.com/v1/search?query=${wordToDrawer}&per_page=1`,
            {
                headers: {
                    Authorization:
                        "563492ad6f9170000100000112a0a887569748d49276462a0a9d2c59",
                },
                query: wordToDrawer,
                per_page: 5,
                size: "medium",
            }
        );
        const data = await response.json();
        console.log("data: ", data);
        if (data.photos.length === 0) {
            return setSrc("");
        }
        setSrc(data.photos[0].src.medium);
    }
    return (
        <div className="extra-wrapper extra">
            <Picker color={color} handleColorChange={handleColorChange} />

            <div className="find-image-wrapper">
                <div onClick={handleClick} className="centered what-the-heck">
                    What the heck does a {wordToDrawer} look like?
                </div>
                <div className="image-wrapper centered">
                    {!src && (
                        <div className="question-icon" onClick={handleClick}>
                            <QuestionIcon />
                        </div>
                    )}
                    {src && <img className="image-to-draw" src={src} />}
                </div>
            </div>
        </div>
    );
}
