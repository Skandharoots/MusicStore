import {useEffect, useState} from "react";
import axios from "axios";
import {Slide, toast} from "react-toastify";
import Tooltip from "@mui/material/Tooltip";
import './style/OrderProductItem.scss';


function AdminOrderProductItem(props) {
    const [img, setImg] = useState(null);

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
        <div className="order-item" style={{
            width: "100%",
            boxSizing: "border-box",
            minWidth: '100px'
        }}>
            <div className="item-img"
                 style={{
                     maxWidth: '40%', maxHeight: '85px', aspectRatio: "16 / 9",
                     display: 'flex', justifyContent: 'center', alignItems: 'center',
                     backgroundSize: 'cover',
                 }}
            >
                <img alt={'No image'} src={img}
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
                maxWidth: '60%',
                height: '100%',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                boxSizing: 'border-box',

            }}>
                <Tooltip title={`${props.item.productName}`}>
                    <p style={{margin: '0', fontSize: '16px', maxWidth: '100%' , overflow: 'hidden', textWrap: 'nowrap'}}>{props.item.productName}</p>
                </Tooltip>
                <p style={{margin: '0 8px 0 0', fontSize: '14px', maxWidth: '100%' , overflow: 'hidden', textWrap: 'nowrap'}}>Price: {props.item.unitPrice}$</p>
                <p style={{margin: '0 8px 0 0', fontSize: '14px', maxWidth: '100%' , overflow: 'hidden', textWrap: 'nowrap'}}>Quantity: {props.item.quantity}</p>
            </div>

        </div>
    )

}

export default AdminOrderProductItem