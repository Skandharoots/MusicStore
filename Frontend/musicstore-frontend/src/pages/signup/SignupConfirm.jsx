import {Alert, Button, Typography} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import './style/SignupConfirm.scss';


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
        if (showRegisterButton) {
            return (
                <Button color="inherit" size="small" onClick={() => {
                    navigate('/signup')
                }}>
                    Register
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
                    navigate('/signup')
                }}>
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
        <div className="signup-confirm">
            <div className="signup-confirm-content">
                <Typography variant="h5" color="black">
                    Hi, we are confirming your account!
                </Typography>
                { !hideSuccess &&
                    <Alert
                        severity="success"
                        sx={{margin: '1rem auto'}}
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
                        sx={{margin: '1rem auto'}}
                        hidden={hideError}
                        action={
                            showButton()
                        }
                    >
                        Something went wrong. {errorMessage}
                    </Alert>
                }
                <Typography hidden={hideCountdown} variant={"body1"} color="black">
                    We&apos;ll redirect you to the login page in - {countDown}
                </Typography>
            </div>
        </div>
    )
}

export default SignupConfirm