import React, {useEffect, useState} from "react";
import {Alert, AlertTitle, Backdrop, CircularProgress} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import {Slide, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.css';
import TextField from '@mui/material/TextField';
import {Box, Button, Typography} from "@mui/material";
import axios from "axios";
import './style/PasswordResetRequest.scss';



function PasswordResetRequest() {

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [showErrorMsg, setShowErrorMsg] = useState('none')
    const [showSuccessMsg, setShowSucessMsg] = useState('none');

    useEffect(() => {
            document.title = 'Reset password request';
        }, []);

    const validateInputs= (e) => {

        let isValid = true;

        if (!email || !/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        return isValid;
    }

    const submitRequest = (e) => {
        e.preventDefault();
        setOpenBackdrop(true);

        axios.get(`api/users/password/email/${email}`, {})
            .then(resp => {
                setShowSucessMsg('flex');
                setOpenBackdrop(false);
            }).catch((e) => {
                console.log(e);
                setErrorMsg(e.response.data.message)
                setShowErrorMsg('flex');
                setOpenBackdrop(false);
            })
    }

    return (
        <div className='pass'>
            <Backdrop
                sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
                open={openBackdrop}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            <Alert variant='filled'
                   severity="success"
                   icon={<CheckIcon fontSize='inherit' />}
                   sx={{
                       display: showSuccessMsg,
                       width: '400px',
                       margin: '32px auto 0 auto',
                       padding: '0 2%',
                   }}>
                <AlertTitle>Success</AlertTitle>
                We have sent a password reset email message. Please check your inbox at {email}.
            </Alert>
            <Alert variant='filled'
                   severity='error'
                   onClose={() => setShowErrorMsg('none')}
                   sx={{
                       display: showErrorMsg,
                       width: '400px',
                       margin: '32px auto 0 auto',
                       padding: '0 2%',
                   }}>
                <AlertTitle>Error, {errorMsg}</AlertTitle>
            </Alert>
            <div className="pass-form">
                <Typography
                    component="h1"
                    variant="h5"
                    sx={{
                        width: '100%', fontSize: '14px', color: 'black'
                        , margin: '0 auto 5% auto'
                    }}
                >
                    Please enter your email to reset your password
                </Typography>
                <Box
                    component="form"
                    onSubmit={submitRequest}
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
                    <Button
                        className="login-btn"
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
                        Password reset
                    </Button>
                </Box>
            </div>
        </div>

    )

}

export default PasswordResetRequest;