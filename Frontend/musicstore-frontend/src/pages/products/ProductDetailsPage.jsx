import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import './style/ProductsDetailsPage.scss';
import {Gallery} from "./components/Gallery.jsx";
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
import ShareIcon from '@mui/icons-material/Share';
import axios from "axios";
import {Slide, toast, ToastContainer} from "react-toastify";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocalStorageHelper from "../../helpers/LocalStorageHelper.jsx";
import parse from "html-react-parser";


function ProductDetailsPage() {

    const [imageGallery, setImageGallery] = useState([]);
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productQuantity, setProductQuantity] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [manufacturerName, setManufacturerName] = useState('');
    const [subcategoryName, setSubcategoryName] = useState('');
    const [countryName, setCountryName] = useState('');
    const [showFoundPage, setShowFoundPage] = useState(false);
    const [showNotFoundPage, setShowNotFoundPage] = useState(false);
    const [open, setOpen] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false);

    const navigate = useNavigate();

    const [selectedQuantity, setSelectedQuantity] = useState(1);

    const productId = useParams();

    useEffect(() => {
        document.title = `Product - ${productId.productName}`;
    }, []);

    useEffect(() => {
        setOpenBackdrop(true);
        axios.get(`api/products/items/get/${productId.productSkuId}`)
        .then(res => {
            setProductName(res.data.productName);
            setProductDescription(res.data.productDescription);
            setProductPrice(res.data.productPrice);
            setProductQuantity(res.data.inStock);
            setCategoryName(res.data.category.name);
            setManufacturerName(res.data.manufacturer.name);
            setSubcategoryName(res.data.subcategory.name);
            setCountryName(res.data.builtinCountry.name);
            axios.get(`api/azure/list?path=${res.data.productSkuId}`)
            .then(res => {
                const promises = [];
                [...res.data].map((path) => {
                    promises.push(axios.get(`api/azure/read?path=${path}`, {responseType: 'blob'}))
                })
                Promise.all(promises.map(p => p.catch(e => e))).then(ordered_array => {
                    ordered_array.forEach( result => {
                        let blob = new Blob([result.data], {type: "image/*"});
                        setImageGallery(old => [...old, blob]);
                    } );
                });
            }).catch(() => {})
            setOpenBackdrop(false);
            setShowFoundPage(true);
            setShowNotFoundPage(false);
        }).catch(() => {
            setOpenBackdrop(false);
            setShowFoundPage(false);
            setShowNotFoundPage(true);
        });
    }, [productId.productSkuId]);

    const renderQuantityItems = () => {
        let items = []
        for (let i = 1; i < 10; i++) {
            if (i + 1 <= productQuantity) {
                items.push(<MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>)
            }
        }
        return items;
    }

    const handleClickOpen = () => {

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
                        if (item.productSkuId === productId.productSkuId) {
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
                                LocalStorageHelper.setBasketItems(selectedQuantity - currentQuantity);
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
                                productSkuId: productId.productSkuId,
                                productPrice: productPrice,
                                productName: productName,
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
        } else {
            let basket = JSON.parse(localStorage.getItem('basket'));
            if (!basket) {
                const newBasket = [
                    {
                        productSkuId: productId.productSkuId,
                        productPrice: productPrice,
                        productName: productName,
                        quantity: selectedQuantity
                    },
                ];
                localStorage.setItem('basket', JSON.stringify(newBasket));
                LocalStorageHelper.setBasketItems(selectedQuantity);
                window.dispatchEvent(new Event('basket'));
            } else {
                let itemToUpdate = null;
                [...basket].map((item) => {
                    if (item.productSkuId === productId.productSkuId) {
                        itemToUpdate = item;
                    }
                });
                if (itemToUpdate) {
                    let newItem = {
                        productSkuId: productId.productSkuId,
                        productPrice: productPrice,
                        productName: productName,
                        quantity: itemToUpdate.quantity + selectedQuantity
                    };
                    let index = basket.indexOf(itemToUpdate);
                    basket.splice(index, 1);
                    basket.push(newItem);
                    localStorage.setItem('basket', JSON.stringify(basket));
                    LocalStorageHelper.setBasketItems(selectedQuantity - itemToUpdate.quantity);
                    window.dispatchEvent(new Event('basket'));
                } else {
                    let newItem = {
                        productSkuId: productId.productSkuId,
                        productPrice: productPrice,
                        productName: productName,
                        quantity: selectedQuantity
                    };
                    basket.push(newItem);
                    localStorage.setItem('basket', JSON.stringify(basket));
                    LocalStorageHelper.setBasketItems(selectedQuantity);
                    window.dispatchEvent(new Event('basket'));
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

    const copyToClipboard = (event) => {
        event.preventDefault();
        navigator.clipboard.writeText(`${window.location.href}`).then(() => {
            toast.success('Copied url to clipboard!', {
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

    }

    let inStockBanner;

    if (productQuantity >= 10) {
        inStockBanner = <p style={{
            margin: '0',
            fontSize: '20px',
            fontWeight: 'bold',
            color: 'rgb(53,166,26)'
        }}>In Stock</p>
    } else if (productQuantity === 0) {
        inStockBanner = <p style={{
            margin: '0',
            fontSize: '20px',
            fontWeight: 'bold',
            color: 'rgb(184,16,16)'
        }}>Out of stock</p>
    } else {
        inStockBanner = <p style={{
            margin: '0',
            fontSize: '20px',
            fontWeight: 'bold',
            color: 'rgb(243,148,5)'
        }}>Last items</p>
    }

    return (
        <div className="productDetails">
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            {showNotFoundPage && (
                <>
                    <div className="not-found" style={{width:'fit-content',
                        marginTop: '16px',
                        fontSize: '30px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                    }}>
                        <b>Sorry, we didn&apos;t find <br/> what you&apos;re looking for...</b>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => {navigate('/')}}
                            sx={{
                                width: '60%',
                                height: '40px',
                                padding: '0',
                                margin: '8px auto 0 auto',
                                borderRadius: '1em',
                                fontSize: '10px',
                                backgroundColor: 'rgb(39, 99, 24)',
                                "&:hover": {backgroundColor: 'rgb(49,140,23)'}
                            }}
                        >
                            Go to home page
                        </Button>
                    </div>
                </>
            )
            }
            {showFoundPage && (
                <>
                <div className="productDetails-header">
                    <div
                        style={{
                            maxWidth: "1200px",
                            minWidth: "300px",
                            width: "45%",
                            aspectRatio: "10 / 6",

                        }}>
                        <Gallery imageBinaries={imageGallery}/>
                    </div>
                    <div className="productDetails-info">
                        <div
                            style={{
                                width: "100%",
                                minWidth: "300px",
                                height: "fit-content",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                justifyContent: "center",
                                borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <p style={{
                                margin: '0',
                                fontSize: '26px',
                                fontWeight: 'bold',
                                fontStyle: 'italic',
                                height: 'fit-content'
                            }}>{productName}</p>
                            <p style={{
                                margin: '0',
                                fontSize: '8px',
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                color: 'rgb(97,97,97)',
                                height: 'fit-content'
                                }}>Product id: {productId.productSkuId}</p>
                        </div>
                        <div style={{
                            width: '100%',
                            minWidth: '300px',
                            height: 'fit-content',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginTop: '1rem',
                        }}>
                            <div style={{
                                width: "48%",
                                height: "fit-content",
                                display: "flex",
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',

                            }}>
                                <div style={{
                                    width: "100%",
                                    height: "fit-content",
                                    display: "flex",
                                    flexDirection: 'column',
                                    justifyContent: 'flex-start',
                                    alignItems: 'flex-start',
                                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
                                }}>
                                    <p style={{margin: '0', fontSize: '14px'}}>Category: {categoryName}</p>
                                    <p style={{margin: '0', fontSize: '14px'}}>Subcategory: {subcategoryName}</p>
                                    <p style={{margin: '0', fontSize: '14px'}}>Manufacturer: {manufacturerName}</p>
                                    <p style={{margin: '0 0 8px 0', width: '100%', fontSize: '14px',}}>Produced
                                        in: {countryName}</p>
                                </div>
                            </div>
                            <div style={{
                                width: "50%",
                                height: "fit-content",
                                display: "flex",
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                border: '1px solid rgba(0, 0, 0, 0.1)',
                                borderRadius: '0.5em',
                            }}>
                                <div style={{
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    padding: '0 5% 0 0',
                                    justifyContent: 'flex-end',
                                    alignItems: 'flex-end',
                                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
                                }}>
                                    <p style={{margin: '0', fontSize: '24px', fontWeight: 'bold'}}>{parseFloat(productPrice).toFixed(2)}$</p>
                                    {
                                        inStockBanner
                                    }
                                </div>
                                <div style={{
                                    width: '100%',
                                    height: '80px',
                                    boxSizing: 'border-box',
                                    padding: '0 5% 0 5%',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}>
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
                                            disabled={parseInt(productQuantity) === 0}
                                            value={selectedQuantity}
                                            onChange={e => setSelectedQuantity(e.target.value)}
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
                                        <Button
                                            className="purchase-btn"
                                            fullWidth
                                            variant="contained"
                                            disabled={parseInt(productQuantity) === 0}
                                            onClick={handleClickOpen}
                                            sx={{
                                                width: '60%',
                                                height: '40px',
                                                padding: '0',
                                                borderRadius: '1em',
                                                fontSize: '10px',
                                                backgroundColor: 'rgb(39, 99, 24)',
                                                "&:hover": {backgroundColor: 'rgb(49,140,23)'}
                                            }}
                                        >
                                            Add to basket
                                        </Button>
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
                                <div style={{
                                    width: '100%',
                                    height: 'fit-content',
                                    boxSizing: 'border-box',
                                    padding: '0 5% 0 10%',
                                    marginBottom: '4px',
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center'
                                }}>
                                    <Button
                                        variant={"outlined"}
                                        fullWidth={false}
                                        onClick={copyToClipboard}
                                        sx={{
                                            borderColor: 'rgb(39, 99, 24)',
                                            backgroundColor: 'transparent',
                                            width: 'fit-content',
                                            minWidth: '0',
                                            color: 'rgb(39, 99, 24)',
                                            height: '35px',
                                            display: 'flex',
                                            borderRadius: '0.5em',
                                            "&:hover": {
                                                backgroundColor: 'rgba(49,140,23, 0.2)',
                                                outline: 'none !important',
                                                borderColor: 'rgb(39, 99, 24)',
                                            },
                                            "&:focus": {
                                                backgroundColor: 'rgba(49,140,23, 0.2)',
                                                outline: 'none !important',
                                                borderColor: 'rgb(39, 99, 24)',
                                            }
                                        }}
                                    >
                                        <p style={{margin: '0', fontSize: '16px'}}>Share</p>
                                        <ShareIcon size={"small"} sx={{color: 'rgb(39, 99, 24)', fontSize: '16px'}}/>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="product-description"  style={{
            width: '100%',
            height: 'fit-content',

            boxSizing: 'border-box',
        }}>
                    {parse(productDescription)}
        </div>
        </>
    )

}
            <ToastContainer />
</div>

)
}

export default ProductDetailsPage;