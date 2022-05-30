import { useState, useEffect } from "react";
import Picker from "./picker";
import QuestionIcon from "./icons/question";

export default function DrawerTool({ wordToDrawer, handleColorChange, color }) {
    const [src, setSrc] = useState(null);
    const [nextUrl, setNextUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setSrc("");
    }, [wordToDrawer]);

    async function handleClick() {
        const data = await fetchImage(
            `https://api.pexels.com/v1/search?query=${wordToDrawer}&per_page=1`
        );
        if (data.photos.length === 0) {
            return setSrc("");
        }
        setSrc(data.photos[0].src.medium);
        setNextUrl(data.next_page);
    }

    async function fetchImage(url) {
        setIsLoading(true);
        const response = await fetch(url, {
            headers: {
                Authorization:
                    "563492ad6f9170000100000112a0a887569748d49276462a0a9d2c59",
            },
            query: wordToDrawer,
            per_page: 5,
            size: "medium",
        });
        const data = await response.json();
        setIsLoading(false);
        return data;
    }

    async function handleImageClick() {
        if (!nextUrl) {
            return;
        }
        const data = await fetchImage(nextUrl);
        if (data.photos.length === 0) {
            return setSrc("");
        }
        setSrc(data.photos[0].src.medium);
        setNextUrl(data.next_page);
    }

    return (
        <div className="extra-wrapper extra">
            <Picker color={color} handleColorChange={handleColorChange} />

            <div className="find-image-wrapper">
                <div onClick={handleClick} className="what-the-heck">
                    What the heck does a <span>{wordToDrawer}</span> look like?
                </div>
                <div className="image-wrapper centered">
                    {!src && (
                        <div className="question-icon" onClick={handleClick}>
                            {isLoading ? (
                                <div>loading...</div>
                            ) : (
                                <QuestionIcon />
                            )}
                        </div>
                    )}
                    {src &&
                        (isLoading ? (
                            <div>loading...</div>
                        ) : (
                            <img
                                className="image-to-draw"
                                src={src}
                                onClick={handleImageClick}
                            />
                        ))}
                </div>
            </div>
        </div>
    );
}
