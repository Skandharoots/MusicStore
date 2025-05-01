import React, {useEffect, useState} from "react";
import axios from "axios";
import {Slide, toast} from "react-toastify";
import {
    Backdrop,
    Box,
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
    styled,
    Tooltip,
    Typography
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import LocalStorageHelper from "../../../../helpers/LocalStorageHelper.jsx";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteIcon from "@mui/icons-material/Delete";

const FavoriteItemContainer = styled(Box)(({theme}) => ({
    width: '100%',
    minWidth: '300px',
    height: 'fit-content',
    minHeight: '90px',
    boxSizing: 'border-box',
    padding: '2% 2%',
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    boxShadow: '0 5px 15px 0 ' + theme.palette.formShadow.main,
    borderRadius: '1em',
    marginBottom: '16px',
    '&:hover': {
        boxShadow: '0 5px 15px ' + theme.palette.itemShadow.light,
    },
}));

const ItemImage = styled(Box)(({theme}) => ({
    maxWidth: '40%',
    maxHeight: '85px',
    aspectRatio: '16 / 9',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundSize: 'cover',
    cursor: 'pointer',
}));

const Image = styled('img')(({theme}) => ({
    objectFit: 'cover',
    maxWidth: '100%',
    maxHeight: '100%',
    display: 'block',
    flexShrink: '0',
    flexGrow: '0',
}));

const QuantityContainer = styled(Box)(({theme}) => ({
    width: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    marginRight: '24px',
}));

const StyledFormControl = styled(FormControl)(({theme}) => ({
    margin: '8px',
    width: 'fit-content',
    height: 'fit-content',
    '& label.Mui-focused': {
        color: theme.palette.irish.main,
    },
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.irish.main,
        },
    },
}));

const StyledSelect = styled(Select)(({theme}) => ({
    height: '40px',
}));

const TextFields = styled(Box)(({theme}) => ({
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    maxWidth: '60%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    boxSizing: 'border-box',
    minWidth: '50%',
    cursor: 'pointer',
}));

const ProductName = styled(Typography)(({theme}) => ({
    margin: '0',
    fontSize: '16px',
    maxWidth: '100%',
    overflow: 'hidden',
    textWrap: 'wrap',
}));

const ProductInfo = styled(Typography)(({theme}) => ({
    margin: '0 8px 0 0',
    fontSize: '14px',
    maxWidth: '100%',
    overflow: 'hidden',
    textWrap: 'nowrap',
}));

const ActionButtons = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    height: '100%',
    width: 'fit-content',
    minWidth: '100px',
}));

const AddToCartButton = styled(Button)(({theme}) => ({
    borderColor: theme.palette.irish.main,
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
    color: theme.palette.irish.main,
    '&:hover': {
        outline: 'none !important',
        color: theme.palette.irish.light,
        borderColor: theme.palette.irish.light,
    },
    '&:focus': {
        outline: 'none !important',
        color: theme.palette.irish.light,
        borderColor: theme.palette.irish.light,
    },
}));

const DeleteButton = styled(Button)(({theme}) => ({
    borderColor: theme.palette.errorBtn.main,
    color: theme.palette.errorBtn.main,
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
    '&:hover': {
        color: theme.palette.errorBtn.light,
        outline: 'none !important',
        borderColor: theme.palette.errorBtn.light,
    },
    '&:focus': {
        color: theme.palette.errorBtn.light,
        outline: 'none !important',
        borderColor: theme.palette.errorBtn.light,
    },
}));

const ContinueButton = styled(Button)(({theme}) => ({
    borderColor: theme.palette.blueBtn.main,
    color: theme.palette.mybutton.colorTwo,
    backgroundColor: theme.palette.blueBtn.main,
    fontSize: '12px',
    '&:hover': {
        outline: 'none !important',
        color: theme.palette.mybutton.colorTwo,
        backgroundColor: theme.palette.blueBtn.light,
        borderColor: theme.palette.blueBtn.light,
    },
}));

const BasketButton = styled(Button)(({theme}) => ({
    fontSize: '12px',
    color: theme.palette.mybutton.colorTwo,
    backgroundColor: theme.palette.irish.main,
    color: theme.palette.mybutton.colorTwo,
    '&:hover': {
        backgroundColor: theme.palette.primary.light,
    },
}));

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
            });
        });
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
    };

    const handleDeleteOpen = () => {
        setOpenDelete(true);
    };

    const handleDeleteClose = () => {
        setOpenDelete(false);
    };

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
            });
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
        });
    };

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
                    });
                });
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
            });
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
    };

    const renderQuantityItems = () => {
        let items = [];
        for (let i = 1; i < 10; i++) {
            if (i + 1 <= inStock) {
                items.push(<MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>);
            }
        }
        return items;
    };

    return (
        <FavoriteItemContainer>
            <Backdrop
                sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
                open={openBackdrop}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            <ItemImage onClick={() => navigate(`/product/${props.item.productUuid}/${props.item.productName}`)}>
                <Image alt="No image" src={img} />
            </ItemImage>
            <QuantityContainer>
                <StyledFormControl size="small" autoFocus>
                    <StyledSelect
                        id="quantity-select"
                        value={selectedQuantity}
                        onChange={updateQuantity}
                        variant="outlined"
                    >
                        <MenuItem key={1} value={1}>1</MenuItem>
                        {renderQuantityItems()}
                    </StyledSelect>
                </StyledFormControl>
            </QuantityContainer>
            <TextFields onClick={() => navigate(`/product/${props.item.productUuid}/${props.item.productName}`)}>
                <Tooltip title={props.item.productName}>
                    <ProductName variant="body1">{props.item.productName}</ProductName>
                </Tooltip>
                <ProductInfo variant="body2">Price: {props.item.price}$</ProductInfo>
                <ProductInfo variant="body2">Quantity: {props.item.quantity}</ProductInfo>
            </TextFields>
            <ActionButtons>
                <Tooltip title="Add to basket">
                    <AddToCartButton
                        variant="outlined"
                        fullWidth={false}
                        onClick={handleClickOpen}
                    >
                        <AddShoppingCartOutlinedIcon sx={{fontSize: '16px'}}/>
                    </AddToCartButton>
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
                    <DialogActions sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <ContinueButton
                            variant="outlined"
                            onClick={handleClose}
                            size="small"
                        >
                            Continue shopping
                        </ContinueButton>
                        <BasketButton
                            variant="contained"
                            size="small"
                            onClick={goToBasket}
                            endIcon={<ArrowForwardIcon/>}
                        >
                            Basket
                        </BasketButton>
                    </DialogActions>
                </Dialog>
                <Tooltip title="Delete favorite">
                    <DeleteButton
                        variant="outlined"
                        size="small"
                        type="button"
                        onClick={handleDeleteOpen}
                        fullWidth
                    >
                        <DeleteIcon fontSize="small"/>
                    </DeleteButton>
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
                                backgroundColor: theme => theme.palette.info.main,
                                color: theme => theme.palette.mybutton.colorTwo,
                                '&:hover': {backgroundColor: theme => theme.palette.info.light},
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={deleteFavorite}
                            sx={{
                                backgroundColor: theme => theme.palette.errorBtn.main,
                                color: theme => theme.palette.mybutton.colorTwo,
                                '&:hover': {backgroundColor: theme => theme.palette.errorBtn.light},
                            }}
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </ActionButtons>
        </FavoriteItemContainer>
    );
}

export default FavouriteItem;