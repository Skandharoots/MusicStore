import React, {useEffect, useState} from "react";
import axios from "axios";
import {Slide, toast} from "react-toastify";
import Grid from "@mui/material/Grid2";
import '../style/ProductItem.scss';
import {useNavigate} from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import {
    Backdrop,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material";
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";

function ProductItem(props) {
    const [img, setImg] = useState(null);
    const [opacity, setOpacity] = useState(0);
    const [disableBasket, setDisableBasket] = useState(false);
    const [open, setOpen] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false);

    const navigate = useNavigate();

    const handleClickOpen = (event) => {
        event.preventDefault();
        setOpen(true);
        if (LocalStorageHelper.IsUserLogged()) {
            axios.get(`api/cart/get/${LocalStorageHelper.GetActiveUser()}`, {
                headers: {
                    'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                }
            }).then(res => {
                let exists = false;
                let id = null;
                let currentQuantity = 0;
                if (res.data.length > 0) {
                    [...res.data].map((item) => {
                        if (item.productSkuId === props.item.productSkuId) {
                            exists = true;
                            id = item.id;
                            currentQuantity = item.quantity;
                        }
                    });
                }
                if (exists) {
                    axios.get('api/users/csrf/token')
                        .then((response) => {
                            axios.put(`api/cart/update/${id}`, {
                                quantity: currentQuantity + 1,
                            },{
                                headers: {
                                    'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                                    'X-XSRF-TOKEN': response.data.token,
                                    'Content-Type': 'application/json',
                                }
                            }).then(() => {
                                setOpen(true);
                                LocalStorageHelper.setBasketItems(1);
                                window.dispatchEvent(new Event('basket'));
                            }).catch(() => {
                                toast.error("Could not update basket items", {
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
                            });
                        }).catch(() => {
                        toast.error("Cannot fetch token", {
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
                    });
                } else {
                    axios.get('api/users/csrf/token')
                        .then((response) => {
                            axios.post(`api/cart/create`, {
                                userUuid: LocalStorageHelper.GetActiveUser(),
                                productSkuId: props.item.productSkuId,
                                productPrice: props.item.productPrice,
                                productName: props.item.productName,
                                quantity: 1
                            }, {
                                headers: {
                                    'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                                    'X-XSRF-TOKEN': response.data.token,
                                    'Content-Type': 'application/json',
                                }
                            }).then(() => {
                                setOpen(true);
                                LocalStorageHelper.setBasketItems(1);
                                window.dispatchEvent(new Event('basket'));
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
                                });
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
                        });
                    });
                }
            }).catch(() => {
                toast.error('Error getting existing cart items.', {
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
            });

        } else {
            LocalStorageHelper.setBasketItems(1);
            window.dispatchEvent(new Event('basket'));
            let basket = JSON.parse(localStorage.getItem('basket'));
            if (!basket) {
                const newBasket = [
                    {
                        productSkuId: props.item.productSkuId,
                        productPrice: props.item.productPrice,
                        productName: props.item.productName,
                        quantity: 1
                    },
                ];
                localStorage.setItem('basket', JSON.stringify(newBasket));
            } else {
                let itemToUpdate = null;
                [...basket].map((item) => {
                    if (item.productSkuId === props.item.productSkuId) {
                        itemToUpdate = item;
                    }
                });
                if (itemToUpdate) {
                    let newItem = {
                        productSkuId: props.item.productSkuId,
                        productPrice: props.item.productPrice,
                        productName: props.item.productName,
                        quantity: itemToUpdate.quantity + 1
                    };
                    let index = basket.indexOf(itemToUpdate);
                    basket.splice(index, 1);
                    basket.push(newItem);
                    localStorage.setItem('basket', JSON.stringify(basket));
                } else {
                    let newItem = {
                        productSkuId: props.item.productSkuId,
                        productPrice: props.item.productPrice,
                        productName: props.item.productName,
                        quantity: 1
                    };
                    basket.push(newItem);
                    localStorage.setItem('basket', JSON.stringify(basket));
                }
            }
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const goToBasket = (event) => {
        event.preventDefault();
        navigate('/basket');
    }

    useEffect(() => {
            axios.get(`api/azure/list?path=${props.item.productSkuId}`, {})
                .then((response) => {
                    axios.get(`api/azure/read?path=${response.data[0]}`, {responseType: 'blob'})
                        .then(res => {
                            var blob = new Blob([res.data], {type: "image/*"});
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
            })
    }, [])

    useEffect(() => {
        if (props.item.inStock === 0) {
            setOpacity(0.5);
            setDisableBasket(true);
        } else {
            setOpacity(1);
        }
    }, [])

    const handleClickFavorites = (e) => {
        e.preventDefault();
        LocalStorageHelper.CommitRefresh();
        setOpenBackdrop(true);
        axios.get('api/users/csrf/token')
        .then((response) => {
            axios.post('api/favorites/create', {
                productUuid: props.item.productSkuId,
                userUuid: LocalStorageHelper.GetActiveUser(),
                productName: props.item.productName,
                productPrice: props.item.productPrice,
                quantity: 1
            }, {
                headers: {
                    'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                    'X-XSRF-TOKEN': response.data.token,
                    'Content-Type': 'application/json',
                }
            }).then(() => {
                setOpenBackdrop(false);
                toast.success("Product added to favorites.", {
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
            }).catch((e) => {
                setOpenBackdrop(false);
                toast.error(e.response.data.message, {
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
        }).catch(() => {
            setOpenBackdrop(false);
            toast.error("Cannot fetch token", {
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

    return (
        <Grid
            sx={{
                display: 'flex',
                flexDirection: 'column',
                opacity: opacity,
                width: '240px',
                height: 'fit-content',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                padding: '4px',
                color: 'black',
                fontSize: '12px',
                boxSizing: 'border-box',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s',
                "&:hover": {
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.4)',
                    cursor: 'pointer',
                },
            }}
            key={props.item.id}
        >
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            {LocalStorageHelper.IsUserLogged() === true &&
                <Tooltip title={"Add to favorites"}>
                    <Button
                        variant={"outlined"}
                        fullWidth={false}
                        onClick={handleClickFavorites}
                        sx={{
                            borderColor: 'rgb(158,26,96)',
                            backgroundColor: 'transparent',
                            width: '35px',
                            zIndex: 20,
                            minWidth: '0',
                            height: '35px',
                            display: 'flex',
                            position: 'relative',
                            alignSelf: 'end',
                            margin: '8px 8px 0 0',

                            "&:hover": {
                                backgroundColor: 'rgba(158,26,96,0.3)',
                                outline: 'none !important',
                                borderColor: 'rgb(158,26,96)'
                            },
                            "&:focus": {
                                backgroundColor: 'rgba(158,26,96,0.3)',
                                outline: 'none !important',
                                borderColor: 'rgb(158,26,96)'
                            }
                        }}
                    >
                        <FavoriteBorderOutlinedIcon size={"small"}
                                                    sx={{color: 'rgb(158,26,96)', fontSize: '16px'}}/>
                    </Button>
                </Tooltip>
            }
            <div style={{
                width: "100%",
                height: "150px",
                display: "flex",
                overflow: "hidden",
            }}>
                <div className="product-img"
                     onClick={() => {
                         navigate(`/product/${props.item.productSkuId}/${props.item.productName}`)
                     }}
                     style={{
                         width: '100%', maxHeight: '100%', aspectRatio: "16 / 9",
                         display: 'flex', justifyContent: 'center', alignItems: 'center',
                         flexShrink: '0', flexGrow: '0', backgroundSize: 'cover',
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
            </div>
                <div className="product-metrics-main"
                     style={{
                         width: '100%',
                         padding: '0 2%',
                         marginTop: '4px',
                         "&:hover": {cursor: 'pointer'}
                     }}
                     onClick={() => {
                         navigate(navigate(`/product/${props.item.productSkuId}/${props.item.productName}`))
                     }}
                >
                    <Tooltip title={props.item.productName}>
                        <p style={{
                            margin: '0',
                            width: '95%',
                            fontSize: '16px',
                            overflow: 'hidden',
                            textWrap: 'nowrap'
                        }}>{props.item.productName}</p>
                    </Tooltip>
                    <p style={{
                        margin: '0',
                        overflow: 'hidden',
                        textWrap: 'nowrap'
                    }}>Brand: {props.item.manufacturer.name}</p>
                    <p style={{margin: '0', overflow: 'hidden', textWrap: 'nowrap'}}>Made
                        in: {props.item.builtinCountry.name}</p>
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
                    }}>{props.item.productPrice.toFixed(2)}$</p>
                    <React.Fragment>
                        <Tooltip title={"Add to basket"}>
                            <Button
                                variant={"outlined"}
                                fullWidth={false}
                                disabled={disableBasket}
                                onClick={handleClickOpen}
                                sx={{
                                    borderColor: 'rgb(39, 99, 24)',
                                    backgroundColor: 'transparent',
                                    width: '35px',
                                    zIndex: 20,
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
                                <AddShoppingCartOutlinedIcon size={"small"}
                                                             sx={{color: 'rgb(39, 99, 24)', fontSize: '16px'}}/>
                            </Button>
                        </Tooltip>
                        <Dialog
                            open={open}
                            onClose={handleClose}
                        >
                            <DialogTitle>Product added to basket</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Do you want to continue shopping?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions
                                sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Button
                                    variant="outlined"
                                    onClick={handleClose}
                                    size="small"
                                    sx={{
                                        borderColor: 'rgb(11, 108, 128)',
                                        color: 'rgb(11, 108, 128)',
                                        fontSize: '12px',
                                        "&:hover": {
                                            outline: 'none !important',
                                            color: 'black',
                                            backgroundColor: 'rgba(16,147,177, 0.2)',
                                            borderColor: 'rgba(16,147,177, 0.2)',
                                        },
                                    }}
                                >
                                    Continue shopping
                                </Button>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={goToBasket}
                                    endIcon={<ArrowForwardIcon/>}
                                    sx={{
                                        fontSize: '12px',
                                        backgroundColor: 'rgb(39, 99, 24)',
                                        "&:hover": {backgroundColor: 'rgb(49,140,23)'}
                                    }}
                                >
                                    Basket
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </React.Fragment>
                </div>

        </Grid>
)
}

export default ProductItem;