import React from "react";
import './style/Login.scss';
import TextField from '@mui/material/TextField';
import {useState} from "react";
import {Box, Button, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import axios from "axios";


function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');

    const validateInputs = () => {

        let isValid = true;

        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!password.value || password.value.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        return isValid;
    };


    const submitLogin = async (event) => {
        event.preventDefault();

        await axios.get('api/users/csrf/token', {})
            .then((response) => {
                const headers = {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': response.data.token,
                }
                console.log(headers);
                // axios.post("api/users/login",
                //     {
                //         email: email,
                //         password: password,
                //     },
            })
            .catch((error) => console.log(error));


    }

    return (
        <div className="Login">
            <div className="FormTitle">
                <Typography
                    component="h1"
                    variant="h5"
                    sx={{
                        width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', color: 'black'
                        , margin: '0 auto 5% auto'
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
                            width: '100%',
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
                        autoFocus
                        required
                        fullWidth
                        variant="outlined"
                        label="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        sx={{
                            width: '100%',
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
                            backgroundColor: 'rgb(39, 99, 24)',
                            "&:hover": {backgroundColor: 'rgb(49,140,23)'}
                        }}
                    >
                        Sign in
                    </Button>
                    <Typography sx={{ textAlign: 'right', margin: '5% 0 0 0'  }}>
                        Don&apos;t have an account?{' '}
                        <span>
                        <Link
                            to="/sign-up"
                            variant="body2"
                            sx={{ alignSelf: 'right', width: '100%'}}
                        >
                          Sign up
                        </Link>
                      </span>
                    </Typography>
                </Box>
            </div>
        </div>
    )
}

export default Login;