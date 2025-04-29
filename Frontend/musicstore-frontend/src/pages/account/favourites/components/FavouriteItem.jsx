import React, {useEffect, useState} from "react";
import axios from "axios";
import {Slide, toast} from "react-toastify";
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
import '../../style/FavoriteItem.scss';
import {useNavigate} from "react-router-dom";
import LocalStorageHelper from "../../../../helpers/LocalStorageHelper.jsx";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteIcon from "@mui/icons-material/Delete";


function FavouriteItem(props) {

    const [img, setImg] = useState(null);
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [inStock, setInStock] = useState(10);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`api/products/items/get/${props.item.productUuid}`, {})
        .then((response) => {
            setInStock(response.data.inStock);
        }).catch((e) => {
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
                })
            })

    }, [props.item]);

    const handleClickOpen = (event) => {
        event.preventDefault();
        setOpen(true);
        LocalStorageHelper.CommitRefresh();
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
                        if (item.productSkuId === props.item.productUuid) {
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
                                quantity: currentQuantity + selectedQuantity,
                            },{
                                headers: {
                                    'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                                    'X-XSRF-TOKEN': response.data.token,
                                    'Content-Type': 'application/json',
                                }
                            }).then(() => {
                                setOpen(true);
                                LocalStorageHelper.setBasketItems(selectedQuantity);
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
                                productSkuId: props.item.productUuid,
                                productPrice: props.item.price,
                                productName: props.item.productName,
                                quantity: selectedQuantity,
                            }, {
                                headers: {
                                    'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                                    'X-XSRF-TOKEN': response.data.token,
                                    'Content-Type': 'application/json',
                                }
                            }).then(() => {
                                setOpen(true);
                                LocalStorageHelper.setBasketItems(selectedQuantity);
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
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const goToBasket = (event) => {
        event.preventDefault();
        navigate('/basket');
    }

    const handleDeleteOpen = () => {
        setOpenDelete(true);
    }

    const handleDeleteClose = () => {
        setOpenDelete(false);
    }

    const deleteFavorite = (e) => {
        e.preventDefault();
        LocalStorageHelper.CommitRefresh();
        setOpenBackdrop(true);
        axios.get('api/users/csrf/token')
        .then((response) => {
            axios.delete(`api/favorites/delete/${props.item.id}`, {
                headers: {
                    'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                    'X-XSRF-TOKEN': response.data.token,
                }
            }).then(() => {
                props.onDelete(props.item.id);
                handleDeleteClose();
                setOpenBackdrop(false);
                toast.success("Product deleted!", {
                    position: "bottom-center",
                    autoClose: 5000,
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
                    autoClose: 5000,
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

    useEffect(() => {

        axios.get(`api/azure/list?path=${props.item.productUuid}`, {})
            .then((response) => {
                axios.get(`api/azure/read?path=${response.data[0]}`, {responseType: 'blob'})
                    .then(res => {
                        let blob = new Blob([res.data], { type: "image/*" });
                        setImg(URL.createObjectURL(blob));
                        setSelectedQuantity(props.item.quantity);
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

    }, [props.item]);

    const updateQuantity = (e) => {
        e.preventDefault();
        axios.get('api/users/csrf/token')
        .then(res => {
            axios.put(`api/favorites/update`, {
                id: props.item.id,
                quantity: e.target.value,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                    'X-XSRF-TOKEN': res.data.token,
                }
            }).then(() => {
                setSelectedQuantity(e.target.value);
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
            })
        })
    }

    const renderQuantityItems = () => {
        let items = []
        for (let i = 1; i < 10; i++) {
            if (i + 1 <= inStock) {
                items.push(<MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>)
            }
        }
        return items;
    }

    return (
        <div className="favorite-item"
             style={{
            width: "100%",
            boxSizing: "border-box",
            minWidth: '100px',
             display: 'flex',
             flexDirection: 'row',
             justifyContent: 'space-around',
            "&:hover": {
                cursor: 'pointer',
            }
        }}>
            <Backdrop
                sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
                open={openBackdrop}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            <div className="fav-img"
                 style={{
                     maxWidth: '40%', maxHeight: '85px', aspectRatio: "16 / 9",
                     display: 'flex', justifyContent: 'center', alignItems: 'center',
                     backgroundSize: 'cover',
                 }}
            >
                <img alt={'No image'}
                     src={img}
                     onClick={() => {navigate(`/product/${props.item.productUuid}/${props.item.productName}`)}}
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
            <div
                style={{
                    width: 'fit-content',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    marginRight: '24px',
                }}
            >
                <FormControl
                    size="small"
                    autoFocus
                    sx={{
                        m: 1,
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
                        value={selectedQuantity}
                        onChange={updateQuantity}
                        variant={"outlined"}
                        sx={{
                            height: '40px',
                        }}
                    >
                        <MenuItem key={1} value={1}>1</MenuItem>
                        {renderQuantityItems()}
                    </Select>
                </FormControl>
            </div>
            <div className={"text-fields"}
                 onClick={() => {navigate(`/product/${props.item.productUuid}/${props.item.productName}`)}}
                 style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    flexDirection: 'column',
                    maxWidth: '60%',
                    height: '100%',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    boxSizing: 'border-box',
                    minWidth: '50%',

            }}>
                <Tooltip title={`${props.item.productName}`}>
                    <p style={{margin: '0', fontSize: '16px', maxWidth: '100%' , overflow: 'hidden', textWrap: 'wrap',
                    }}>{props.item.productName}</p>
                </Tooltip>
                <p style={{margin: '0 8px 0 0', fontSize: '14px', maxWidth: '100%' , overflow: 'hidden', textWrap: 'nowrap'}}>Price: {props.item.price}$</p>
                <p style={{margin: '0 8px 0 0', fontSize: '14px', maxWidth: '100%' , overflow: 'hidden', textWrap: 'nowrap'}}>Quantity: {props.item.quantity}</p>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                height: '100%',
                width: 'fit-content',
                minWidth: '100px',
            }}>
                <React.Fragment>
                    <Tooltip title={"Add to basket"}>
                        <Button
                            variant={"outlined"}
                            fullWidth={false}
                            onClick={handleClickOpen}
                            sx={{
                                borderColor: 'rgb(39, 99, 24)',
                                backgroundColor: 'transparent',
                                width: '40px',
                                marginRight: '10px',
                                zIndex: 20,
                                position: 'relative',
                                margin: 'auto 0',
                                right: '10px',
                                top: '0',
                                bottom: '0',
                                minWidth: '0',
                                height: '40px',
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
                <React.Fragment>
                    <Tooltip title={"Delete favorite"}>
                        <Button
                            variant="outlined"
                            size="small"
                            type="button"
                            onClick={handleDeleteOpen}
                            fullWidth
                            sx={{
                                borderColor: 'rgb(159,20,20)',
                                color: 'rgb(159,20,20)',
                                backgroundColor: 'transparent',
                                width: '40px',
                                zIndex: 20,
                                position: 'relative',
                                margin: 'auto 0',
                                right: '10px',
                                top: '0',
                                bottom: '0',
                                outline: 'none !important',
                                minWidth: '0',
                                height: '40px',
                                display: 'flex',
                                "&:hover": {
                                    backgroundColor: 'rgba(159,20,20,0.2)',
                                    outline: 'none !important',
                                    borderColor: 'rgb(159,20,20)'
                                },
                                "&:focus": {
                                    backgroundColor: 'rgba(159,20,20,0.2)',
                                    outline: 'none !important',
                                    borderColor: 'rgb(159,20,20)'
                                }
                            }}
                        >
                            <DeleteIcon fontSize="small"/>
                        </Button>
                    </Tooltip>
                    <Dialog
                        open={openDelete}
                        onClose={handleDeleteClose}
                    >
                        <DialogTitle>Delete product</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Do you want to delete {props.item.productName} favorite?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                variant="contained"
                                onClick={handleDeleteClose}
                                sx={{
                                    backgroundColor: 'rgb(11,108,128)',
                                    "&:hover": {backgroundColor: 'rgb(16,147,177)'},
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={deleteFavorite}
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

export default FavouriteItem;