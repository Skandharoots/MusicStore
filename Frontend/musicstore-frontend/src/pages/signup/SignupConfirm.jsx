import {Alert, Box, Button, Typography, styled, useTheme} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import LocalStorageHelper from "../../helpers/LocalStorageHelper.jsx";
import axios from "axios";

const SignupConfirmContainer = styled(Box)(({ theme }) => ({
  margin: '0 0',
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  minHeight: '80dvh',
}));

const SignupConfirmContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'start',
  alignItems: 'start',
  textAlign: 'center',
  width: '400px',
  margin: '5% auto',
  color: theme.palette.text.primary,
  borderRadius: '1em',
  boxShadow: '0 5px 15px ' + theme.palette.formShadow.main,
  padding: '2%',
}));

const StyledAlert = styled(Alert)(({ theme }) => ({
  margin: '1rem auto',
  color: theme.palette.mybutton.colorOne,
}));

function SignupConfirm() {
    const [countDown, setCountDown] = useState(10);
    const [hideSuccess, setHideSuccess] = useState(true);
    const [hideError, setHideError] = useState(true);
    const [showLoginButton, setShowLoginButton] = useState(false);
    const [showRegisterButton, setShowRegisterButton] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [hideCountdown, setHideCountdown] = useState(true);
    
    const token = useParams();
    const navigate = useNavigate();

    const theme = useTheme();

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
        if (showRegisterButton) {
            return (
                <Button color="inherit" size="small" sx={{color: theme.palette.mybutton.colorOne,}} onClick={() => navigate('/signup')}>
                    Register
                </Button>
            )
        } else if (showLoginButton) {
            return (
                <Button color="inherit" size="small" sx={{color: theme.palette.mybutton.colorOne,}} onClick={() => navigate('/login')}>
                    Login
                </Button>
            )
        } else {
            return (
                <Button color="inherit" size="small" sx={{color: theme.palette.mybutton.colorOne,}} onClick={() => navigate('/signup')}>
                    Register
                </Button>
            )
        }
    }

    useEffect(() => {
        axios.get(`api/users/register/confirm?token=${token.token}`, {})
            .then(() => {
                setHideSuccess(false);
                setHideCountdown(false);
                counter();
            }).catch((error) => {
                setHideError(false);
                setErrorMessage(error.response.data.message);
                if (error.response.data.message === 'Email already confirmed') {
                    setShowLoginButton(true);
                } else if (error.response.data.message === 'Confirmation token expired') {
                    setShowLoginButton(true);
                }
            })
    }, [])

    return (
        <SignupConfirmContainer>
            <SignupConfirmContent>
                <Typography variant="h5">
                    Hi, we are confirming your account!
                </Typography>
                {!hideSuccess && (
                    <StyledAlert
                        severity="success"
                        hidden={hideSuccess}
                        action={
                            <Button color="inherit" sx={{color: theme.palette.mybutton.colorOne,}} size="small" onClick={() => navigate('/login')}>
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
                >
                    We&apos;ll redirect you to the login page in - {countDown}
                </Typography>
            </SignupConfirmContent>
        </SignupConfirmContainer>
    );
}

export default SignupConfirm;