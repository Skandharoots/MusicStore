import {useEffect, useState} from "react"
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import LensOutlinedIcon from '@mui/icons-material/LensOutlined';
import CircleIcon from '@mui/icons-material/Circle';
import "../style/ImageSlider.scss";

export function Gallery({ imageBinaries }) {
    const [imageIndex, setImageIndex] = useState(0)
    const [images, setImages] = useState([])

    useEffect(() => {
        setImages(imageBinaries);
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

    return (
        <section
            style={{ width: "100%", height: "100%", position: "relative" }}
        >
            <div style={{
                width: "100%",
                height: "100%",
                display: "flex",
                overflow: "hidden",
                backgroundColor: 'white',
                borderRadius: '1em',
            }}>

                {images.map((url, index) => (
                    <div key={index * 100} className={'img-slider-img-cont'} style={{ maxHeight: '100%', aspectRatio: "21 / 9",
                        display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: '0',
                        flexGrow: '0', backgroundSize: 'cover', translate: `${-100 * imageIndex}%`}}>
                        <img
                            key={index}
                            src={url}
                            alt={'No image'}
                            className="img-slider-img"
                            style={{}}
                        />
                    </div>
                ))}
            </div>
            <button
                onClick={showPrevImage}
                className="img-slider-home-btn"
                formNoValidate={true}
                style={{left: 0}}
            >
                <ArrowBackIosNewOutlinedIcon/>
            </button>
            <button
                onClick={showNextImage}
                className="img-slider-home-btn"
                formNoValidate={true}
                style={{right: 0}}
            >
                <ArrowForwardIosOutlinedIcon/>
            </button>


        </section>
    )
}