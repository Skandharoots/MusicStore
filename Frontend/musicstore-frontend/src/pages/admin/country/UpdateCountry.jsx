import {Backdrop, Button, CircularProgress, Typography, Box, styled} from "@mui/material";
import TextField from "@mui/material/TextField";
// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Slide, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";
import '../style/UpdateCountry.scss';

const CountryUpdateContainer = styled(Box)(({theme}) => ({
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '80dvh',
    width: '796px',
    borderLeft: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
}));

const CountryUpdateForm = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyItems: 'center',
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: '400px',
    minWidth: '200px',
    margin: '5% 20%',
    borderRadius: '1em',
    boxShadow: '0 5px 15px ' + theme.palette.formShadow.main,
    padding: '2%',
}));

const StyledTextField = styled(TextField)(({theme}) => ({
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

const UpdateButton = styled(Button)(({theme}) => ({
    width: '70%',
    backgroundColor: 'rgb(39, 99, 24)',
    color: theme.palette.mybutton.colorTwo,
    "&:hover": {
        backgroundColor: 'rgb(49,140,23)'
    }
}));

function UpdateCountry() {
    const id = useParams();
    const [countryName, setCountryName] = useState('');
    const [countryNameError, setCountryNameError] = useState(false);
    const [countryNameErrorMsg, setCountryNameErrorMsg] = useState('');
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Edit Country';
    }, []);

    useEffect(() => {
        if (LocalStorageHelper.IsUserLogged() === false || LocalStorageHelper.isUserAdmin() === false) {
            navigate('/');
        }
    }, []);

    useEffect(() => {
        axios.get(`api/products/countries/get/${id.id}`, {})
            .then(res => {
                setCountryName(res.data.name);
            }).catch(error => {
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
        })
    }, [id.id])

    const validateInputs = () => {
        let isValid = true;

        if (!countryName || !/^[A-Z][A-Za-z ']{1,49}/i.test(countryName)) {
            setCountryNameError(true);
            setCountryNameErrorMsg('Please enter a valid country name.');
            isValid = false;
        } else {
            setCountryNameError(false);
            setCountryNameErrorMsg('');
        }

        return isValid;
    };

    const updateCountry = (event) => {
        event.preventDefault();
        if (validateInputs() === false) {
            return;
        }
        LocalStorageHelper.CommitRefresh();
        axios.get('api/users/csrf/token', {})
            .then((response) => {
                setOpenBackdrop(true);
                axios.put(`api/products/countries/update/${id.id}`, {
                        name: countryName,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-XSRF-TOKEN': response.data.token,
                            'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                        }
                    }).then(() => {
                    setOpenBackdrop(false);
                    toast.success("Country updated!", {
                        position: "bottom-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                        progress: undefined,
                        theme: "light",
                        transition: Slide,
                    });
                    navigate('/admin/country');
                }).catch((error) => {
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
        });
    }

    return (
        <CountryUpdateContainer>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            
            <CountryUpdateForm>
                <Typography
                    component="h1"
                    variant="h5"
                    sx={{
                        width: '100%',
                        fontSize: 'clamp(2rem, 10vw, 2.15rem)',
                        margin: '0 auto 5% auto'
                    }}
                >
                    Update country
                </Typography>
                
                <Box
                    component="form"
                    onSubmit={updateCountry}
                    noValidate
                >
                    <StyledTextField
                        id="countryId"
                        type="search"
                        name="countryId"
                        autoComplete="id"
                        required
                        fullWidth
                        variant="outlined"
                        label="Country Id"
                        value={id.id}
                        disabled={true}
                    />
                    
                    <StyledTextField
                        error={countryNameError}
                        helperText={countryNameErrorMsg}
                        id="countryName"
                        type="search"
                        name="countryName"
                        placeholder="Country"
                        autoComplete="countryName"
                        required
                        fullWidth
                        variant="outlined"
                        color={countryNameError ? 'error' : 'primary'}
                        label="Country"
                        value={countryName}
                        onChange={e => setCountryName(e.target.value)}
                    />
                    
                    <UpdateButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        onClick={validateInputs}
                    >
                        Update Country
                    </UpdateButton>
                </Box>
            </CountryUpdateForm>
        </CountryUpdateContainer>
    )
}

export default UpdateCountry;