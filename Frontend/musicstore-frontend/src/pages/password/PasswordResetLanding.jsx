import React, {useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import './style/PasswordResetLanding.scss';
import {Slide, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextField from '@mui/material/TextField';
import {useState} from "react";
import {Alert, Backdrop, Box, Button, CircularProgress, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import axios from "axios";


function PasswordResetLanding() {

    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [hideError, setHideError] = useState(true);
    const [hideSuccess, setHideSuccess] = useState(true);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordConfirmationError, setPasswordConfirmationError] = useState(false);
    const [passwordConfirmationErrorMessage, setPasswordConfirmationErrorMessage] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [countDown, setCountDown] = useState(10);
    const [hideCountdown, setHideCountdown] = useState(true);
    const [showLoginButton, setShowLoginButton] = useState(false);
    const [showRequestButton, setShowRequestButton] = useState(false);

    const navigate = useNavigate();
    const param = useParams();

    useEffect(() => {
        document.title = 'Reset password';
    }, []);

    const counter = () => {
        let interval = setInterval(() => {
            setCountDown(lastTimerCount => {
                if (lastTimerCount <= 1) {
                    navigate('/login');
                } else {
                    lastTimerCount <= 1 && clearInterval(interval)
                    return lastTimerCount - 1
                }
            })
        }, 1000) //each count lasts for a second
        //cleanup the interval on complete
        return () => clearInterval(interval)
    };

    const showButton = () => {
        if (showRequestButton) {
            return (
                <Button color="inherit" size="small" onClick={() => {
                    navigate('/password')
                }}>
                    Request again
                </Button>
            )
        } else if (showLoginButton) {
            return (
                <Button color="inherit" size="small" onClick={() => {
                    navigate('/login')
                }}>
                    Login
                </Button>
            )
        } else {
            return (
                <Button color="inherit" size="small" onClick={() => {
                    navigate('/login')
                }}>
                    Login
                </Button>
            )
        }
    }

    const validateInputs = () => {

        let isValid = true;

        if (!(passwordConfirmation === password)) {
            setPasswordConfirmationError(true);
            setPasswordConfirmationErrorMessage('Passwords do not match.');
            isValid = false;
        } else {
            setPasswordConfirmationError(false);
            setPasswordConfirmationErrorMessage('');
        }

        if (!password || password.length < 6 || password.length > 50) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 and max 50 characters long.');
            isValid = false;
        }  else if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#&()–\[{}\]:;',?/*~$^+=<>]).{6,50}$/.test(password)) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must contain one lower and upper case letter, one number and one special character.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        return isValid;
    };


    const submitRequest = (event) => {
        event.preventDefault();
        if (!validateInputs()) {
            return;
        }
        setOpenBackdrop(true);

        axios.get('api/users/csrf/token')
            .then(res => {
                axios.post(`api/users/password/email/reset`, {
                    token: param.token,
                    password: password,
                    passwordConfirmation: passwordConfirmation
                }, {
                    headers: {
                        'X-XSRF-TOKEN': res.data.token,
                        'Content-Type': 'application/json'
                    }
                }).then((response) => {
                    setOpenBackdrop(false);
                    setHideSuccess(false);
                    setHideCountdown(false);
                    setShowLoginButton(true);
                    counter();
                }).catch((e) => {
                    setErrorMessage(e.response.data.message);
                    setHideError(false);
                    setOpenBackdrop(false);
                    setShowRequestButton(true);
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
        <div className="reset-landing">
            <Backdrop
                sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
                open={openBackdrop}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            <div className="reset-landing-form">
                <Typography
                    component="h1"
                    variant="h5"
                    sx={{
                        width: '100%', fontSize: '26px', color: 'black'
                        , margin: '0 auto 5% auto'
                    }}
                >
                    Reset your password
                </Typography>
                <Box
                    component="form"
                    onSubmit={submitRequest}
                    noValidate

                >
                    <TextField
                        error={passwordError}
                        helperText={passwordErrorMessage}
                        id="password"
                        type="password"
                        name="password"
                        placeholder="••••••"
                        autoComplete="current-password"
                        autoFocus
                        required
                        fullWidth
                        variant="outlined"
                        color={passwordError ? 'error' : 'primary'}
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
                    <TextField
                        error={passwordConfirmationError}
                        helperText={passwordConfirmationErrorMessage}
                        name="passwordConfirmation"
                        placeholder="••••••"
                        type="password"
                        id="passwordConfirmation"
                        autoComplete="current-password"
                        color={passwordConfirmationError ? 'error' : 'primary'}
                        required
                        fullWidth
                        variant="outlined"
                        label="Password confirmation"
                        value={passwordConfirmation}
                        onChange={e => setPasswordConfirmation(e.target.value)}
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
                    <Button
                        className="reset-btn"
                        type="submit"
                        fullWidth
                        variant="contained"
                        onClick={validateInputs}
                        sx={{
                            width: '70%',
                            backgroundColor: 'rgb(39, 99, 24)',
                            "&:hover": {backgroundColor: 'rgb(49,140,23)'}
                        }}
                    >
                        Reset password
                    </Button>
                </Box>
                { !hideSuccess &&
                <Alert
                    severity="success"
                    sx={{margin: '1rem auto', width: '70%'}}
                    hidden={hideSuccess}
                    action={
                        <Button color="inherit" size="small" onClick={() => {navigate('/login')}}>
                            LOGIN NOW
                        </Button>
                    }
                >
                    Success! You can now log in!
                </Alert>
                }
                { !hideError &&
                    <Alert
                        severity="error"
                        sx={{margin: '1rem auto', width: '70%'}}
                        hidden={hideError}
                        action={
                            showButton()
                        }
                    >
                        Something went wrong. {errorMessage}
                    </Alert>
                }
                <Typography hidden={hideCountdown} variant={"body1"} color="black" sx={{width: '70%'}}>
                    We&apos;ll redirect you to the login page in - {countDown}
                </Typography>
            </div>
        </div>
    )
}

export default PasswordResetLanding;