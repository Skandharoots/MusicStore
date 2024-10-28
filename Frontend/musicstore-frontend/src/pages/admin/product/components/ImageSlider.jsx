import {useEffect, useState} from "react"
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import LensOutlinedIcon from '@mui/icons-material/LensOutlined';
import CircleIcon from '@mui/icons-material/Circle';
import DeleteIcon from '@mui/icons-material/Delete';
import "../../style/ImageSlider.scss";
import Tooltip from '@mui/material/Tooltip';

export function ImageSlider({ imageBinaries, onDelete }) {
    const [imageIndex, setImageIndex] = useState(0)
    const [images, setImages] = useState([])

    useEffect(() => {
        let imagesURL = [];
        [...imageBinaries].map((f) => (
            imagesURL.push(URL.createObjectURL(f))
        ))
        setImages(imagesURL);
    }, [imageBinaries])

    function showNextImage() {
        setImageIndex(index => {
            if (index === images.length - 1) return 0
            return index + 1
        })
    }

    function showPrevImage() {
        setImageIndex(index => {
            if (index === 0) return images.length - 1
            return index - 1
        })
    }

    const removeCurrentPhoto = () => {
        onDelete(imageBinaries[imageIndex]);
        if (imageIndex - 1 < 0) {
            setImageIndex(0)
        } else {
            setImageIndex(imageIndex - 1)
        }
    }

    return (
        <section
            aria-label="Image Slider"
            style={{ width: "100%", height: "100%", position: "relative" }}
        >
            <a href="#after-image-slider-controls" className="skip-link">
                Skip Image Slider Controls
            </a>
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    overflow: "hidden",
                }}
            >
                {images.map(( url, index) => (
                    <img
                        key={index}
                        src={url}
                        alt={url.name}
                        aria-hidden={imageIndex !== index}
                        className="img-slider-img"
                        style={{ translate: `${-100 * imageIndex}%` }}
                    />
                ))}
            </div>
            <button
                onClick={showPrevImage}
                className="img-slider-btn"
                style={{left: 0}}
            >
                <ArrowBackIosNewOutlinedIcon />
            </button>
            <button
                onClick={showNextImage}
                className="img-slider-btn"
                style={{right: 0}}
                aria-label={"View Next Image"}
            >
                <ArrowForwardIosOutlinedIcon />
            </button>
            <Tooltip title={"Remove current photo"}>
                <button
                    className="img-slider-del-btn"
                    aria-label="Delete Image"
                    onClick={removeCurrentPhoto}
                >
                    <DeleteIcon fontSize={"inherit"}/>
                </button>
            </Tooltip>

            <div
                style={{
                    position: "absolute",
                    bottom: ".5rem",
                    left: "50%",
                    translate: "-50%",
                    display: "flex",
                    gap: ".25rem",
                }}
            >
                {images.map((_, index) => (
                    <button
                        key={index}
                        className="img-slider-dot-btn"
                        aria-label={`View Image ${index + 1}`}
                        onClick={() => setImageIndex(index)}
                    >
                        {index === imageIndex ? (
                            <CircleIcon aria-hidden="true" />
                        ) : (
                            <LensOutlinedIcon aria-hidden="true" />
                        )}
                    </button>
                ))}
            </div>
            <div id="after-image-slider-controls" />
        </section>
    )
}