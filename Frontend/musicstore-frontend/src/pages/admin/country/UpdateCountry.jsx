import {Box, Button, Typography} from "@mui/material";
import TextField from "@mui/material/TextField";
// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Bounce, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";
import '../style/UpdateCountry.scss';


function UpdateCountry() {

    const id = useParams();

    const [countryName, setCountryName] = useState('');
    const [countryNameError, setCountryNameError] = useState(false);
    const [countryNameErrorMsg, setCountryNameErrorMsg] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Edit Country';
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
                theme: "colored",
                transition: Bounce,
            });
        })
    }, [id.id])

    const validateInputs = () => {

        let isValid = true;

        if (!countryName
            || !/^[A-Z][A-Za-z ']{1,49}/i.test(countryName)) {
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

        axios.get('api/users/csrf/token', {})
            .then((response) => {
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
                    toast.success("Country updated!", {
                        position: "bottom-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                        progress: undefined,
                        theme: "colored",
                        transition: Bounce,
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
                        theme: "colored",
                        transition: Bounce,
                    });
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
        });

    }

    return (
        <div className="CountryUpdate">
            <div className="CountryUpdateForm">
                <Typography
                    component="h1"
                    variant="h5"
                    sx={{
                        width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', color: 'black'
                        , margin: '0 auto 5% auto'
                    }}
                >
                    Update country
                </Typography>
                <Box
                    component="form"
                    onSubmit={updateCountry}
                    noValidate

                >
                    <TextField
                        id="countryId"
                        type="email"
                        name="countryId"
                        autoComplete="id"
                        required
                        fullWidth
                        variant="outlined"
                        label="Country Id"
                        value={id.id}
                        disabled={true}
                        sx={{
                            width: '70%',
                            margin: '0 auto 5% auto',
                        }}
                    />
                    <TextField
                        error={countryNameError}
                        helperText={countryNameErrorMsg}
                        id="countryName"
                        type="email"
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
                        className="add-btn"
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
                        Update Country
                    </Button>
                </Box>
            </div>
        </div>
    )
}

export default UpdateCountry;