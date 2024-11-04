import './style/OrderPage.scss';
import React, {useEffect, useState} from "react";
import axios from "axios";
import LocalStorageHelper from "../../helpers/LocalStorageHelper.jsx";
import {Bounce, toast} from "react-toastify";
import OrderItem from "./components/OrderItem.jsx";
import {
    Backdrop,
    Box, Button,
    CircularProgress,
    Typography
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import TextField from "@mui/material/TextField";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import {CreditCard} from "@mui/icons-material";


function OrderPage() {

    const [basketItems, setBasketItems] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [openBackdrop, setOpenBackdrop] = useState(false);

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [country, setCountry] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [zipCode, setZipCode] = useState('');

    const [nameError, setNameError] = useState(false);
    const [nameErrorMsg, setNameErrorMsg] = useState('');
    const [surnameError, setSurnameError] = useState(false);
    const [surnameErrorMsg, setSurnameErrorMsg] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMsg, setEmailErrorMsg] = useState('');
    const [phoneError, setPhoneError] = useState(false);
    const [phoneErrorMsg, setPhoneErrorMsg] = useState('');
    const [countryError, setCountryError] = useState(false);
    const [countryErrorMsg, setCountryErrorMsg] = useState('');
    const [streetAddressError, setStreetAddressError] = useState(false);
    const [streetAddressErrorMsg, setStreetAddressErrorMsg] = useState('');
    const [cityError, setCityError] = useState(false);
    const [cityErrorMsg, setCityErrorMsg] = useState('');
    const [zipCodeError, setZipCodeError] = useState(false);
    const [zipCodeErrorMsg, setZipCodeErrorMsg] = useState('');

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
                    let items = 0;
                    [...response.data].map((item) => {
                        items += item.quantity;
                    })
                    setTotalItems(items);
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
                sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
                open={openBackdrop}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '85%', marginTop: '3em', marginBottom: '1em'}}>
                <p style={{margin: '0', fontSize: '28px', fontWeight: 'bold'}}>Your order <span style={{
                    margin: '0',
                    fontSize: '18px',
                    fontWeight: 'normal'
                }}>({totalItems} items)</span></p>
            </div>
            <div className="wrapper">
                <div className="order-form">
                    <div className="personal-info">
                        <Typography
                            component="h1"
                            variant="h5"
                            sx={{
                                width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', color: 'black'
                                , margin: '0 auto 5% auto'
                            }}
                        >
                            Personal Information
                        </Typography>
                        <Box
                        >
                            <TextField
                                size={"small"}
                                error={nameError}
                                helperText={nameErrorMsg}
                                id="name"
                                type="email"
                                name="name"
                                placeholder="First name"
                                autoComplete="name"
                                required
                                fullWidth
                                variant="outlined"
                                color={nameError ? 'error' : 'primary'}
                                label="First name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                sx={{
                                    width: '70%',
                                    margin: '0 auto 5% auto',
                                    "& label.Mui-focused": {
                                        color: 'rgb(39, 99, 24)'
                                    },
                                    "& .MuiOutlinedInput-root": {
                                        "&.Mui-focused fieldset": {
                                            borderColor: 'rgb(39, 99, 24)'
                                        }
                                    }
                                }}
                            />
                            <TextField
                                size={"small"}
                                error={surnameError}
                                helperText={surnameErrorMsg}
                                id="surname"
                                type="email"
                                name="surname"
                                placeholder="Surname"
                                autoComplete="surname"
                                required
                                fullWidth
                                variant="outlined"
                                color={surnameError ? 'error' : 'primary'}
                                label="Surname"
                                value={surname}
                                onChange={e => setSurname(e.target.value)}
                                sx={{
                                    width: '70%',
                                    margin: '0 auto 5% auto',
                                    "& label.Mui-focused": {
                                        color: 'rgb(39, 99, 24)'
                                    },
                                    "& .MuiOutlinedInput-root": {
                                        "&.Mui-focused fieldset": {
                                            borderColor: 'rgb(39, 99, 24)'
                                        }
                                    }
                                }}
                            />
                            <TextField
                                size={"small"}
                                error={emailError}
                                helperText={emailErrorMsg}
                                id="email"
                                type="email"
                                name="email"
                                placeholder="your@email.com"
                                autoComplete="email"
                                required
                                fullWidth
                                variant="outlined"
                                color={emailError ? 'error' : 'primary'}
                                label="Email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                sx={{
                                    width: '70%',
                                    margin: '0 auto 5% auto',
                                    "& label.Mui-focused": {
                                        color: 'rgb(39, 99, 24)'
                                    },
                                    "& .MuiOutlinedInput-root": {
                                        "&.Mui-focused fieldset": {
                                            borderColor: 'rgb(39, 99, 24)'
                                        }
                                    }
                                }}
                            />
                            <TextField
                                size={"small"}
                                error={phoneError}
                                helperText={phoneErrorMsg}
                                id="phone"
                                type="tel"
                                name="phone"
                                placeholder="+48 567 234 902"
                                autoComplete="phone"
                                required
                                fullWidth
                                variant="outlined"
                                color={phoneError ? 'error' : 'primary'}
                                label="Phone number"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                sx={{
                                    width: '70%',
                                    margin: '0 auto 5% auto',
                                    "& label.Mui-focused": {
                                        color: 'rgb(39, 99, 24)'
                                    },
                                    "& .MuiOutlinedInput-root": {
                                        "&.Mui-focused fieldset": {
                                            borderColor: 'rgb(39, 99, 24)'
                                        }
                                    }
                                }}
                            />
                        </Box>
                    </div>
                    <div className="delivery-info">
                        <Box>
                            <Typography
                                component="h1"
                                variant="h5"
                                sx={{
                                    width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', color: 'black'
                                    , margin: '0 auto 5% auto'
                                }}
                            >
                                Delivery information
                            </Typography>
                            <TextField
                                size={"small"}
                                error={countryError}
                                helperText={countryErrorMsg}
                                id="country"
                                type="email"
                                name="email"
                                placeholder="Country"
                                autoComplete="country"
                                required
                                fullWidth
                                variant="outlined"
                                color={countryError ? 'error' : 'primary'}
                                label="Country"
                                value={country}
                                onChange={e => setCountry(e.target.value)}
                                sx={{
                                    width: '70%',
                                    margin: '0 auto 5% auto',
                                    "& label.Mui-focused": {
                                        color: 'rgb(39, 99, 24)'
                                    },
                                    "& .MuiOutlinedInput-root": {
                                        "&.Mui-focused fieldset": {
                                            borderColor: 'rgb(39, 99, 24)'
                                        }
                                    }
                                }}
                            />
                            <TextField
                                size={"small"}
                                error={cityError}
                                helperText={cityErrorMsg}
                                id="city"
                                type="email"
                                name="city"
                                placeholder="Surname"
                                autoComplete="city"
                                required
                                fullWidth
                                variant="outlined"
                                color={cityError ? 'error' : 'primary'}
                                label="City"
                                value={city}
                                onChange={e => setCity(e.target.value)}
                                sx={{
                                    width: '70%',
                                    margin: '0 auto 5% auto',
                                    "& label.Mui-focused": {
                                        color: 'rgb(39, 99, 24)'
                                    },
                                    "& .MuiOutlinedInput-root": {
                                        "&.Mui-focused fieldset": {
                                            borderColor: 'rgb(39, 99, 24)'
                                        }
                                    }
                                }}
                            />
                            <TextField
                                size={"small"}
                                error={streetAddressError}
                                helperText={streetAddressErrorMsg}
                                id="streetAddress"
                                type="email"
                                name="streetAddress"
                                placeholder="Street Address"
                                autoComplete="streetAddress"
                                required
                                fullWidth
                                variant="outlined"
                                color={streetAddressError ? 'error' : 'primary'}
                                label="Street address"
                                value={streetAddress}
                                onChange={e => setStreetAddress(e.target.value)}
                                sx={{
                                    width: '70%',
                                    margin: '0 auto 5% auto',
                                    "& label.Mui-focused": {
                                        color: 'rgb(39, 99, 24)'
                                    },
                                    "& .MuiOutlinedInput-root": {
                                        "&.Mui-focused fieldset": {
                                            borderColor: 'rgb(39, 99, 24)'
                                        }
                                    }
                                }}
                            />
                            <TextField
                                size={"small"}
                                error={zipCodeError}
                                helperText={zipCodeErrorMsg}
                                id="zipCode"
                                type="email"
                                name="name"
                                placeholder="Zip code"
                                autoComplete="zipCode"
                                required
                                fullWidth
                                variant="outlined"
                                color={zipCodeError ? 'error' : 'primary'}
                                label="Zip-code"
                                value={zipCode}
                                onChange={e => setZipCode(e.target.value)}
                                sx={{
                                    width: '70%',
                                    margin: '0 auto 5% auto',
                                    "& label.Mui-focused": {
                                        color: 'rgb(39, 99, 24)'
                                    },
                                    "& .MuiOutlinedInput-root": {
                                        "&.Mui-focused fieldset": {
                                            borderColor: 'rgb(39, 99, 24)'
                                        }
                                    }
                                }}
                            />
                        </Box>
                    </div>
                    <div className="submit-order">
                        <Button
                            className="add-btn"
                            type="button"
                            fullWidth
                            variant="contained"
                            endIcon={<CreditCard />}
                            // onClick={submitProduct}
                            sx={{
                                width: '70%',
                                backgroundColor: 'rgb(39, 99, 24)',
                                "&:hover": {backgroundColor: 'rgb(49,140,23)'}
                            }}
                        >
                            Place Order
                        </Button>
                    </div>

                </div>
                <div className="order-items">
                    {
                        [...basketItems].map((item, index) => (
                            <OrderItem key={index} item={item}/>
                        ))
                    }
                </div>
            </div>

        </div>
    )
}

export default OrderPage;