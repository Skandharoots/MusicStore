import './style/Account.scss';
import React, {useEffect, useState} from 'react';
import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Typography,
    styled
} from "@mui/material";
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import axios from "axios";
import {Slide, toast} from "react-toastify";
import LocalStorageHelper from "../../helpers/LocalStorageHelper.jsx";
import {useNavigate} from "react-router-dom";

const AccountContainer = styled(Box)(({theme}) => ({
    height: 'fit-content',
    minHeight: '80dvh',
    width: '780px',
    color: theme.palette.text.primary,
    borderLeft: `1px solid ${theme.palette.divider}`,
}));

const PageInfo = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    fontSize: '20px',
    padding: '16px 16px',
    borderBottom: `1px solid ${theme.palette.divider}`,
}));

const AccountInfo = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
}));

const InfoEdit = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: '400px',
    margin: '16px',
    borderRadius: '1em',
    boxShadow: '0 5px 15px ' + theme.palette.formShadow.main,
    padding: '2%',
}));

const AccountDeletion = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: '400px',
    margin: '16px',
    borderRadius: '1em',
    boxShadow: '0 5px 15px ' + theme.palette.formShadow.main,
    padding: '2%',
}));

const StyledTextField = styled(TextField)(({theme}) => ({
    width: '70%',
    margin: '0 auto 5% auto',
    '& label.Mui-focused': {
        color: theme.palette.primary.main,
    },
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
        },
    },
}));

const StyledButton = styled(Button)(({theme}) => ({
    width: '70%',
    minWidth: '0',
    color: theme.palette.mybutton.colorTwo,
    backgroundColor: theme.palette.irish.main,
    '&:hover': {
        backgroundColor: theme.palette.irish.light,
    },
}));

const DeleteButton = styled(Button)(({theme}) => ({
    width: '70%',
    minWidth: '0',
    color: theme.palette.mybutton.colorTwo,
    backgroundColor: theme.palette.errorBtn.main,
    '&:hover': {
        backgroundColor: theme.palette.errorBtn.light,
    },
    '&:focus': {
        outline: 'none !important',
    },
}));

function Account() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [open, setOpen] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [currentPasswordError, setCurrentPasswordError] = useState(false);
    const [currentPasswordErrorMsg, setCurrentPasswordErrorMsg] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [newPasswordError, setNewPasswordError] = useState(false);
    const [newPasswordErrorMsg, setNewPasswordErrorMsg] = useState('');
    const [confirmNewPasswordError, setConfirmNewPasswordError] = useState(false);
    const [confirmNewPasswordErrorMsg, setConfirmNewPasswordErrorMsg] = useState('');
    const [hideChangePassword, setHideChangePassword] = useState(true);

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

    const validateNewPassword = () => {

        let isValid = true;

        if (!(confirmNewPassword === newPassword)) {
            setConfirmNewPasswordError(true);
            setConfirmNewPasswordErrorMsg('Passwords do not match.');
            isValid = false;
        } else {
            setConfirmNewPasswordError(false);
            setConfirmNewPasswordErrorMsg('');
        }

        if (!newPassword || newPassword.length < 6 || newPassword.length > 50) {
            setNewPasswordError(true);
            setNewPasswordErrorMsg('Password must be at least 6 and max 50 characters long.');
            isValid = false;
        }  else if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#&()–\[{}\]:;',?/*~$^+=<>]).{6,50}$/.test(newPassword)) {
            setNewPasswordError(true);
            setNewPasswordErrorMsg('Password must contain one lower and upper case letter, one number and one special character.');
            isValid = false;
        } else {
            setNewPasswordError(false);
            setNewPasswordErrorMsg('');
        }

        return isValid;

    }

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

    const enablePassChange = () => {
        setHideChangePassword(false);
    }

    const updatePassword = (e) => {
        e.preventDefault();
        if (!validateNewPassword()) {
            return;
        }
        setOpenBackdrop(true);
        LocalStorageHelper.CommitRefresh();

        axios.get('api/users/csrf/token', {})
            .then(res => {
                axios.put('api/users/password/settings/reset', {
                        current: currentPassword,
                        password: newPassword,
                        passwordConfirmation: confirmNewPassword,
                    }, {
                        headers: {
                            'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                            'X-XSRF-TOKEN': res.data.token,
                        }
                    }).then((resp) => {
                        setCurrentPasswordError(false); 
                        setCurrentPasswordErrorMsg('');
                        setNewPasswordError(false);
                        setNewPasswordErrorMsg('');
                        setConfirmNewPasswordError(false);
                        setConfirmNewPasswordErrorMsg('');
                        setOpenBackdrop(false);
                        toast.success("Password updated.", {
                            position: "bottom-center",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: false,
                            progress: undefined,
                            theme: "light",
                            transition: Slide,
                        })
                    }).catch(e => {
                        if (e.response.data.current) {
                            setCurrentPasswordError(true); 
                            setCurrentPasswordErrorMsg(e.response.data.current);
                        }
                        if (e.response.data.password) {
                            setNewPasswordError(true);
                            setNewPasswordErrorMsg(e.response.data.password);
                        }
                        if (e.response.data.passwordConfirmaiton) {
                            setConfirmNewPasswordError(true);
                            setConfirmNewPasswordErrorMsg(e.response.data.passwordConfirmaiton);
                        }
                        if (e.response.data.message) {
                            toast.error(e.response.data.message, {
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
                        }
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
                })
            });

    }

    return (
        <AccountContainer>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <PageInfo>
                <Typography variant="h5">Account Settings</Typography>
            </PageInfo>
            <AccountInfo>
                <InfoEdit>
                    <Typography
                        component="h1"
                        variant="h5"
                        sx={{
                            width: '100%',
                            fontSize: 'clamp(2rem, 10vw, 2.15rem)',
                            margin: '0 auto 5% auto'
                        }}
                    >
                        Edit account details
                    </Typography>
                    <Box>
                        <StyledTextField
                            size="small"
                            error={firstNameError}
                            helperText={firstNameErrorMessage}
                            id="firstName"
                            type="text"
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
                            size="small"
                            error={lastNameError}
                            helperText={lastNameErrorMessage}
                            id="lastName"
                            type="text"
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
                            size="small"
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
                            size="small"
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
                        />
                        <StyledTextField
                            size="small"
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
                        />
                        <StyledButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            endIcon={<UpdateOutlinedIcon />}
                            onClick={updateUser}
                        >
                            Update Account
                        </StyledButton>
                    </Box>
                </InfoEdit>
                <InfoEdit>
                    <Typography
                        component="h1"
                        variant="h5"
                        sx={{
                            width: '100%',
                            fontSize: 'clamp(2rem, 10vw, 2.15rem)',
                            margin: '0 auto 5% auto'
                        }}
                    >
                        Change password
                    </Typography>
                    <Box sx={{width: '100%'}}>
                        {!hideChangePassword && (
                            <>
                                <StyledTextField
                                    size="small"
                                    error={currentPasswordError}
                                    helperText={currentPasswordErrorMsg}
                                    id="currentPass"
                                    type="password"
                                    name="currentPassword"
                                    placeholder="••••••"
                                    autoComplete="currentPassword"
                                    autoFocus
                                    required
                                    fullWidth
                                    variant="outlined"
                                    color={currentPasswordError ? 'error' : 'primary'}
                                    label="Current password"
                                    value={currentPassword}
                                    onChange={e => setCurrentPassword(e.target.value)}
                                />
                                <StyledTextField
                                    size="small"
                                    error={newPasswordError}
                                    helperText={newPasswordErrorMsg}
                                    id="newPassword"
                                    type="password"
                                    name="newPassword"
                                    placeholder="••••••"
                                    autoComplete="newPassword"
                                    required
                                    fullWidth
                                    variant="outlined"
                                    color={newPasswordError ? 'error' : 'primary'}
                                    label="New password"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                />
                                <StyledTextField
                                    size="small"
                                    error={confirmNewPasswordError}
                                    helperText={confirmNewPasswordErrorMsg}
                                    id="confirmNewPassword"
                                    type="password"
                                    name="confirmNewPassword"
                                    placeholder="••••••"
                                    autoComplete="confirmNewPassword"
                                    required
                                    fullWidth
                                    variant="outlined"
                                    color={confirmNewPasswordError ? 'error' : 'primary'}
                                    label="Confirm new password"
                                    value={confirmNewPassword}
                                    onChange={e => setConfirmNewPassword(e.target.value)}
                                />
                            </>
                        )}
                        {hideChangePassword && 
                            <StyledButton
                                fullWidth
                                type="button"
                                variant="contained"
                                endIcon={<UpdateOutlinedIcon />}
                                onClick={enablePassChange}
                            >
                                Enable
                            </StyledButton>
                        }
                        {!hideChangePassword && 
                            <StyledButton
                                fullWidth
                                type="submit"
                                variant="contained"
                                endIcon={<UpdateOutlinedIcon />}
                                onClick={updatePassword}
                            >
                                Change password
                            </StyledButton>
                        }
                    </Box>
                </InfoEdit>
                <AccountDeletion>
                    <Typography
                        component="h1"
                        variant="h5"
                        sx={{
                            width: '100%',
                            fontSize: 'clamp(2rem, 10vw, 2.15rem)',
                            margin: '0 auto 5% auto'
                        }}
                    >
                        Delete Your Account
                    </Typography>
                    <Box sx={{width: '100%'}}>
                        <DeleteButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            endIcon={<DeleteForeverOutlinedIcon />}
                            onClick={handleClickOpen}
                        >
                            Delete Account
                        </DeleteButton>
                        <Dialog
                            open={open}
                            onClose={handleClose}
                        >
                            <DialogTitle>Delete Account</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Do you want to delete Your account?
                                    If yes, type "YES" inside the field.
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
                                        color: 'white',
                                        '&:hover': {backgroundColor: 'rgb(16,147,177)'},
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={deleteUser}
                                    sx={{
                                        backgroundColor: 'rgb(159,20,20)',
                                        color: 'white',
                                        '&:hover': {backgroundColor: 'rgb(193,56,56)'},
                                    }}
                                >
                                    Delete
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                </AccountDeletion>
            </AccountInfo>
        </AccountContainer>
    );
}

export default Account;