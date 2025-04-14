import './style/Account.scss';
import React, {useEffect, useState} from 'react';
import {
    Backdrop,
    Box,
    Button, CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography
} from "@mui/material";
import TextField from "@mui/material/TextField";
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import axios from "axios";
import {Slide, toast} from "react-toastify";
import LocalStorageHelper from "../../helpers/LocalStorageHelper.jsx";
import {useNavigate} from "react-router-dom";

function Account() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [open, setOpen] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const [openBackdrop, setOpenBackdrop] = useState(false);

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

    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Account Settings';
    }, []);

    useEffect(() => {
        if (LocalStorageHelper.IsUserLogged() === false) {
            navigate('/');
        }
    }, []);

    useEffect(() => {
        setOpenBackdrop(true);
        LocalStorageHelper.CommitRefresh();
        axios.get('api/users/csrf/token')
        .then(res => {
            axios.post(`api/users/get/${LocalStorageHelper.GetActiveUser()}`, {}, {
                headers: {
                    'Authorization': `Bearer ${LocalStorageHelper.getJwtToken()}`,
                    'X-XSRF-TOKEN': res.data.token,
                    'Content-Type': 'application/json',
                }
            }).then((res) => {
                setEmail(res.data.email);
                setFirstName(res.data.firstName);
                setLastName(res.data.lastName);
                setOpenBackdrop(false);
            }).catch(() => {
                setOpenBackdrop(false);
                toast.error('User with given identifier not found', {
                    position: "bottom-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                    theme: "light",
                    transition: Slide,
                })
            })
        }).catch(() => {
            setOpenBackdrop(false);
            toast.error('Cannot fetch token.',{
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
    }, []);


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const validateInputs = () => {

        let isValid = true;

        if (!firstName
            || !/^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i.test(firstName)) {
            setFirstNameError(true);
            setFirstNameErrorMessage('Please enter a valid first name.');
            isValid = false;
        } else {
            setFirstNameError(false);
            setFirstNameErrorMessage('');
        }

        if (!lastName
            || !/^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i.test(lastName)) {
            setLastNameError(true);
            setLastNameErrorMessage('Please enter a valid last name.');
            isValid = false;
        } else {
            setLastNameError(false);
            setLastNameErrorMessage('');
        }

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
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


    const updateUser = (event) => {
        event.preventDefault();
        if (validateInputs() === false) {
            return;
        }
        setOpenBackdrop(true);
        LocalStorageHelper.CommitRefresh();
        axios.get('api/users/csrf/token', {})
        .then((response) => {
            axios.put(`api/users/update/${LocalStorageHelper.GetActiveUser()}`, {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
            }, {
                headers: {
                    'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                    'X-XSRF-TOKEN': response.data.token,
                    'Content-Type': 'application/json',
                }
            }).then(() => {
                setOpenBackdrop(false);
                toast.success("Account info updated", {
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
                LocalStorageHelper.updateUserFirstName(firstName);
                window.dispatchEvent(new Event("storage"));
                setTimeout(() => {navigate('/')}, 2000);

            }).catch((error) => {
                setOpenBackdrop(false);
                toast.error(error.response.data.message, {
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

    const deleteUser = (event) => {
        event.preventDefault();
        if (!/^YES[\s]*$/.test(confirmText)) {
            toast.warn("Account deletion failed. Confirmation not accepted.", {
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
            return;
        }
        setOpenBackdrop(true);
        LocalStorageHelper.CommitRefresh();
        axios.get('api/users/csrf/token', {})
        .then((response) => {
            axios.delete(`api/users/delete/${LocalStorageHelper.GetActiveUser()}`, {
                headers: {
                    'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                    'X-XSRF-TOKEN': response.data.token,
                }
            }).then(() => {
                setOpenBackdrop(false);
                toast.success("Account deleted!", {
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
                LocalStorageHelper.LogoutUser();
                setTimeout(() => {navigate('/');}, 3000);
            }).catch(() => {
                setOpenBackdrop(false);
                toast.error("Account deletion failed.", {
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
            })
        })
    }

    return (
        <div className="account">
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className="page-info">
                <h5>Account Settings</h5>
            </div>
            <div className="account-info">
                <div className="info-edit">
                    <Typography
                        component="h1"
                        variant="h5"
                        sx={{
                            width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', color: 'black'
                            , margin: '0 auto 5% auto'
                        }}
                    >
                        Edit account details
                    </Typography>
                    <Box

                    >
                        <TextField
                            size={"small"}
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
                            size={"small"}
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
                            size={"small"}
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
                            size={"small"}
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
                            size={"small"}
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
                            endIcon={<UpdateOutlinedIcon />}
                            onClick={updateUser}
                            sx={{
                                width: '70%',
                                backgroundColor: 'rgb(39, 99, 24)',
                                "&:hover": {backgroundColor: 'rgb(49,140,23)'}
                            }}
                        >
                            Update Account
                        </Button>
                    </Box>
                </div>
                <div className={"account-deletion"}>
                    <Typography
                        component="h1"
                        variant="h5"
                        sx={{
                            width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', color: 'black'
                            , margin: '0 auto 5% auto'
                        }}
                    >
                        Delete Your Account
                    </Typography>
                    <Box
                        sx={{width:'100%'}}
                    >
                        <React.Fragment>
                            <Button
                                className="signup-btn"
                                type="submit"
                                fullWidth
                                variant="contained"
                                endIcon={<DeleteForeverOutlinedIcon />}
                                onClick={handleClickOpen}
                                sx={{
                                    width: '70%',
                                    backgroundColor: 'rgb(159,20,20)',
                                    "&:hover": {backgroundColor: 'rgb(193,56,56)'},
                                    "&:focus": {outline: 'none !important'},
                                }}
                            >
                                Delete Account
                            </Button>
                            <Dialog
                                open={open}
                                onClose={handleClose}
                            >
                                <DialogTitle>Delete Account</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        Do you want to delete Your account?
                                        If yes, type &quot;YES&quot; inside the field.
                                    </DialogContentText>
                                    <TextField
                                        autoFocus
                                        required
                                        value={confirmText}
                                        onChange={e => setConfirmText(e.target.value)}
                                        margin="dense"
                                        id="confirm"
                                        name="email"
                                        label="Confirm deletion"
                                        type="email"
                                        fullWidth
                                        variant="standard"
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        variant="contained"
                                        onClick={handleClose}
                                        sx={{
                                            backgroundColor: 'rgb(11,108,128)',
                                            "&:hover": {backgroundColor: 'rgb(16,147,177)'},
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={deleteUser}
                                        sx={{
                                            backgroundColor: 'rgb(159,20,20)',
                                            "&:hover": {backgroundColor: 'rgb(193,56,56)'},
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </React.Fragment>

                    </Box>
                </div>
            </div>
        </div>
    );
}

export default Account;