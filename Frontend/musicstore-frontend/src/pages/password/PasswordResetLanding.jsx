import React, {useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import {Slide, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useState} from "react";
import {Alert, Backdrop, Box, Button, CircularProgress, Typography, Paper, styled, useTheme} from "@mui/material";
import axios from "axios";
import TextField from '@mui/material/TextField';
import LocalStorageHelper from "../../helpers/LocalStorageHelper";

const ResetLandingContainer = styled(Box)(({ theme }) => ({
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.default,
    minHeight: '80dvh',
}));

const ResetLandingForm = styled(Paper)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: theme.palette.text.primary,
    maxWidth: '400px',
    margin: '5% auto',
    borderRadius: '1em',
    boxShadow: '0 5px 15px ' + theme.palette.formShadow.main,
    padding: '2%',
    backgroundColor: theme.palette.background.paper,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    width: '70%',
    margin: '0 auto 5% auto',
    color: theme.palette.text.primary,
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
    backgroundColor: 'rgb(39, 99, 24)',
    color: theme.palette.mybutton.colorTwo,
    "&:hover": {
        backgroundColor: 'rgb(49,140,23)'
    }
}));

const StyledAlert = styled(Alert)({
    margin: '1rem auto',
    width: '70%'
});

function PasswordResetLanding() {
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [hideError, setHideError] = useState(true);
    const [hideSuccess, setHideSuccess] = useState(true);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordConfirmationError, setPasswordConfirmationError] = useState(false);
    const [passwordConfirmationErrorMessage, setPasswordConfirmationErrorMessage] = useState('');
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [countDown, setCountDown] = useState(10);
    const [hideCountdown, setHideCountdown] = useState(true);
    const [showLoginButton, setShowLoginButton] = useState(false);
    const [showRequestButton, setShowRequestButton] = useState(false);

    const navigate = useNavigate();
    const param = useParams();
    const theme=useTheme();

    useEffect(() => {
        document.title = 'Reset password';
    }, []);

    useEffect(() => {
        if (LocalStorageHelper.IsUserLogged()) {
            navigate('/');
        }
    }, [navigate]);

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
        }, 1000)
        return () => clearInterval(interval)
    };

    const showButton = () => {
        if (showRequestButton) {
            return (
                <Button color="inherit" size="small" sx={{color: theme.palette.mybutton.colorOne}} onClick={() => navigate('/password')}>
                    Request again
                </Button>
            )
        } else if (showLoginButton) {
            return (
                <Button color="inherit" size="small" sx={{color: theme.palette.mybutton.colorOne}} onClick={() => navigate('/login')}>
                    Login
                </Button>
            )
        } else {
            return (
                <Button color="inherit" size="small" sx={{color: theme.palette.mybutton.colorOne}} onClick={() => navigate('/login')}>
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
                axios.put(`api/users/password/email/reset`, {
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
        <ResetLandingContainer>
            <Backdrop
                sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
                open={openBackdrop}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            <ResetLandingForm>
                <Typography
                    component="h1"
                    variant="h5"
                    sx={{
                        width: '100%',
                        fontSize: '26px',
                        margin: '0 auto 5% auto'
                    }}
                >
                    Reset your password
                </Typography>
                <Box
                    component="form"
                    onSubmit={submitRequest}
                    noValidate
                >
                    <StyledTextField
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
                    />
                    <StyledTextField
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
                    />
                    <StyledButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        onClick={validateInputs}
                    >
                        Reset password
                    </StyledButton>
                </Box>
                {!hideSuccess && (
                    <StyledAlert
                        severity="success"
                        hidden={hideSuccess}
                        action={
                            <Button color="inherit" size="small" sx={{color: theme.palette.mybutton.colorOne}} onClick={() => navigate('/login')}>
                                LOGIN NOW
                            </Button>
                        }
                    >
                        Success! You can now log in!
                    </StyledAlert>
                )}
                {!hideError && (
                    <StyledAlert
                        severity="error"
                        hidden={hideError}
                        action={showButton()}
                    >
                        Something went wrong. {errorMessage}
                    </StyledAlert>
                )}
                <Typography 
                    hidden={hideCountdown} 
                    variant="body1" 
                    color="black" 
                    sx={{width: '70%', color: theme.palette.mybutton.colorOne}}
                >
                    We&apos;ll redirect you to the login page in - {countDown}
                </Typography>
            </ResetLandingForm>
        </ResetLandingContainer>
    )
}

export default PasswordResetLanding;