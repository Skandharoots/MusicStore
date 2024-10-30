import {useEffect, useState} from "react";
import axios from "axios";
import {Bounce, toast} from "react-toastify";
import Grid from "@mui/material/Grid2";
import '../style/ProductItem.scss';
import {useNavigate} from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";


function ProductItem(props) {
    const [img, setImg] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`api/azure/list?path=${props.item.productSkuId}`, {})
            .then((response) => {
                axios.get(`api/azure/read?path=${response.data[0]}`, {responseType: 'blob'})
                    .then(res => {
                        var blob = new Blob([res.data], { type: "image/*" });
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
                        theme: "colored",
                        transition: Bounce,
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
                theme: "colored",
                transition: Bounce,
            })
        })
    }, [])

    return (
        <Grid sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '240px',
            height: 'fit-content',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            padding: '4px',
            color: 'black',
            fontSize: '12px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s',
            "&:hover": {
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.4)',
                cursor: 'pointer',
            },
        }}
              onClick={() => {navigate('#')}}
              key={props.item.id}
        >
            <div className="product-img"
                 style={{width: '100%', maxHeight: '150px', aspectRatio: "16 / 9",
                     display: 'flex', justifyContent: 'center', alignItems: 'center',
                     backgroundSize: 'cover',}}
            >
                <img alt={`${props.item.productName} photo`} src={img}
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
            <div className="product-metrics-main"
                 style={{
                     width: '90%',
                     padding: '2%',
                     marginTop: '4px',
                 }}
            >
                <p style={{margin: '0', fontSize: '16px', fontWeight: 'bold', overflow: 'hidden', textWrap: 'nowrap'}}>{props.item.manufacturer.name}</p>
                <p style={{margin: '0', fontSize: '16px', overflow: 'hidden', textWrap: 'nowrap'}}>{props.item.productName}</p>
                <p style={{margin: '0', overflow: 'hidden', textWrap: 'nowrap'}}>{props.item.productPrice}$</p>
                <Tooltip title={props.item.productDescription}>
                <p style={{margin: '0', overflow: 'hidden', textWrap: 'nowrap'}}>{props.item.productDescription}</p>
                </Tooltip>
                <p style={{margin: '0', overflow: 'hidden', textWrap: 'nowrap'}}>Made in: {props.item.builtinCountry.name}</p>

            </div>

        </Grid>
    )
}

export default ProductItem;