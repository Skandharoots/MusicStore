import React, {useEffect, useState} from "react";
import axios from "axios";
import {Slide, toast} from "react-toastify";
import '../style/BasketItem.scss';
import Tooltip from "@mui/material/Tooltip";
import {
    Backdrop,
    Button, CircularProgress,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    MenuItem,
    Select
} from "@mui/material";
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";
import { DeleteOutlineOutlined } from "@mui/icons-material";
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from "react-router-dom";


function BasketItem(props) {

    const [img, setImg] = useState(null);
    const [maxQuantity, setMaxQuantity] = useState(0);
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [open, setOpen] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`api/products/items/get/${props.item.productSkuId}`)
            .then(res => {
                setMaxQuantity(res.data.inStock);
                if (props.item.quantity > res.data.inStock) {
                    const newQuantity = res.data.inStock;
                    setSelectedQuantity(newQuantity);
                    if (LocalStorageHelper.IsUserLogged()) {
                        axios.get('api/users/csrf/token')
                            .then(res => {
                                if (newQuantity > 0) {
                                    axios.put(`api/cart/update/${props.item.id}`, {
                                        quantity: newQuantity,
                                    }, {
                                        headers: {
                                            'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                                            'X-XSRF-TOKEN': res.data.token,
                                            'Content-Type': 'application/json',
                                        }
                                    }).then(() => {})
                                        .catch(() => {})
                                } else {
                                    axios.get('api/users/csrf/token', {})
                                        .then(res => {
                                            axios.delete(`api/cart/delete/${LocalStorageHelper.GetActiveUser()}/${props.item.productSkuId}`, {
                                                headers: {
                                                    'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                                                    'X-XSRF-TOKEN': res.data.token,
                                                }
                                            }).then(() => {
                                                toast.warning('We have removed an unavailable product ' + props.item.productName + ' from the basket.', {
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
                                                props.onDelete(props.id);
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
                                            theme: "light",
                                            transition: Slide,
                                        })
                                    })
                                }
                            }).catch(() => {
                                toast.error('Cannot fetch token', {
                                    position: "bottom-center",
                                    autoClose: 3000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: false,
                                    progress: undefined,
                                    theme: "light",
                                    transition: Slide,
                                });
                            })
                    }
                } else {
                    setSelectedQuantity(props.item.quantity);
                }
                axios.get(`api/azure/list?path=${props.item.productSkuId}`, {})
                    .then((response) => {
                        axios.get(`api/azure/read?path=${response.data[0]}`, {responseType: 'blob'})
                            .then(res => {
                                let blob = new Blob([res.data], { type: "image/*" });
                                setImg(URL.createObjectURL(blob));
                            }).catch(() => {
                            //
                        })
                    }).catch(() => {
                    //
                })
            }).catch(() => {});

    }, [props.item])

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteCartItem = (event) => {
        event.preventDefault();
        setOpenBackdrop(true);
        setOpen(false);
        if (LocalStorageHelper.IsUserLogged() === true) {
            axios.get('api/users/csrf/token', {})
                .then((response) => {
                    axios.delete(`api/cart/delete/${LocalStorageHelper.GetActiveUser()}/${props.item.productSkuId}`, {
                        headers: {
                            'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                            'X-XSRF-TOKEN': response.data.token,
                        }
                    }).then(() => {
                        setOpenBackdrop(false);
                        toast.info("Basket item deleted successfully.", {
                            position: "bottom-center",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: false,
                            progress: undefined,
                            theme: "light",
                            transition: Slide,
                        });
                        props.onDelete(props.id);
                    }).catch((error) => {
                            setOpenBackdrop(false);
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
                })
        } else {
            let basket = JSON.parse(localStorage.getItem('basket'));
            let itemToRemove = null;
            [...basket].map((item) => {
                if (item.productSkuId === props.item.productSkuId) {
                    itemToRemove = item;
                }
            });
            if (itemToRemove) {
                const index = basket.indexOf(itemToRemove);
                basket.splice(index, 1);
                localStorage.setItem('basket', JSON.stringify(basket));
                toast.info("Basket item deleted successfully.", {
                    position: "bottom-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                    theme: "light",
                    transition: Slide,
                });
                props.onDelete(props.id);
            }
        }
    }

    const renderQuantityItems = () => {
        let items = []
        for (let i = 1; i < 10; i++) {
            if (i + 1 <= maxQuantity) {
                items.push(<MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>)
            }
        }
        return items;
    }

    const handleQuantityChange = (event) => {
        event.preventDefault();
        setSelectedQuantity(event.target.value);
        axios.get('api/users/csrf/token')
        .then(res => {
            axios.put(`api/cart/update/${props.item.id}`, {
                quantity: event.target.value,
            }, {
                headers: {
                    'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': res.data.token,
                }
            }).then(() => {})
                .catch(() => {
                    toast.error('We could not update the item quantity', {
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
        }).catch(() => {
            toast.error('Cannot fetch token', {
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
    }

    return (
        <div className="basket-item">
            <Backdrop
                sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
                open={openBackdrop}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
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
                         backgroundSize: 'cover', flexShrink: '0', flexGrow: '0',
                     }}
                >
                    <img alt={'No product photo'} src={img}
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
                    <div className="product-name"  onClick={() => {navigate(`/product/${props.item.productSkuId}/${props.item.productName}`)}}>
                        <p style={{margin: '0', fontSize: '18px'}}>{props.item.productName}</p>
                    </div>
                </Tooltip>
                <div className="product-quantity">
                    <p style={{margin: '0 8px 0 0', fontSize: '14px'}}>{props.item.productPrice}$</p>
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
                            disabled={maxQuantity === 0}
                            value={selectedQuantity}
                            onChange={handleQuantityChange}
                            variant={"outlined"}
                            sx={{
                                height: '40px',

                            }}
                        >
                            <MenuItem key={1} value={1}>1</MenuItem>
                            {renderQuantityItems()}
                        </Select>
                    </FormControl>
                    <React.Fragment>
                        <Tooltip title={'Delete item'}>
                            <Button
                                variant="text"
                                onClick={handleClickOpen}
                                sx={{
                                    width: '30px',
                                    height: '30px',
                                    margin: '0 0 0 8px',
                                    minWidth: '0',
                                    fontSize: '8px',
                                    color: 'black',
                                    "&:hover": {
                                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                        color: 'rgb(193,56,56)',
                                    },
                                    "&:focus": {
                                        outline: 'none !important',
                                    }
                                }}
                            >
                                <DeleteOutlineOutlined
                                    size="small"
                                />
                            </Button>
                        </Tooltip>
                        <Dialog
                            open={open}
                            onClose={handleClose}
                        >
                            <DialogTitle>Delete item from basket</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Do you want to delete {props.item.productName} from basket?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    variant="contained"
                                    onClick={handleClose}
                                    sx={{
                                        backgroundColor: 'rgb(11,108,128)',
                                        "&:hover": {backgroundColor: 'rgb(16,147,177)'},
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={deleteCartItem}
                                    sx={{
                                        backgroundColor: 'rgb(159,20,20)',
                                        "&:hover": {backgroundColor: 'rgb(193,56,56)'},
                                    }}
                                >
                                    Delete
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </React.Fragment>
                </div>

            </div>
            )
            }

            export default BasketItem