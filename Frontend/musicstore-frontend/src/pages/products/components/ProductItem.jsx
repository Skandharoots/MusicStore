import {useEffect, useState} from "react";
import axios from "axios";
import {Bounce, toast} from "react-toastify";
import Grid from "@mui/material/Grid2";
import '../style/ProductItem.scss';
import {useNavigate} from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import {Button} from "@mui/material";
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';

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
                     width: '100%',
                     padding: '0 2%',
                     marginTop: '4px',
                 }}
            >
                <Tooltip title={props.item.productName}>
                    <p style={{
                        margin: '0',
                        fontSize: '16px',
                        overflow: 'hidden',
                        textWrap: 'nowrap'
                    }}>{props.item.productName}</p>
                </Tooltip>
                <p style={{margin: '0', overflow: 'hidden', textWrap: 'nowrap'}}>Brand: {props.item.manufacturer.name}</p>
                <p style={{margin: '0', overflow: 'hidden', textWrap: 'nowrap'}}>Made in: {props.item.builtinCountry.name}</p>
            </div>
            <div className="product-item-buttons"
                 style={{
                     display: 'flex',
                     flexDirection: 'row',
                     justifyContent: 'space-between',
                     alignItems: 'center',
                     width: '100%',
                     padding: '0 2%',
                     boxSizing: 'border-box',
                 }}
            >
                <p style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    overflow: 'hidden',
                    textWrap: 'nowrap'
                }}>{props.item.productPrice}$</p>
                <Tooltip title={"Add to basket"}>
                    <Button
                        variant={"outlined"}
                        fullWidth={false}
                        sx={{
                            borderColor: 'rgb(39, 99, 24)',
                            backgroundColor: 'transparent',
                            width: '35px',
                            minWidth: '0',
                            height: '35px',
                            display: 'flex',
                            "&:hover": {
                                backgroundColor: 'rgba(49,140,23, 0.2)',
                                outline: 'none !important',
                                borderColor: 'rgb(39, 99, 24)'
                            },
                            "&:focus": {
                                backgroundColor: 'rgba(49,140,23, 0.2)',
                                outline: 'none !important',
                                borderColor: 'rgb(39, 99, 24)'
                            }
                        }}
                    >
                        <AddShoppingCartOutlinedIcon size={"small"} sx={{color: 'rgb(39, 99, 24)', fontSize: '16px'}}/>
                    </Button>
                </Tooltip>
            </div>

        </Grid>
    )
}

export default ProductItem;