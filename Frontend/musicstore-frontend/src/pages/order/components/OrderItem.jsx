import {useEffect, useState} from "react";
import axios from "axios";
import {Bounce, toast} from "react-toastify";
import '../style/OrderItem.scss';
import Tooltip from "@mui/material/Tooltip";
import {
    FormControl,
    MenuItem,
    Select
} from "@mui/material";
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";
import {useNavigate} from "react-router-dom";


function OrderItem(props) {

    const [img, setImg] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`api/products/items/get/${props.item.productSkuId}`)
            .then(res => {
                if (res.data.inStock < 1) {
                    props.onDelete(props.item.id);
                    axios.get('api/users/csrf/token', {})
                        .then(res => {
                            axios.delete(`api/cart/delete/${LocalStorageHelper.GetActiveUser()}/${props.item.productSkuId}`, {
                                headers: {
                                    'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                                    'X-XSRF-TOKEN': res.data.token,
                                }
                            }).then(() => {
                                navigate('/basket');
                            }).catch(() => {})
                        }).catch(() => {
                            toast.error('Cannot fetch token', {
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
                } else {
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
                }
            }).catch(() => {})

    }, []);


    return (
        <div className="order-item">
            <div style={{
                width: "100px",
                height: "85px",
                display: "flex",
                overflow: "hidden",
            }}>
                <div className="product-img"
                     style={{
                         width: '100px', maxHeight: '100%', aspectRatio: "16 / 9",
                         display: 'flex', justifyContent: 'center', alignItems: 'center',
                         backgroundSize: 'cover',
                     }}
                >
                    <img alt={`enter prod name here!!! photo`} src={img}
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
            </div>
                <Tooltip title={`${props.item.productName}`}>
                    <div className="product-name">
                        <p style={{margin: '0', fontSize: '18px'}}>{props.item.productName}</p>
                    </div>
                </Tooltip>
                <div className="product-quantity">
                    <div style={{width: '120px'}}>
                        <p style={{margin: '0 8px 0 0', fontSize: '14px'}}>{props.item.productPrice}$</p>
                    </div>
                    <FormControl
                        size="small"
                        autoFocus
                        sx={{
                            m: 1,
                            margin: '0 0',
                            width: 'fit-content',
                            height: 'fit-content',
                            "& label.Mui-focused": {
                                color: 'rgb(39, 99, 24)'
                            },
                            "& .MuiOutlinedInput-root": {
                                "&.Mui-focused fieldset": {
                                    borderColor: 'rgb(39, 99, 24)'
                                }
                            }
                        }}
                    >
                        <Select
                            id="quantity-select"
                            disabled={true}
                            value={props.item.quantity}
                            variant={"outlined"}
                            sx={{
                                height: '40px',

                            }}
                        >
                            <MenuItem key={props.item.id} value={props.item.quantity}>{props.item.quantity}</MenuItem>
                        </Select>
                    </FormControl>
                </div>

            </div>
            )
            }

            export default OrderItem