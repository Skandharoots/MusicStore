import React, {useEffect, useState} from "react";
import './style/Signup.scss';
import { Alert, AlertTitle } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import {Bounce, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.css';
import TextField from '@mui/material/TextField';
import {Box, Button, Typography} from "@mui/material";
import axios from "axios";

function Signup() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [showSuccessMsg, setShowSuccessMsg] = React.useState('none');
    const [showErrorMsg, setShowErrorMsg] = React.useState('none');
    const [registerErrorMsg, setRegisterErrorMsg] = React.useState('');

    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [confirmPasswordError, setConfirmPasswordError] = React.useState(false);
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = React.useState('');
    const [firstNameError, setFirstNameError] = React.useState(false);
    const [firstNameErrorMessage, setFirstNameErrorMessage] = React.useState('');
    const [lastNameError, setLastNameError] = React.useState(false);
    const [lastNameErrorMessage, setLastNameErrorMessage] = React.useState('');

    useEffect(() => {
        document.title = 'Sign up';
    }, []);

    const validateInputs = () => {

        let isValid = true;

        if (!firstName
            || !/^(?=.{1,50}$)[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]+(?:[-'_.\s][A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]+)*$/i.test(firstName)) {
            setFirstNameError(true);
            setFirstNameErrorMessage('Please enter a valid first name.');
            isValid = false;
        } else {
            setFirstNameError(false);
            setFirstNameErrorMessage('');
        }

        if (!lastName
            || !/^(?=.{1,50}$)[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]+(?:[-'_.\s][A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]+)*$/i.test(lastName)) {
            setLastNameError(true);
            setLastNameErrorMessage('Please enter a valid last name.');
            isValid = false;
        } else {
            setLastNameError(false);
            setLastNameErrorMessage('');
        }

        if (!email || !/(?![^"]+.*[^"]+\\.\\.)[a-zA-Z0-9 !#"$%&'*+-/=?^_`{|}~]*[a-zA-Z0-9"]+@[a-zA-Z0-9.-]+$/s.test(email)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!password || password.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters and max 20 long.');
            isValid = false;
        } else if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#&()–\[{}\]:;',?/*~$^+=<>]).{6,20}$/.test(password)) {
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
                }).catch((error) => {
                    setRegisterErrorMsg(error.response.data.message);
                    setShowErrorMsg('flex');
            })
        }).catch(() => {
            toast.error("Cannot fetch token", {
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

    }

    return (
        <div className="Signup">
            <div className="SignupForm">
                <Typography
                    component="h1"
                    variant="h5"
                    sx={{
                        width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', color: 'black'
                        , margin: '0 auto 5% auto'
                    }}
                >
                    Sign up
                </Typography>
                <Box
                    component="form"
                    onSubmit={submitRegister}
                    noValidate

                >
                    <TextField
                        error={firstNameError}
                        helperText={firstNameErrorMessage}
                        id="firstName"
                        type="email"
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
                        error={lastNameError}
                        helperText={lastNameErrorMessage}
                        id="lastName"
                        type="email"
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
                    <TextField
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
                        label="Confirm password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
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
                        className="signup-btn"
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
                        Sign up
                    </Button>
                </Box>
            </div>
            <Alert variant='filled'
                   severity="success"
                   icon={<CheckIcon fontSize='inherit' />}
                   sx={{
                       display: showSuccessMsg,
                       width: 'fit-content',
                       margin: '5% auto 0 auto',
                   }}>
                <AlertTitle>Success</AlertTitle>
                Registration successful, please check your email to verify your account.
            </Alert>
            <Alert variant='filled'
                   severity='error'
                   onClose={() => setShowErrorMsg('none')}
                   sx={{
                       display: showErrorMsg,
                       width: 'fit-content',
                       margin: '5% auto 0 auto',
                   }}>
                <AlertTitle>Error, {registerErrorMsg}</AlertTitle>
            </Alert>
        </div>
    )

}

export default Signup;