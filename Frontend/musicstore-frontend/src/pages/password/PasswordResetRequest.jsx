import React, {useEffect, useState} from "react";
import {Alert, AlertTitle, Backdrop, CircularProgress, Box, Button, Typography, Paper, styled} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import {Slide, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextField from '@mui/material/TextField';
import axios from "axios";
import './style/PasswordResetRequest.scss';
import { useNavigate } from "react-router-dom";
import LocalStorageHelper from "../../helpers/LocalStorageHelper";

const PasswordContainer = styled(Box)(({ theme }) => ({
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.default,
    minHeight: '80dvh',
}));

const PasswordForm = styled(Paper)(({ theme }) => ({
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

const StyledAlert = styled(Alert)({
    width: '400px',
    margin: '32px auto 0 auto',
    padding: '0 2%',
});

const StyledButton = styled(Button)(({ theme }) => ({
    width: '70%',
    color: theme.palette.mybutton.colorTwo,
    backgroundColor: 'rgb(39, 99, 24)',
    "&:hover": {backgroundColor: 'rgb(49,140,23)'}
}));

function PasswordResetRequest() {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [showErrorMsg, setShowErrorMsg] = useState('none')
    const [showSuccessMsg, setShowSucessMsg] = useState('none');

    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Reset password request';
    }, []);

    useEffect(() => {
        if (LocalStorageHelper.IsUserLogged()) {
            navigate('/');
        }
    }, [navigate]);

    const validateInputs = (e) => {
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
        <PasswordContainer>
            <Backdrop
                sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
                open={openBackdrop}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            <StyledAlert
                variant='filled'
                severity="success"
                icon={<CheckIcon fontSize='inherit' />}
                sx={{ display: showSuccessMsg }}
            >
                <AlertTitle>Success</AlertTitle>
                We have sent a password reset email message. Please check your inbox at {email}.
            </StyledAlert>
            <StyledAlert
                variant='filled'
                severity='error'
                onClose={() => setShowErrorMsg('none')}
                sx={{ display: showErrorMsg }}
            >
                <AlertTitle>Error, {errorMsg}</AlertTitle>
            </StyledAlert>
            <PasswordForm>
                <Typography
                    component="h1"
                    variant="h5"
                    sx={{
                        width: '100%',
                        fontSize: '14px',
                        margin: '0 auto 5% auto',
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
                    <StyledButton
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
                    </StyledButton>
                </Box>
            </PasswordForm>
        </PasswordContainer>
    );
}

export default PasswordResetRequest;