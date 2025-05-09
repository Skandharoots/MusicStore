import React, {useEffect, useState} from "react";
import LocalStorageHelper from "../../helpers/LocalStorageHelper.jsx";
import axios from "axios";
import BasketItem from "./components/BasketItem.jsx";
import {
    Backdrop,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Box,
    Typography,
    styled
} from "@mui/material";
import {CreditCard, DeleteOutlineOutlined, ShoppingBasket} from "@mui/icons-material";
import {Slide, toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

const BasketContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    margin: '0 0',
    padding: '0',
    minHeight: '80dvh',
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%'
}));

const BasketMain = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    maxWidth: '1500px',
    marginTop: '4%',
    boxSizing: 'border-box',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexWrap: 'wrap'
}));

const BasketEmpty = styled(Box)(({ theme }) => ({
    width: '500px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    height: 'fit-content'
}));

const BasketLeftSide = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    boxSizing: 'border-box',
    width: '45%',
    minWidth: '300px',
    height: 'fit-content'
}));

const BasketRightSide = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '45%',
    minWidth: '500px',
    boxSizing: 'border-box',
    borderRadius: '1em',
    padding: '0'
}));

const BasketHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1em'
}));

const TotalCostContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    width: '55%',
    minWidth: '170px',
    boxShadow: '0 5px 15px ' + theme.palette.itemShadow.main,
    borderRadius: '1em',
    boxSizing: 'border-box',
    padding: '4%'
}));

const TotalCostHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 'fit-content',
    marginBottom: '1em'
}));

const PurchaseButtonContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderBottom: '1px solid ' + theme.palette.divider
}));

const StyledButton = styled(Button)(({ theme }) => ({
    width: '100%',
    backgroundColor: theme.palette.irish.main,
    color: theme.palette.mybutton.colorTwo,
    "&:hover": {
        backgroundColor: theme.palette.irish.light
    }
}));

const ClearButton = styled(Button)(({ theme }) => ({
    borderColor: theme.palette.errorBtn.main,
    color: theme.palette.errorBtn.main,
    "&:hover": {
        outline: 'none !important',
        borderColor: theme.palette.errorBtn.light,
        color: theme.palette.errorBtn.light,
        backgroundColor: theme.palette.background.paper
    },
    "&:focus": {
        outline: 'none !important'
    }
}));

function Basket() {
    const [basketItems, setBasketItems] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [totalUpdated, setTotalUpdated] = useState(false);
    const [open, setOpen] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [showBasketItems, setShowBasketItems] = useState(false);
    const [showBasketEmpty, setShowBasketEmpty] = useState(false);

    const navigate = useNavigate();

    const updateTotal = () => {
        setTotalUpdated(totalUpdated ? false : true);
    }

    useEffect(() => {
        setOpenBackdrop(true);
        LocalStorageHelper.CommitRefresh();
        if (LocalStorageHelper.IsUserLogged() === true) {
            axios.get(`api/cart/get/${LocalStorageHelper.GetActiveUser()}`, {
                headers: {
                    'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                }
            }).then(res => {
                setBasketItems(res.data);
                let total = 0;
                let items = 0;
                [...res.data].map((item) => {
                    items += item.quantity;
                    total += item.quantity * item.productPrice;
                })
                setTotalItems(items);
                setTotalCost(total);
                items < 1 ? setShowBasketEmpty(true) : setShowBasketItems(true);
                setOpenBackdrop(false);
            }).catch(() => {
                setOpenBackdrop(false);
                toast.error('Failed to load basket items', {
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
        } else {
            let basket = JSON.parse(localStorage.getItem("basket"));
            let total = 0;
            let items = 0;
            if (basket) {
                setBasketItems(basket);
                [...basket].map((item) => {
                    items += item.quantity;
                    total += item.quantity * item.productPrice;
                });
            }
            setTotalItems(items);
            setTotalCost(total);
            items < 1 ? setShowBasketEmpty(true) : setShowBasketItems(true);
            setOpenBackdrop(false);
        }
    }, [LocalStorageHelper.getBasketItems(), totalUpdated]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const removeById = (idToDelete) => {
        setBasketItems(currentItems => currentItems.filter(
            ({id}) => id !== idToDelete)
        );
        if (basketItems.length === 1) {
            setShowBasketEmpty(true);
            setShowBasketItems(false);
        }
    };

    const clearCart = (event) => {
        event.preventDefault();
        setOpenBackdrop(true);
        if (LocalStorageHelper.IsUserLogged()) {
            LocalStorageHelper.setClearBasketItems();
            window.dispatchEvent(new Event('basket'));
            LocalStorageHelper.CommitRefresh();
            axios.get('api/users/csrf/token', {})
                .then(res => {
                    axios.delete(`api/cart/clear/${LocalStorageHelper.GetActiveUser()}`, {
                        headers: {
                            'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                            'X-XSRF-TOKEN': res.data.token,
                        }
                    }).then(() => {
                        setOpenBackdrop(false);
                        setShowBasketEmpty(true);
                        setShowBasketItems(false);
                        toast.info("Basket cleared successfully.", {
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
                        setBasketItems([]);
                        setOpen(false);
                    }).catch(() => {
                        setOpen(false);
                        setOpenBackdrop(false);
                        toast.error("Basket could not be cleared. Try again later", {
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
                setOpen(false);
            });
        } else {
            LocalStorageHelper.clearBasketItems(0);
            window.dispatchEvent(new Event('basket'));
            localStorage.removeItem("basket");
            setBasketItems([]);
            setShowBasketEmpty(true);
            setShowBasketItems(false);
            toast.info("Basket cleared successfully.", {
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
        }
    }

    return (
        <BasketContainer>
            <Backdrop
                sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
                open={openBackdrop}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            {showBasketEmpty && (
                <BasketEmpty>
                    <Box sx={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <ShoppingBasket fontSize="large" />
                    </Box>
                    <Typography variant="h2" sx={{textAlign: 'center'}}>
                        You don&apos;t have any <br/>items in the basket
                    </Typography>
                    <StyledButton
                        variant="contained"
                        fullWidth
                        onClick={() => {navigate('/')}}
                    >
                        Home page
                    </StyledButton>
                </BasketEmpty>
            )}
            {showBasketItems && (
                <BasketMain>
                    <BasketLeftSide>
                        <BasketHeader>
                            <Typography variant="h4" sx={{margin: '0', fontSize: '28px', fontWeight: 'bold'}}>
                                Your basket <Typography component="span" sx={{margin: '0', fontSize: '18px', fontWeight: 'normal'}}>
                                    ({totalItems} items)
                                </Typography>
                            </Typography>
                            <ClearButton
                                variant="outlined"
                                endIcon={<DeleteOutlineOutlined />}
                                onClick={handleClickOpen}
                            >
                                Clear basket
                            </ClearButton>
                            <Dialog
                                open={open}
                                onClose={handleClose}
                            >
                                <DialogTitle>Delete items from basket</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        Do you want to delete all items from basket?
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
                                        onClick={clearCart}
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
                        </BasketHeader>
                        {[...basketItems].map((item, index) => (
                            <BasketItem key={index} id={item.id} item={item} onDelete={removeById} onUpdate={updateTotal} {...item} />
                        ))}
                    </BasketLeftSide>
                    <BasketRightSide>
                        <TotalCostContainer>
                            <TotalCostHeader>
                                <Typography sx={{margin: '0', fontSize: '16px'}}>Total cost</Typography>
                                <Typography sx={{margin: '0', fontSize: '24px', fontWeight: 'bold'}}>
                                    {totalCost.toFixed(2)}$
                                </Typography>
                            </TotalCostHeader>
                            <PurchaseButtonContainer>
                                {LocalStorageHelper.IsUserLogged() === true && (
                                    <StyledButton
                                        variant="contained"
                                        fullWidth
                                        endIcon={<CreditCard />}
                                        onClick={() => {navigate('/order/place')}}
                                    >
                                        Purchase
                                    </StyledButton>
                                )}
                                {LocalStorageHelper.IsUserLogged() === false && (
                                    <StyledButton
                                        variant="contained"
                                        fullWidth
                                        onClick={() => {navigate('/login')}}
                                    >
                                        Log in to purchase
                                    </StyledButton>
                                )}
                            </PurchaseButtonContainer>
                        </TotalCostContainer>
                    </BasketRightSide>
                </BasketMain>
            )}
        </BasketContainer>
    );
}

export default Basket;