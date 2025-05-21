import React, {useEffect, useState} from "react";
import {styled} from '@mui/material/styles';
import {Alert, AlertTitle, Backdrop, Box, Button, CircularProgress, TextField, Typography} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import {Slide, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LocalStorageHelper from "../../helpers/LocalStorageHelper";

const SignupContainer = styled(Box)(({ theme }) => ({
  margin: '0 0',
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  minHeight: '80dvh',
}));

const SignupForm = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  maxWidth: '400px',
  margin: '32px auto',
  borderRadius: '1em',
  boxShadow: '0 5px 15px ' + theme.palette.formShadow.main,
  padding: '2%',
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
  backgroundColor: 'rgb(39, 99, 24)',
  color: theme.palette.mybutton.colorTwo,
  "&:hover": {
    backgroundColor: 'rgb(49,140,23)'
  }
}));

const StyledAlert = styled(Alert)(({ theme }) => ({
  width: '400px',
  margin: '32px auto 0 auto',
  padding: '0 2%',
  color: theme.palette.mybutton.colorTwo,
}));

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [showSuccessMsg, setShowSuccessMsg] = useState('none');
    const [showErrorMsg, setShowErrorMsg] = useState('none');
    const [registerErrorMsg, setRegisterErrorMsg] = useState('');

    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState('');
    const [firstNameError, setFirstNameError] = useState(false);
    const [firstNameErrorMessage, setFirstNameErrorMessage] = useState('');
    const [lastNameError, setLastNameError] = useState(false);
    const [lastNameErrorMessage, setLastNameErrorMessage] = useState('');

    const [openBackdrop, setOpenBackdrop] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Sign up';
    }, []);

    useEffect(() => {
        if (LocalStorageHelper.IsUserLogged()) {
            navigate('/');
        }
    }, [navigate]);

    const validateInputs = () => {
        let isValid = true;

        if (!firstName
            || !/^(?=.{1,50}$)[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]+(?:[-'_.\s][A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]+)*$/i.test(firstName)) {
            setFirstNameError(true);
            setFirstNameErrorMessage('Please enter a valid first name. Must be from 1 to 50 characters long. It can contain and must start with a capital letter,' +
                ' it can contain lowercase letters, spaces and special characters -\'_.');
            isValid = false;
        } else {
            setFirstNameError(false);
            setFirstNameErrorMessage('');
        }

        if (!lastName
            || !/^(?=.{1,50}$)[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]+(?:[-'_.\s][A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]+)*$/i.test(lastName)) {
            setLastNameError(true);
            setLastNameErrorMessage('Please enter a valid last name. Must be from 1 to 50 characters long. It can contain and must start with a capital letter,' +
                ' it can contain lowercase letters, spaces and special characters -\'_.');
            isValid = false;
        } else {
            setLastNameError(false);
            setLastNameErrorMessage('');
        }

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
            setPasswordErrorMessage('Password must be at least 6 and at max 50 characters long.');
            isValid = false;
        } else if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#&()–\[{}\]:;',?/*~$^+=<>]).{6,50}$/.test(password)) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must contain one lower and upper case letter, one number and one special character.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        if (!confirmPassword || password !== confirmPassword) {
            setConfirmPasswordError(true);
            setConfirmPasswordErrorMessage('Password confirmation does not match.');
            isValid = false;
        } else {
            setConfirmPasswordError(false);
            setConfirmPasswordErrorMessage('');
        }

        return isValid;
    };

    const submitRegister = (event) => {
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
                axios.post('api/users/register',
                    {
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        password: password,
                    },
                    {
                        headers: headers,
                    })
                    .then(() => {
                        setShowSuccessMsg('flex');
                        setOpenBackdrop(false);
                    }).catch((error) => {
                    setRegisterErrorMsg(error.response.data.message);
                    setShowErrorMsg('flex');
                    setOpenBackdrop(false);
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
        <SignupContainer>
            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={openBackdrop}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            <StyledAlert
                variant="filled"
                severity="success"
                icon={<CheckIcon fontSize="inherit" />}
                sx={{display: showSuccessMsg}}
            >
                <AlertTitle>Success</AlertTitle>
                Registration successful, please check your email to verify your account.
            </StyledAlert>
            <StyledAlert
                variant="filled"
                severity="error"
                onClose={() => setShowErrorMsg('none')}
                sx={{display: showErrorMsg}}
            >
                <AlertTitle>Error, {registerErrorMsg}</AlertTitle>
            </StyledAlert>
            <SignupForm>
                <Typography
                    component="h1"
                    variant="h5"
                    sx={{
                        width: '100%',
                        fontSize: 'clamp(2rem, 5vw, 2.15rem)',
                        margin: '0 auto 5% auto'
                    }}
                >
                    Sign up
                </Typography>
                <Box
                    component="form"
                    onSubmit={submitRegister}
                    noValidate
                >
                    <StyledTextField
                        error={firstNameError}
                        helperText={firstNameErrorMessage}
                        id="firstName"
                        type="search"
                        name="firstName"
                        placeholder="John"
                        autoComplete="firstName"
                        autoFocus
                        required
                        fullWidth
                        variant="outlined"
                        color={firstNameError ? 'error' : 'primary'}
                        label="First name"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                    />
                    <StyledTextField
                        error={lastNameError}
                        helperText={lastNameErrorMessage}
                        id="lastName"
                        type="search"
                        name="lastName"
                        placeholder="Doe"
                        autoComplete="lastName"
                        required
                        fullWidth
                        variant="outlined"
                        color={lastNameError ? 'error' : 'primary'}
                        label="Last name"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                    />
                    <StyledTextField
                        error={emailError}
                        helperText={emailErrorMessage}
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
                        color={passwordError ? 'error' : 'primary'}
                        label="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <StyledTextField
                        error={confirmPasswordError}
                        helperText={confirmPasswordErrorMessage}
                        name="confirmPassword"
                        placeholder="••••••"
                        type="password"
                        id="confirmPassword"
                        autoComplete="current-password"
                        required
                        fullWidth
                        variant="outlined"
                        color={confirmPasswordError ? 'error' : 'primary'}
                        label="Confirm password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                    <StyledButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        onClick={validateInputs}
                    >
                        Sign up
                    </StyledButton>
                </Box>
            </SignupForm>
        </SignupContainer>
    );
}

export default Signup;