import './style/OrderPage.scss';
import {useEffect, useState} from "react";
import axios from "axios";
import LocalStorageHelper from "../../helpers/LocalStorageHelper.jsx";
import {Bounce, toast} from "react-toastify";
import OrderItem from "./components/OrderItem.jsx";
import {
    Backdrop,
    Box, Button,
    CircularProgress,
     InputAdornment,

    Typography
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import TextField from "@mui/material/TextField";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";


function OrderPage() {

    const [basketItems, setBasketItems] = useState([]);
    const [openBackdrop, setOpenBackdrop] = useState(false);

    // const [name, setName] = useState('');
    // const [surname, setSurname] = useState('');
    // const [email, setEmail] = useState('');
    // const [phone, setPhone] = useState('');
    // const [country, setCountry] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Add Product';
    }, []);

    useEffect(() => {
        if (LocalStorageHelper.IsUserLogged() === false) {
            navigate('/');
        }
    }, []);

    useEffect(() => {
                axios.get(`api/cart/get/${LocalStorageHelper.GetActiveUser()}`, {
                    headers: {
                        'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                    }
                }).then(response => {
                    setBasketItems(response.data);
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
                    });
                })

    }, [])

    return (
        <div className="order-page">
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className="wrapper">
                <div className="order-form">
                    {/*<Typography*/}
                    {/*    component="h1"*/}
                    {/*    variant="h5"*/}
                    {/*    sx={{*/}
                    {/*        width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', color: 'black'*/}
                    {/*        , margin: '0 auto 5% auto'*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    Add product*/}
                    {/*</Typography>*/}
                    {/*<Box*/}
                    {/*>*/}
                    {/*    <TextField*/}
                    {/*        size={"small"}*/}
                    {/*        error={productNameError}*/}
                    {/*        helperText={productNameErrorMsg}*/}
                    {/*        id="productName"*/}
                    {/*        type="email"*/}
                    {/*        name="productName"*/}
                    {/*        placeholder="Product"*/}
                    {/*        autoComplete="productName"*/}
                    {/*        required*/}
                    {/*        fullWidth*/}
                    {/*        variant="outlined"*/}
                    {/*        color={productNameError ? 'error' : 'primary'}*/}
                    {/*        label="Product"*/}
                    {/*        value={productName}*/}
                    {/*        onChange={e => setProductName(e.target.value)}*/}
                    {/*        sx={{*/}
                    {/*            width: '70%',*/}
                    {/*            margin: '0 auto 5% auto',*/}
                    {/*            "& label.Mui-focused": {*/}
                    {/*                color: 'rgb(39, 99, 24)'*/}
                    {/*            },*/}
                    {/*            "& .MuiOutlinedInput-root": {*/}
                    {/*                "&.Mui-focused fieldset": {*/}
                    {/*                    borderColor: 'rgb(39, 99, 24)'*/}
                    {/*                }*/}
                    {/*            }*/}
                    {/*        }}*/}
                    {/*    />*/}
                    {/*    <TextField*/}
                    {/*        size={"small"}*/}
                    {/*        id="productDescription"*/}
                    {/*        label="Description"*/}
                    {/*        multiline*/}
                    {/*        rows={4}*/}
                    {/*        required*/}
                    {/*        error={productDescriptionError}*/}
                    {/*        helperText={productDescriptionErrorMsg}*/}
                    {/*        color={productDescriptionError ? 'error' : 'primary'}*/}
                    {/*        value={productDescription}*/}
                    {/*        onChange={e => setProductDescription(e.target.value)}*/}
                    {/*        variant={"outlined"}*/}
                    {/*        sx={{*/}
                    {/*            width: '70%',*/}
                    {/*            margin: '0 auto 5% auto',*/}
                    {/*            "& label.Mui-focused": {*/}
                    {/*                color: 'rgb(39, 99, 24)'*/}
                    {/*            },*/}
                    {/*            "& .MuiOutlinedInput-root": {*/}
                    {/*                "&.Mui-focused fieldset": {*/}
                    {/*                    borderColor: 'rgb(39, 99, 24)'*/}
                    {/*                }*/}
                    {/*            }*/}
                    {/*        }}/>*/}
                    {/*    <TextField*/}
                    {/*        size={"small"}*/}
                    {/*        error={productPriceError}*/}
                    {/*        helperText={productPriceErrorMsg}*/}
                    {/*        id="productPrice"*/}
                    {/*        type="email"*/}
                    {/*        name="productPrice"*/}
                    {/*        placeholder="2699.99"*/}
                    {/*        autoComplete="productPrice"*/}
                    {/*        required*/}
                    {/*        fullWidth*/}
                    {/*        slotProps={{*/}
                    {/*            input: {*/}
                    {/*                startAdornment: <InputAdornment position="start">$</InputAdornment>,*/}
                    {/*                maxLength: 10,*/}
                    {/*                step: 0.50,*/}
                    {/*                inputMode: 'numeric',*/}
                    {/*            },*/}
                    {/*        }}*/}
                    {/*        variant="outlined"*/}
                    {/*        color={productPriceError ? 'error' : 'primary'}*/}
                    {/*        label="Price"*/}
                    {/*        value={productPrice}*/}
                    {/*        onChange={e => setProductPrice(e.target.value)}*/}
                    {/*        sx={{*/}
                    {/*            width: '70%',*/}
                    {/*            margin: '0 auto 5% auto',*/}
                    {/*            "& label.Mui-focused": {*/}
                    {/*                color: 'rgb(39, 99, 24)'*/}
                    {/*            },*/}
                    {/*            "& .MuiOutlinedInput-root": {*/}
                    {/*                "&.Mui-focused fieldset": {*/}
                    {/*                    borderColor: 'rgb(39, 99, 24)'*/}
                    {/*                }*/}
                    {/*            }*/}
                    {/*        }}*/}
                    {/*    />*/}
                    {/*    <TextField*/}
                    {/*        size={"small"}*/}
                    {/*        error={productQuantityError}*/}
                    {/*        helperText={productQuantityErrorMsg}*/}
                    {/*        id="productQuantity"*/}
                    {/*        type="email"*/}
                    {/*        name="productQuantity"*/}
                    {/*        placeholder="1"*/}
                    {/*        autoComplete="productQuantity"*/}
                    {/*        required*/}
                    {/*        fullWidth*/}
                    {/*        slotProps={{*/}
                    {/*            input: {*/}
                    {/*                maxLength: 10,*/}
                    {/*                step: 1,*/}
                    {/*                inputMode: 'numeric',*/}
                    {/*            },*/}
                    {/*        }}*/}
                    {/*        variant="outlined"*/}
                    {/*        color={productQuantityError ? 'error' : 'primary'}*/}
                    {/*        label="Quantity"*/}
                    {/*        value={productQuantity}*/}
                    {/*        onChange={e => setProductQuantity(e.target.value)}*/}
                    {/*        sx={{*/}
                    {/*            width: '70%',*/}
                    {/*            margin: '0 auto 5% auto',*/}
                    {/*            "& label.Mui-focused": {*/}
                    {/*                color: 'rgb(39, 99, 24)'*/}
                    {/*            },*/}
                    {/*            "& .MuiOutlinedInput-root": {*/}
                    {/*                "&.Mui-focused fieldset": {*/}
                    {/*                    borderColor: 'rgb(39, 99, 24)'*/}
                    {/*                }*/}
                    {/*            }*/}
                    {/*        }}*/}
                    {/*    />*/}
                    {/*    <Button*/}
                    {/*        className="add-btn"*/}
                    {/*        type="button"*/}
                    {/*        fullWidth*/}
                    {/*        variant="contained"*/}
                    {/*        endIcon={<AddOutlinedIcon />}*/}
                    {/*        // onClick={submitProduct}*/}
                    {/*        sx={{*/}
                    {/*            width: '70%',*/}
                    {/*            backgroundColor: 'rgb(39, 99, 24)',*/}
                    {/*            "&:hover": {backgroundColor: 'rgb(49,140,23)'}*/}
                    {/*        }}*/}
                    {/*    >*/}
                    {/*        Add Product*/}
                    {/*    </Button>*/}
                    {/*</Box>*/}
                </div>
                <div className="order-items">
                    {
                        [...basketItems].map((item, index) => (
                            <OrderItem key={index} item={item} />
                        ))
                    }
                </div>
            </div>

        </div>
    )
}

export default OrderPage;