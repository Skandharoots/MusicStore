import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import {Slide, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LocalStorageHelper from "../../helpers/LocalStorageHelper.jsx";
import TextField from '@mui/material/TextField';
import {useState} from "react";
import {Backdrop, Box, Button, CircularProgress, Typography, Paper, styled} from "@mui/material";
import {Link} from "react-router-dom";
import axios from "axios";

const LoginContainer = styled(Box)(({ theme }) => ({
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.default,
    minHeight: '80dvh',
}));

const LoginForm = styled(Paper)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: '400px',
    margin: '5% auto',
    borderRadius: '1em',
    boxShadow: '0 5px 15px ' + theme.palette.formShadow.main,
    padding: '2%',
    backgroundColor: theme.palette.background.paper,
}));

const LinksContainer = styled(Box)({
    width: '70%',
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '0 auto',
});

const StyledLink = styled(Link)(({ theme }) => ({
    color: theme.palette.text.primary,
    textDecoration: 'none',
    '&:hover': {
        color: theme.palette.primary.main,
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    color: theme.palette.mybutton.colorTwo,
    width: '70%',
    backgroundColor: 'rgb(39, 99, 24)',
    "&:hover": {backgroundColor: 'rgb(49,140,23)'}
}));

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [openBackdrop, setOpenBackdrop] = React.useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Log in';
    }, []);

    useEffect(() => {
        if (LocalStorageHelper.IsUserLogged()) {
            navigate('/');
        }
    }, [navigate]);

    const validateInputs = () => {

        let isValid = true;

        if (!email || !/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!password || password.length < 6 || password.length > 50) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 and max 50 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        return isValid;
    };


    const submitLogin = (event) => {
        event.preventDefault();
        if (validateInputs() === false) {
            return;
        }
        setOpenBackdrop(true);
        axios.get('api/users/csrf/token', {})
            .then((response) => {
                const headers = {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': response.data.token,
                }
                axios.post("api/users/login",
                    {
                        email: email,
                        password: password,
                    },
                    {
                        headers: headers,
                    }
                ).then((response) => {
                    LocalStorageHelper.LoginUser(response.data.uuid, response.data.firstName,
                        response.data.token, response.data.role, response.data.refreshToken);
                    window.dispatchEvent(new Event("storage"));

                    const basket = JSON.parse(localStorage.getItem("basket"));

                    axios.get(`api/cart/get/${LocalStorageHelper.GetActiveUser()}`, {
                        headers: {
                            'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                        }
                    }).then(res => {
                        if (basket) {
                            basket.forEach((item) => {
                                item.userUuid = LocalStorageHelper.GetActiveUser();
                            })
                            let itemsToAdd;
                            let itemsToUpdate;
                            if (res.data.length > 0) {
                                itemsToAdd = basket.filter(o => !res.data.some(({productSkuId}) => o.productSkuId === productSkuId));
                                itemsToUpdate = basket.filter(o => res.data.some(({productSkuId}) => o.productSkuId === productSkuId));
                                itemsToUpdate.forEach(value => {
                                    res.data.forEach((item) => {
                                        if (item.productSkuId === value.productSkuId) {
                                            value.quantity = value.quantity + item.quantity;
                                            value.id = item.id;
                                        }
                                    })
                                });
                            } else {
                                itemsToAdd = basket;
                            }
                            if (itemsToAdd.length > 0) {
                                [...itemsToAdd].map((item) => {
                                    axios.get('api/users/csrf/token')
                                        .then((response) => {
                                            axios.post(`api/cart/create`, {
                                                userUuid: LocalStorageHelper.GetActiveUser(),
                                                productSkuId: item.productSkuId,
                                                productPrice: item.productPrice,
                                                productName: item.productName,
                                                quantity: item.quantity,
                                            }, {
                                                headers: {
                                                    'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                                                    'X-XSRF-TOKEN': response.data.token,
                                                    'Content-Type': 'application/json',
                                                }
                                            }).then(() => {
                                            }).catch(() => {
                                                toast.error('Could not add items to basket', {
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
                                });
                            }
                            if (itemsToUpdate.length > 0) {
                                [...itemsToUpdate].map((item) => {
                                    axios.get('api/users/csrf/token')
                                        .then((response) => {
                                            axios.put(`api/cart/update/${item.id}`, {
                                                quantity: item.quantity
                                            },{
                                                headers: {
                                                    'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                                                    'X-XSRF-TOKEN': response.data.token,
                                                    'Content-Type': 'application/json',
                                                }
                                            }).then(() => {
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
                                })
                            }
                        }
                        localStorage.removeItem('basket');
                        let inBasket = 0;
                        [...res.data].forEach((item) => {
                            inBasket += item.quantity;
                        });
                        LocalStorageHelper.setBasketItems(parseInt(inBasket));
                        window.dispatchEvent(new Event('basket'));
                    }).catch(() => {});
                    setOpenBackdrop(false);
                    toast.success("Welcome, " + response.data.firstName + "!", {
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
                    navigate("/");

                }).catch(() => {
                    setOpenBackdrop(false);
                    toast.error("Wrong credentials provided", {
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
            .catch(() => {
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

    }

    return (
        <LoginContainer>
            <Backdrop
                sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
                open={openBackdrop}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            <LoginForm>
                <Typography
                    component="h1"
                    variant="h5"
                    sx={{
                        width: '100%',
                        fontSize: 'clamp(2rem, 10vw, 2.15rem)',
                        margin: '0 auto 5% auto',
                    }}
                >
                    Sign in
                </Typography>
                <Box
                    component="form"
                    onSubmit={submitLogin}
                    noValidate
                >
                    <TextField
                        error={emailError}
                        helperText={emailErrorMessage}
                        id="email"
                        type="email"
                        name="email"
                        placeholder="your@email.com"
                        autoComplete="email"
                        autoFocus
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
                        error={passwordError}
                        helperText={passwordErrorMessage}
                        name="password"
                        placeholder="••••••"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        required
                        fullWidth
                        variant="outlined"
                        label="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
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
                    <StyledButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        onClick={validateInputs}
                    >
                        Sign in
                    </StyledButton>
                    <LinksContainer>
                        <Typography sx={{ textAlign: 'center', margin: '5% 0 0 0' }}>
                            <StyledLink to="/password">
                                Forgot password?
                            </StyledLink>
                        </Typography>
                        <Typography sx={{ textAlign: 'center', margin: '5% 0 0 0' }}>
                            <StyledLink to="/signup">
                                Sign up
                            </StyledLink>
                        </Typography>
                    </LinksContainer>
                </Box>
            </LoginForm>
        </LoginContainer>
    );
}

export default Login;