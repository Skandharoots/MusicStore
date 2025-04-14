import './style/Basket.scss';
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
    DialogTitle
} from "@mui/material";
import {CreditCard, DeleteOutlineOutlined, ShoppingBasket} from "@mui/icons-material";
import {Slide, toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

function Basket() {

    const [basketItems, setBasketItems] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [open, setOpen] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [showBasketItems, setShowBasketItems] = useState(false);
    const [showBasketEmpty, setShowBasketEmpty] = useState(false);

    const navigate = useNavigate();

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
    }, [LocalStorageHelper.getBasketItems()]);

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
        <div className="basket-container">
            <Backdrop
                sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
                open={openBackdrop}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            {showBasketEmpty && (
                <>
                    <div className="basket-empty">
                        <div style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <ShoppingBasket fontSize={"large"} />
                        </div>
                        <h2>You don&apos;t have any <br/>items in the basket</h2>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => {navigate('/')}}
                            sx={{
                                width: '100%',
                                backgroundColor: 'rgb(39, 99, 24)',
                                "&:hover": {backgroundColor: 'rgb(49,140,23)'}
                            }}
                        >
                            Home page
                        </Button>
                    </div>
                </>
            )
            }
            {showBasketItems && (
                <>
                    <div className="basket-container">
                        <div className="basket-main">
                            <div className="basket-left-side">
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        width: '100%',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '1em',
                                    }}
                                >
                                    <p style={{margin: '0', fontSize: '28px', fontWeight: 'bold'}}>Your basket <span style={{margin: '0', fontSize: '18px', fontWeight: 'normal'}}>({totalItems} items)</span></p>
                                    <React.Fragment>
                                        <Button
                                            variant="outlined"
                                            endIcon={<DeleteOutlineOutlined />}
                                            onClick={handleClickOpen}
                                            sx={{
                                                borderColor: 'black',
                                                color: 'black',
                                                "&:hover": {
                                                    outline: 'none !important',
                                                    borderColor: 'rgb(193,56,56)',
                                                    color: 'rgb(193,56,56)',
                                                    backgroundColor: 'white',
                                                },
                                                "&:focus": {
                                                    outline: 'none !important',
                                                }
                                            }}
                                        >
                                            Clear basket
                                        </Button>
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
                                {
                                    [...basketItems].map((item, index) => (
                                        <BasketItem key={index} id={item.id} item={item} onDelete={removeById} {...item} />
                                    ))
                                }
                            </div>
                            <div className="basket-right-side">
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'flex-start',
                                        alignItems: 'flex-start',
                                        flexWrap: 'wrap',
                                        width: '55%',
                                        minWidth: '170px',
                                        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                                        borderRadius: '1em',
                                        boxSizing: 'border-box',
                                        padding: '4%',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                            height: 'fit-content',
                                            marginBottom: '1em',
                                        }}
                                    >
                                        <p style={{margin: '0', fontSize: '16px'}}>Total cost</p>
                                        <p style={{margin: '0', fontSize: '24px', fontWeight: 'bold'}}>{totalCost.toFixed(2)}$</p>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '100%',
                                            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                                        }}
                                    >
                                        {LocalStorageHelper.IsUserLogged() === true &&
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                endIcon={<CreditCard />}
                                                onClick={() => {navigate('/order/place')}}
                                                sx={{
                                                    backgroundColor: 'rgb(39, 99, 24)',
                                                    "&:hover": {backgroundColor: 'rgb(49,140,23)'}
                                                }}
                                            >
                                                Purchase
                                            </Button>
                                        }
                                        {LocalStorageHelper.IsUserLogged() === false &&
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                onClick={() => {navigate('/login')}}
                                                sx={{
                                                    backgroundColor: 'rgb(39, 99, 24)',
                                                    "&:hover": {backgroundColor: 'rgb(49,140,23)'}
                                                }}
                                            >
                                                Log in to purchase
                                            </Button>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </>
            )
            }
        </div>
    )

}

export default Basket