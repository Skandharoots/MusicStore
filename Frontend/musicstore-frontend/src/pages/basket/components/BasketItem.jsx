import React, {useEffect, useState} from "react";
import axios from "axios";
import {Slide, toast} from "react-toastify";
import Tooltip from "@mui/material/Tooltip";
import {
    Backdrop,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    MenuItem,
    Select,
    Box,
    Typography,
    styled
} from "@mui/material";
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";
import { DeleteOutlineOutlined } from "@mui/icons-material";
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from "react-router-dom";

const BasketItemContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    minWidth: '100px',
    height: 'fit-content',
    minHeight: '90px',
    boxSizing: 'border-box',
    padding: '2% 2%',
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: '1em',
    marginBottom: '16px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 5px 15px ' + theme.palette.itemShadow.main,
    '&:hover': {
        boxShadow: '0 5px 15px ' + theme.palette.itemShadow.light
    }
}));

const ProductImage = styled(Box)(({ theme }) => ({
    maxWidth: '40%',
    height: '85px',
    aspectRatio: '16 / 9',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: "hidden",
    backgroundColor: 'white',
    borderRadius: '1em',
    marginRight: '16px',
}));

const ProductImg = styled('img')(({ theme }) => ({
    objectFit: 'cover',
    maxWidth: '100%',
    maxHeight: '100%',
    display: 'block',
    flexShrink: '0',
    flexGrow: '0'
}));

const ProductName = styled(Box)(({ theme }) => ({
    width: '40%',
    height: '96%',
    overflow: 'hidden',
    margin: '0',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    cursor: 'pointer',
    '& p': {
        margin: '0',
        fontSize: '18px'
    }
}));

const ProductQuantity = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0',
    width: 'fit-content',
    height: 'fit-content',
    '& p': {
        margin: '0 8px 0 0',
        fontSize: '14px'
    }
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
    m: 1,
    margin: '0 0',
    width: 'fit-content',
    height: 'fit-content',
    "& label.Mui-focused": {
        color: theme.palette.irish.main
    },
    "& .MuiOutlinedInput-root": {
        "&.Mui-focused fieldset": {
            borderColor: theme.palette.irish.main
        }
    }
}));

const StyledSelect = styled(Select)(({ theme }) => ({
    height: '40px'
}));

const DeleteButton = styled(Button)(({ theme }) => ({
    width: '30px',
    height: '30px',
    margin: '0 0 0 8px',
    minWidth: '0',
    fontSize: '8px',
    color: theme.palette.errorBtn.main,
    borderColor: theme.palette.errorBtn.main,
    "&:hover": {
        color: theme.palette.errorBtn.light,
        borderColor: theme.palette.errorBtn.light,
    },
    "&:focus": {
        outline: 'none !important'
    }
}));

function BasketItem(props) {
    const [img, setImg] = useState(null);
    const [maxQuantity, setMaxQuantity] = useState(0);
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [open, setOpen] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        LocalStorageHelper.CommitRefresh();
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
    }, [props.item]);

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
            LocalStorageHelper.setBasketItems(-selectedQuantity);
            window.dispatchEvent(new Event('basket'));
            LocalStorageHelper.CommitRefresh();
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
            LocalStorageHelper.setBasketItems(-selectedQuantity);
            window.dispatchEvent(new Event('basket'));
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
        LocalStorageHelper.setBasketItems(parseFloat(parseFloat(event.target.value) - parseFloat(selectedQuantity)));
        window.dispatchEvent(new Event('basket'));
        setSelectedQuantity(event.target.value);
        LocalStorageHelper.CommitRefresh();
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
        <BasketItemContainer>
            <Backdrop
                sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
                open={openBackdrop}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            <ProductImage>
                    <ProductImg alt={'No image'} src={img} />
            </ProductImage>
            <Tooltip title={`${props.item.productName}`}>
                <ProductName onClick={() => {navigate(`/product/${props.item.productSkuId}/${props.item.productName}`)}}>
                    <Typography>{props.item.productName}</Typography>
                </ProductName>
            </Tooltip>
            <ProductQuantity>
                <Typography>${props.item.productPrice.toFixed(2)}</Typography>
                <StyledFormControl size="small" autoFocus>
                    <StyledSelect
                        id="quantity-select"
                        disabled={maxQuantity === 0}
                        value={selectedQuantity}
                        onChange={handleQuantityChange}
                        variant="outlined"
                    >
                        <MenuItem key={1} value={1}>1</MenuItem>
                        {renderQuantityItems()}
                    </StyledSelect>
                </StyledFormControl>
                <Tooltip title={'Delete item'}>
                    <DeleteButton
                        variant="text"
                        onClick={handleClickOpen}
                    >
                        <DeleteOutlineOutlined size="small" />
                    </DeleteButton>
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
                                color: 'white',
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
                                color: 'white',
                                backgroundColor: 'rgb(159,20,20)',
                                "&:hover": {backgroundColor: 'rgb(193,56,56)'},
                            }}
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </ProductQuantity>
        </BasketItemContainer>
    );
}

export default BasketItem;