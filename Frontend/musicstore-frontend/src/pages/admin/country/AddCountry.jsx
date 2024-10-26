import {Box, Button, Typography} from "@mui/material";
import TextField from "@mui/material/TextField";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import '../style/AddCountry.scss';
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";
import {Bounce, toast} from "react-toastify";


function AddCountry() {

    const [countryName, setCountryName] = useState('');
    const [countryNameError, setCountryNameError] = useState(false);
    const [countryNameErrorMsg, setCountryNameErrorMsg] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Add Country';
    }, []);

    useEffect(() => {
        if (LocalStorageHelper.IsUserLogged() === false || LocalStorageHelper.isUserAdmin() === false) {
            navigate('/');
        }
    }, []);


    const validateInputs = () => {

        let isValid = true;

        if (!countryName
            || !/^[A-Z][A-Z 'a-z]+$/i.test(countryName)) {
            setCountryNameError(true);
            setCountryNameErrorMsg('Please enter a valid country name.');
            isValid = false;
        } else {
            setCountryNameError(false);
            setCountryNameErrorMsg('');
        }

        return isValid;
    };

    const submitCountry = (event) => {
        event.preventDefault();
        if (validateInputs() === false) {
            return;
        }

        axios.get('api/users/csrf/token', {})
            .then((response) => {
                axios.post('api/products/countries/create',
                    {
                        name: countryName,
                    },
                    {
                        headers: {
                            'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                            'X-XSRF-TOKEN': response.data.token,
                            'Content-Type': 'application/json',
                        }
                    }).then(() => {
                    toast.success('Country Added!', {
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
        <div className="CountryAdd">
            <div className="AddCountForm">
                <Typography
                    component="h1"
                    variant="h5"
                    sx={{
                        width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', color: 'black'
                        , margin: '0 auto 5% auto'
                    }}
                >
                    Add country
                </Typography>
                <Box
                    component="form"
                    onSubmit={submitCountry}
                    noValidate

                >

                    <TextField
                        error={countryNameError}
                        helperText={countryNameErrorMsg}
                        id="countryName"
                        type="email"
                        name="countryName"
                        placeholder="Fender"
                        autoComplete="countryName"
                        autoFocus
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
                        Add Country
                    </Button>
                </Box>
            </div>
        </div>
    )
}

export default AddCountry;