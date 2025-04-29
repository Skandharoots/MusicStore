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
    Select,
    Rating,
    TextField,
    Stack,
    Pagination
} from "@mui/material";
import ShareIcon from '@mui/icons-material/Share';
import axios from "axios";
import {Slide, toast} from "react-toastify";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocalStorageHelper from "../../helpers/LocalStorageHelper.jsx";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Box from '@mui/material/Box';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { styled } from '@mui/material/styles';
import LoginIcon from '@mui/icons-material/Login';
import Opinion from './components/Opinion.jsx';
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import Tooltip from "@mui/material/Tooltip";

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
    const [opinions, setOpinions] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [rating, setRating] = useState(0);
    const [userRating, setUserRating] = useState(1);
    const [productOpinion, setProductOpinion] = useState('');
    const [productOpinionError, setProductOpinionError] = useState(false);
    const [productOpinionErrorMsg, setProductOpinionErrorMsg] = useState('');
    const [showFoundPage, setShowFoundPage] = useState(false);
    const [showNotFoundPage, setShowNotFoundPage] = useState(false);
    const [open, setOpen] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [reload, setReload] = useState(false);
    const [disableOpinionSubmit, setDisableOpinionSubmit] = useState(false);

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

    useEffect(() => {
        axios.get(`api/opinions/get/${productId.productSkuId}`, {
            params: {
                page: currentPage - 1,
                pageSize: perPage
            }
        })
        .then(res => {
            setOpinions(res.data.content);
            if (res.data.totalPages < 1) {
                setTotalPages(1);
            } else {
                setTotalPages(res.data.totalPages);
            }
            let rating = 0;
            [...res.data.content].forEach(opinion => {
                if (opinion.rating === 'ONE') {
                    rating += 1;
                } else if (opinion.rating === 'TWO') {
                    rating += 2;
                } else if (opinion.rating === 'THREE') {
                    rating += 3;
                } else if (opinion.rating === 'FOUR') {
                    rating += 4;
                } else if (opinion.rating === 'FIVE') {
                    rating += 5;
                }
                if (opinion.userId === LocalStorageHelper.GetActiveUser()) {
                    setDisableOpinionSubmit(true);
                }
            });
            let ratingResult = 0;
            rating != 0 ? ratingResult = rating / res.data.content.length : ratingResult = 0;
            setRating(parseFloat(ratingResult).toFixed(1));
        }).catch(() => {
            toast.error('Error getting opinions', {
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
    }, [productId.productSkuId, reload, currentPage]);

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

    const handleProductOpinion = () => {
        
        let isValid = true;

        if (productOpinion.length < 10 || productOpinion.length > 500) {
            setProductOpinionError(true);
            setProductOpinionErrorMsg('Opinion must be at least 10 and at max 500 characters long');
            isValid = false;
        } else if (!/^[ -~]*$/gm.test(productOpinion)) {
            setProductOpinionError(true);
            setProductOpinionErrorMsg('Opinion can only contain printable characters');
            isValid = false;
        } else {
            setProductOpinionError(false);
            setProductOpinionErrorMsg('');
        }

        return isValid;
    }

    const StyledRating = styled(Rating)({
        '& .MuiRating-iconFilled': {
          color: '#ff6d75',
        },
        '& .MuiRating-iconHover': {
          color: '#ff3d47',
        },
      });

    const generateRating = () => {
        let rating = "";
        if (userRating === 1) {
            rating = "ONE";
        } else if (userRating === 2) {
            rating = "TWO";
        } else if (userRating === 3) {
            rating = "THREE";
        } else if (userRating === 4) {
            rating = "FOUR";
        } else if (userRating === 5) {
            rating = "FIVE";
        }
        return rating;
    }

    const submitOpinion = () => {
        if (handleProductOpinion() === false) {
            return;
        }
        setOpenBackdrop(true);
        LocalStorageHelper.CommitRefresh();
        axios.get('api/users/csrf/token')
            .then((response) => {
                console.log("Step 3");
                axios.post(`api/opinions/create`, {
                    productUuid: productId.productSkuId,
                    productName: productName,
                    userId: LocalStorageHelper.GetActiveUser(),
                    username: LocalStorageHelper.getUserName(),
                    rating: generateRating(),
                    comment: productOpinion
                }, {
                    headers: {
                        'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                        'X-XSRF-TOKEN': response.data.token,
                        'Content-Type': 'application/json',
                    }
                }).then(() => {
                    reload ? setReload(false) : setReload(true);
                    setProductOpinion('');
                    setProductOpinionError(false);
                    setProductOpinionErrorMsg('');
                    setUserRating(1);
                    setOpenBackdrop(false);
                    toast.success('Opinion added successfully', {
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

    let inStockBanner;

    if (productQuantity >= 10) {
        inStockBanner = <p style={{
            margin: '0 0 0 4px',
            fontSize: '20px',
            fontWeight: 'bold',
            color: 'rgb(53,166,26)'
        }}>In Stock</p>
    } else if (productQuantity === 0) {
        inStockBanner = <p style={{
            margin: '0 0 0 4px',
            fontSize: '20px',
            fontWeight: 'bold',
            color: 'rgb(184,16,16)'
        }}>Out of stock</p>
    } else {
        inStockBanner = <p style={{
            margin: '0 0 0 4px',
            fontSize: '20px',
            fontWeight: 'bold',
            color: 'rgb(243,148,5)'
        }}>Last items</p>
    }

    const changePage = (event, value) => {
        setCurrentPage(value);
    }

    const handleClickFavorites = (e) => {
        e.preventDefault();
        LocalStorageHelper.CommitRefresh();
        setOpenBackdrop(true);
        axios.get('api/users/csrf/token')
            .then((response) => {
                axios.post('api/favorites/create', {
                    productUuid: productId.productSkuId,
                    userUuid: LocalStorageHelper.GetActiveUser(),
                    productName: productName,
                    productPrice: productPrice,
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
                            minWidth: "200px",
                            width: "45%",
                            aspectRatio: "10 / 6",

                        }}>
                        <Gallery imageBinaries={imageGallery}/>
                    </div>
                    <div className="productDetails-info">
                        <div
                            style={{
                                width: "100%",
                                minWidth: "200px",
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
                            minWidth: '200px',
                            height: 'fit-content',
                            flexWrap: 'wrap',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            alignItems: 'flex-start',
                            marginTop: '1rem',
                        }}>
                            <div style={{
                                width: "48%",
                                minWidth: '150px',
                                height: "fit-content",
                                display: "flex",
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',

                            }}>
                                <div style={{
                                    width: '100%',
                                    height: 'fit-content',
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    alignItems: 'flex-end',
                                    flexDirection: 'column',
                                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                                    marginBottom: '4px',
                                    paddingBottom: '4px',
                                }}>
                                    <div style={{
                                        width: '100%',
                                        height: 'fit-content',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-end',
                                    }}>
                                        <p style={{margin: '0', fontSize: '16px'}}></p>
                                        <p style={{margin: '0', fontSize: '16px'}}>{parseFloat(rating).toFixed(1)}/{parseFloat(5).toFixed(1)}</p>
                                    </div>
                                    <Box sx={{ '& > legend': { mt: 2 } }}>
                                        <StyledRating
                                            name="customized-color"
                                            value={parseInt(rating)}
                                            getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
                                            precision={0.5}
                                            icon={<FavoriteIcon fontSize="inherit" />}
                                            readOnly
                                            emptyIcon={<FavoriteBorderIcon fontSize="inherit"/>}
                                        />
                                    </Box>
                                </div>
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
                                minWidth: '200px',
                            }}>
                                <div style={{
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    padding: '0 5% 0 0',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-end',
                                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
                                }}>
                                    <Tooltip title={"Add to favorites"}>
                                        <Button
                                            variant={"outlined"}
                                            fullWidth={false}
                                            onClick={handleClickFavorites}
                                            sx={{
                                                borderColor: 'rgb(158,26,96)',
                                                backgroundColor: 'transparent',
                                                zIndex: 20,
                                                minWidth: '0',
                                                width: '30px',
                                                height: '30px',
                                                display: 'flex',
                                                margin: '4px 2px 16px 22px',
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
                                        ><FavoriteBorderOutlinedIcon size={"large"}
                                                                     sx={{color: 'rgb(158,26,96)', fontSize: '26px'}}/>
                                        </Button>
                                    </Tooltip>
                                    <div style={{
                                        width: '70%',
                                        boxSizing: 'border-box',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        padding: '0 5% 0 0',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-end',
                                        borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
                                    }}>
                                    <p style={{margin: '0', fontSize: '24px', fontWeight: 'bold'}}>{parseFloat(productPrice).toFixed(2)}$</p>
                                    {
                                        inStockBanner
                                    }
                                    </div>
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
                        maxHeight: 'fit-content',
                        boxSizing: 'border-box',
                        padding: '0 0 16px 0',
                        margin: '0',
                 }} dangerouslySetInnerHTML={{ __html: productDescription }}>
                </div>
                <div style={{
                    width: '100%',
                    height: 'fit-content',
                    boxSizing: 'border-box',
                    margin: '0 auto',
                    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                    paddingTop: '16px',
                }}>
                    <div className="product-opinions-content"
                        style={{
                            width: '100%',
                            height: 'fit-content',
                            boxSizing: 'border-box',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                            paddingBottom: '16px',
                        }}
                    >
                        {LocalStorageHelper.IsUserLogged() === false &&
                            <>
                                <Button
                                    className="submit-btn"
                                    type="button"
                                    variant="outlined"
                                    endIcon={<LoginIcon />}
                                    onClick={() => { navigate('/login'); } }
                                    sx={{
                                        width: 'fit-content',
                                        minWidth: '200px',
                                        borderColor: 'rgb(39, 99, 24)',
                                        color: 'rgb(39, 99, 24)',
                                        outline: 'none !important',
                                        "&:focus": {
                                            bordeerColor: 'rgba(49,140,23, 0.1)', 
                                            outline: 'none !important',
                                        },
                                        "&:hover": { 
                                            borderColor: 'rgba(49,140,23, 0.1)',
                                            backgroundColor: 'rgba(49,140,23, 0.1)',
                                            color: 'rgba(49,140,23)',
                                            outline: 'none !important',
 
                                        }
                                    }}
                                >
                                    Log in to rate the product
                                </Button>
                            </>
                        }
                        {LocalStorageHelper.IsUserLogged() === true &&
                            <>
                                <p style={{margin: '0', fontSize: '20px', fontWeight: 'bold'}}>Rate the product</p>
                                <Box sx={{ '& > legend': { mt: 2 } }}>
                                    <StyledRating
                                        name="customized-color"
                                        value={userRating}
                                        disabled={disableOpinionSubmit}
                                        getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
                                        precision={1}
                                        onChange={(e, nv) => {
                                            setUserRating(nv);
                                        }}
                                        icon={<FavoriteIcon fontSize="inherit" />}
                                        emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                                    />
                                </Box>
                                <TextField
                                    size={"small"}
                                    id="productOpinion"
                                    label="Opinion"
                                    multiline
                                    rows={4}
                                    required
                                    disabled={disableOpinionSubmit}
                                    error={productOpinionError}
                                    helperText={productOpinionErrorMsg}
                                    color={productOpinionError ? 'error' : 'primary'}
                                    value={productOpinion}
                                    onChange={e => setProductOpinion(e.target.value)}
                                    variant={"outlined"}
                                    sx={{
                                        width: '40%',
                                        margin: '16px 0 16px 0',
                                        "& label.Mui-focused": {
                                            color: 'rgb(39, 99, 24)'
                                        },
                                        "& .MuiOutlinedInput-root": {
                                            "&.Mui-focused fieldset": {
                                                borderColor: 'rgb(39, 99, 24)'
                                            }
                                        }
                                    }}/>
                                <Button
                                    className="submit-btn"
                                    type="button"
                                    disabled={disableOpinionSubmit}
                                    variant="contained"
                                    endIcon={<AddOutlinedIcon />}
                                    onClick={submitOpinion}
                                    sx={{
                                        width: '40%',
                                        backgroundColor: 'rgb(39, 99, 24)',
                                        "&:hover": {backgroundColor: 'rgb(49,140,23)'}
                                    }}
                                >
                                Submit
                                </Button>
                            </>
                        }
                    </div>
                    <div className="product-opinions-header" 
                        style={{
                            width: '100%',
                            height: 'fit-content',
                            boxSizing: 'border-box',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            marginBottom: '16px',
                    }}>
                        <p style={{margin: '0', fontSize: '20px', fontWeight: 'bold'}}>Opinions</p>
                    </div>
                    <div className="product-opinions-content"
                        style={{
                            width: '100%',
                            height: 'fit-content',
                            boxSizing: 'border-box',
                        }}
                    >
                        {opinions.map((opinion) => (
                            <Opinion opinion={opinion} id={opinion.id} key={opinion.id} />
                        ))}
                    </div>
                    <div style={{
                        display: 'flex',
                        width: '100%',
                        boxSizing: 'border-box',
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        padding: '16px 0 16px 0'
                    }}>
                        <Stack spacing={2} sx={{boxSizing: 'border-box',}}>
                            <Pagination page={currentPage} count={totalPages} onChange={changePage} shape={"rounded"}
                                        sx={{
                                            boxSizing: 'border-box',
                                            '& .MuiPaginationItem-rounded': {
                                                outline: 'none !important',
                                                "&:hover": {
                                                    outline: 'none !important',
                                                    backgroundColor: 'rgba(39, 99, 24, 0.2)'
                                                },
                                            },
                                            '& .Mui-selected': {
                                                backgroundColor: 'rgba(39, 99, 24, 0.5) !important',
                                                "&:hover": {
                                                    outline: 'none !important',
                                                    backgroundColor: 'rgba(39, 99, 24, 0.2) !important'
                                                },
                                            }
                                        }}
                            />
                        </Stack>
                    </div>
                </div>
        </>
    )

}
</div>

)
}

export default ProductDetailsPage;