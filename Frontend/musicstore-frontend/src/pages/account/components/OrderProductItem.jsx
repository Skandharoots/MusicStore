import {useEffect, useState} from "react";
import axios from "axios";
import {Slide, toast} from "react-toastify";
import Tooltip from "@mui/material/Tooltip";
import '../style/OrderProductItem.scss';
import {useNavigate} from "react-router-dom";
import noImage from '../../../../public/no-image.svg';


function OrderProductItem(props) {
    const [img, setImg] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {

        axios.get(`api/azure/list?path=${props.item.productSkuId}`, {})
            .then((response) => {
                axios.get(`api/azure/read?path=${response.data[0]}`, {responseType: 'blob'})
                    .then(res => {
                        let blob = new Blob([res.data], { type: "image/*" });
                        setImg(URL.createObjectURL(blob));
                    }).catch((error) => {
                    toast.error(error.response.data.message, {
                        position: "bottom-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                        progress: undefined,
                        theme: "light",
                        transition: Slide,
                    })
                })
            }).catch(error => {
            toast.error(error.response.data.message, {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "light",
                transition: Slide,
            })
        });

    }, [props.item])

    return (
        <div className="order-item">
            <div className="item-img"
                 style={{
                     width: '100px', maxHeight: '85px', aspectRatio: "16 / 9",
                     display: 'flex', justifyContent: 'center', alignItems: 'center',
                     backgroundSize: 'cover',
                 }}
            >
                <img alt={noImage} src={img}
                     style={{
                         objectFit: 'cover',
                         maxWidth: '100%',
                         maxHeight: '100%',
                         display: 'block',
                         flexShrink: '0',
                         flexGrow: '0',
                     }}
                />
            </div>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: 'column',
                width: '60%',
                height: '100%',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',

            }}>
                <Tooltip title={`${props.item.productName}`}>
                    <div className="item-name" onClick={() => {navigate(`/product/${props.item.productSkuId}/${props.item.productName}`)}}>
                        <p style={{margin: '0', fontSize: '16px', overflow: 'hidden'}}>{props.item.productName}</p>
                    </div>
                </Tooltip>
                <p style={{margin: '0 8px 0 0', fontSize: '14px'}}>Price: {props.item.unitPrice}$</p>
                <p style={{margin: '0 8px 0 0', fontSize: '14px'}}>Quantity: {props.item.quantity}</p>
            </div>

        </div>
    )

}

export default OrderProductItem