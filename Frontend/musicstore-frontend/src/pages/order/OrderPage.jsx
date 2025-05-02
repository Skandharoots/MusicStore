import React, {useEffect, useState} from "react";
import axios from "axios";
import LocalStorageHelper from "../../helpers/LocalStorageHelper.jsx";
import {Slide, toast} from "react-toastify";
import OrderItem from "./components/OrderItem.jsx";
import {
    Backdrop,
    Button,
    CircularProgress,
    Typography,
    TextField,
    styled
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {CreditCard} from "@mui/icons-material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

const OrderPageContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    minHeight: '80vh',
    height: 'fit-content',
    backgroundColor: theme.palette.background.default,
    
}));

const OrderWrapper = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '80%',
    height: 'fit-content',
    marginTop: '16px',
    marginBottom: '32px',
    boxSizing: 'border-box',
}));

const OrderForm = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
    minWidth: '550px',
    width: '20%',
    height: 'fit-content',
    boxSizing: 'border-box',
}));

const PersonalInfo = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
    maxWidth: '500px',
    margin: '0 0 16px 0',
    padding: '4%',
    boxShadow: '0 5px 15px ' + theme.palette.formShadow.main,
    borderRadius: '1em',
    boxSizing: 'border-box',
}));

const DeliveryInfo = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
    maxWidth: '500px',
    padding: '4%',
    margin: '16px 0',
    boxShadow: '0 5px 15px ' + theme.palette.formShadow.main,
    borderRadius: '1em',
    boxSizing: 'border-box',
}));

const SubmitOrder = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
    maxWidth: '500px',
    padding: '4%',
    margin: '16px 0',
    boxShadow: '0 5px 15px ' + theme.palette.formShadow.main,
    borderRadius: '1em',
    boxSizing: 'border-box',
}));

const OrderItems = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '25%',
    boxSizing: 'border-box',
    minWidth: '500px',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
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
}));

const StyledButton = styled(Button)(({ theme }) => ({
    width: '70%',
    color: theme.palette.mybutton.colorTwo,
    backgroundColor: 'rgb(39, 99, 24)',
    "&:hover": {backgroundColor: 'rgb(49,140,23)'}
}));

const OrderHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '85%',
    marginTop: '3em',
    marginBottom: '1em'
}));

function OrderPage() {

    const [basketItems, setBasketItems] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [showUnavailableItemsDiv, setShowUnavailableItemsDiv] = useState(false);

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [country, setCountry] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [totalCost, setTotalCost] = useState(0);

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
        document.title = 'Place an order';
    }, []);

    useEffect(() => {
        if (LocalStorageHelper.IsUserLogged() === false) {
            navigate('/login');
        }
    }, []);

    const onUnavailable = () => {
        setShowUnavailableItemsDiv(true);
    }

    const validateInputs = () => {

        let isValid = true;

        if (!name || !/^(?=.{1,50}$)[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]+(?:[-'_. \\s][A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]+)*$/s.test(name)) {
            setNameError(true);
            setNameErrorMsg('Please enter a valid name.');
            isValid = false;
        } else {
            setNameError(false);
            setNameErrorMsg('');
        }

        if (!surname || !/^(?=.{1,50}$)[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]+(?:[-'_. \\s][A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]+)*$/s.test(surname)) {
            setSurnameError(true);
            setSurnameErrorMsg('Please enter a valid surname.');
            isValid = false;
        } else {
            setSurnameError(false);
            setSurnameErrorMsg('');
        }

        if (!email || !/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email)) {
            setEmailError(true);
            setEmailErrorMsg('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMsg('');
        }

        if (!phone || !/^[+]?[ (]?[0-9]{1,3}[) ]?[-\s.]?[0-9]{3}[-\s.]?[0-9 -]{1,7}$/s.test(phone)) {
            setPhoneError(true);
            setPhoneErrorMsg('Please enter a valid phone number. Can be +(48) 456 239 430, braces are optional, can contain dashes "-"');
            isValid = false;
        } else {
            setPhoneError(false);
            setPhoneErrorMsg('');
        }

        if (!country || !/^(?=.{1,50}$)[A-Za-z0-9żźćńółęąśŻŹĆĄŚĘŁÓŃ]+(?:[-'_./ \\s][A-Za-z0-9żźćńółęąśŻŹĆĄŚĘŁÓŃ]+)*$/s.test(country)) {
            setCountryError(true);
            setCountryErrorMsg('Please enter a valid country name.');
            isValid = false;
        } else {
            setCountryError(false);
            setCountryErrorMsg('');
        }

        if (!city || !/^(?=.{1,50}$)[A-Za-z0-9żźćńółęąśŻŹĆĄŚĘŁÓŃ]+(?:[-'_./ \\s][A-Za-z0-9żźćńółęąśŻŹĆĄŚĘŁÓŃ]+)*$/s.test(city)) {
            setCityError(true);
            setCityErrorMsg('Please enter a valid city name.');
            isValid = false;
        } else {
            setCityError(false);
            setCityErrorMsg('');
        }

        if (!streetAddress || !/^(?=.{1,50}$)[A-Za-z0-9żźćńółęąśŻŹĆĄŚĘŁÓŃ]+(?:[-'_./ \\s][A-Za-z0-9żźćńółęąśŻŹĆĄŚĘŁÓŃ]+)*$/s.test(streetAddress)) {
            setStreetAddressError(true);
            setStreetAddressErrorMsg('Please enter a valid street name.');
            isValid = false;
        } else {
            setStreetAddressError(false);
            setStreetAddressErrorMsg('');
        }

        if (!zipCode || !/^[a-z0-9][a-z0-9\- ]{0,10}[a-z0-9]$/is.test(zipCode)) {
            setZipCodeError(true);
            setZipCodeErrorMsg('Please enter a valid zip code. Can be in any european format.');
            isValid = false;
        } else {
            setZipCodeError(false);
            setZipCodeErrorMsg('');
        }

        return isValid;

    }

    const submitOrder = (event) => {
        event.preventDefault();
        if (validateInputs() === false) {
            return;
        }
        setOpenBackdrop(true);

        let itemsDto = [];
        [...basketItems].map((item) => {
            let orderItem = {
                productSkuId: item.productSkuId,
                productName: item.productName,
                quantity: item.quantity,
                unitPrice: item.productPrice,
            };
            itemsDto.push(orderItem);
        })

        axios.get('api/users/csrf/token', {})
        .then((response) => {
            axios.post(`api/order/create`, {
                userIdentifier: LocalStorageHelper.GetActiveUser(),
                name: name,
                surname: surname,
                email: email,
                phone: phone,
                country: country,
                streetAddress: streetAddress,
                city: city,
                zipCode: zipCode,
                orderTotalPrice: totalCost,
                items: itemsDto
            }, {
                headers: {
                    'Authorization': `Bearer ` + LocalStorageHelper.getJwtToken(),
                    'X-XSRF-TOKEN': response.data.token,
                    'Content-Type': 'application/json',
                }
            }).then(() => {
                axios.get('api/users/csrf/token')
                .then((response) => {
                    axios.delete(`api/cart/clear/${LocalStorageHelper.GetActiveUser()}`, {
                        headers: {
                            'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                            'X-XSRF-TOKEN': response.data.token,
                        }
                    }).then(() => {
                        setOpenBackdrop(false);
                    }).catch(() => {
                        setOpenBackdrop(false);
                        toast.error('Could not clear basket', {
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
                })
                setOpenBackdrop(false);
                toast.success('Successfully placed an order! You can find more details in your account.', {
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
                navigate('/myorders');
            }).catch(error => {
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
                });
                navigate('/basket');
            });
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

    useEffect(() => {
        setOpenBackdrop(true);
        axios.get(`api/cart/get/${LocalStorageHelper.GetActiveUser()}`, {
            headers: {
                'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
            }
        }).then(response => {
            setBasketItems(response.data);
            let items = 0;
            let totalCostOfItems = 0;
            [...response.data].map((item) => {
                items += item.quantity;
                totalCostOfItems += item.quantity * item.productPrice;
            })
            setTotalItems(items);
            setTotalCost(totalCostOfItems);
            setOpenBackdrop(false);
            if (items <= 0) {
                toast.info('No items for order. Find inspiration at our home page', {
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
                navigate('/');
            }
        }).catch(error => {
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
            });
        })

    }, [])

    return (
        <OrderPageContainer>
            <Backdrop
                sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
                open={openBackdrop}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            <OrderHeader>
                <Typography variant="h4" component="p" sx={{margin: '0', fontSize: '28px', fontWeight: 'bold'}}>
                    Your order <Typography component="span" sx={{margin: '0', fontSize: '18px', fontWeight: 'normal'}}>
                        ({totalItems} items)
                    </Typography>
                </Typography>
            </OrderHeader>
            {totalItems > 0 &&
                <OrderWrapper>
                    <OrderForm>
                        {showUnavailableItemsDiv === false && (
                            <>
                                <PersonalInfo>
                                    <Typography
                                        component="h1"
                                        variant="h5"
                                        sx={{
                                            width: '100%',
                                            fontSize: 'clamp(2rem, 10vw, 2.15rem)',
                                            
                                            margin: '0 auto 5% auto'
                                        }}
                                    >
                                        Personal Information
                                    </Typography>
                                    <StyledTextField
                                        size="small"
                                        error={nameError}
                                        helperText={nameErrorMsg}
                                        id="name"
                                        type="search"
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
                                    />
                                    <StyledTextField
                                        size="small"
                                        error={surnameError}
                                        helperText={surnameErrorMsg}
                                        id="surname"
                                        type="search"
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
                                    />
                                    <StyledTextField
                                        size="small"
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
                                    />
                                    <StyledTextField
                                        size="small"
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
                                    />
                                </PersonalInfo>
                                <DeliveryInfo>
                                    <Typography
                                        component="h1"
                                        variant="h5"
                                        sx={{
                                            width: '100%',
                                            fontSize: 'clamp(2rem, 10vw, 2.15rem)',
                                            
                                            margin: '0 auto 5% auto'
                                        }}
                                    >
                                        Delivery information
                                    </Typography>
                                    <StyledTextField
                                        size="small"
                                        error={countryError}
                                        helperText={countryErrorMsg}
                                        id="country"
                                        type="search"
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
                                    />
                                    <StyledTextField
                                        size="small"
                                        error={cityError}
                                        helperText={cityErrorMsg}
                                        id="city"
                                        type="search"
                                        name="city"
                                        placeholder="City"
                                        autoComplete="city"
                                        required
                                        fullWidth
                                        variant="outlined"
                                        color={cityError ? 'error' : 'primary'}
                                        label="City"
                                        value={city}
                                        onChange={e => setCity(e.target.value)}
                                    />
                                    <StyledTextField
                                        size="small"
                                        error={streetAddressError}
                                        helperText={streetAddressErrorMsg}
                                        id="streetAddress"
                                        type="search"
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
                                    />
                                    <StyledTextField
                                        size="small"
                                        error={zipCodeError}
                                        helperText={zipCodeErrorMsg}
                                        id="zipCode"
                                        type="search"
                                        name="name"
                                        placeholder="Zip code"
                                        autoComplete="zipCode"
                                        required
                                        fullWidth
                                        variant="outlined"
                                        color={zipCodeError ? 'error' : 'primary'}
                                        label="Zip-code"
                                        pattern="(?i)^[a-z0-9][a-z0-9\\- ]{0,10}[a-z0-9]$"
                                        value={zipCode}
                                        onChange={e => setZipCode(e.target.value)}
                                    />
                                </DeliveryInfo>
                            </>
                        )}
                        {showUnavailableItemsDiv === false &&
                            <SubmitOrder>
                                <StyledButton
                                    className="add-btn"
                                    type="button"
                                    fullWidth
                                    variant="contained"
                                    endIcon={<CreditCard/>}
                                    onClick={submitOrder}
                                >
                                    Place Order
                                </StyledButton>
                            </SubmitOrder>
                        }
                        {showUnavailableItemsDiv === true &&
                            <PersonalInfo>
                                <StyledButton
                                    className="add-btn"
                                    type="button"
                                    fullWidth
                                    variant="contained"
                                    endIcon={<ShoppingCartOutlinedIcon/>}
                                    onClick={() => {navigate('/basket')}}
                                >
                                    Basket
                                </StyledButton>
                            </PersonalInfo>
                        }
                    </OrderForm>
                    <OrderItems>
                        {[...basketItems].map((item, index) => (
                            <OrderItem key={index} item={item} onOutOfStock={onUnavailable} />
                        ))}
                    </OrderItems>
                </OrderWrapper>
            }
        </OrderPageContainer>
    );
}

export default OrderPage;