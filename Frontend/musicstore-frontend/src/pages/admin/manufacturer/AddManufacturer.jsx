import {Box, Button, Typography} from "@mui/material";
import TextField from "@mui/material/TextField";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import '../style/AddManufacturer.scss';
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";
import {Bounce, toast} from "react-toastify";


function AddManufacturer() {

    const [manufacturerName, setManufacturerName] = useState('');
    const [manufacturerNameError, setManufacturerNameError] = useState(false);
    const [manufacturerNameErrorMsg, setManufacturerNameErrorMsg] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Add Manufacturer';
    }, []);

    useEffect(() => {
        if (LocalStorageHelper.IsUserLogged() === false || LocalStorageHelper.isUserAdmin() === false) {
            navigate('/');
        }
    }, []);


    const validateInputs = () => {

        let isValid = true;

        if (!manufacturerName
            || !/^[A-Z][A-Za-z ']{1,49}/i.test(manufacturerName)) {
            setManufacturerNameError(true);
            setManufacturerNameErrorMsg('Please enter a valid manufacturer name.');
            isValid = false;
        } else {
            setManufacturerNameError(false);
            setManufacturerNameErrorMsg('');
        }

        return isValid;
    };

    const submitManufacturer = (event) => {
        event.preventDefault();
        if (validateInputs() === false) {
            return;
        }

        axios.get('api/users/csrf/token', {})
            .then((response) => {
                axios.post('api/products/manufacturers/create',
                    {
                        name: manufacturerName,
                    },
                    {
                        headers: {
                            'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                            'X-XSRF-TOKEN': response.data.token,
                            'Content-Type': 'application/json',
                        }
                    }).then(() => {
                    toast.success('Manufacturer Added!', {
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
                    navigate('/admin/manufacturer');
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
        <div className="ManufacturerAdd">
            <div className="AddManForm">
                <Typography
                    component="h1"
                    variant="h5"
                    sx={{
                        width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', color: 'black'
                        , margin: '0 auto 5% auto'
                    }}
                >
                    Add manufacturer
                </Typography>
                <Box
                    component="form"
                    onSubmit={submitManufacturer}
                    noValidate

                >

                    <TextField
                        error={manufacturerNameError}
                        helperText={manufacturerNameErrorMsg}
                        id="manufacturerName"
                        type="email"
                        name="manufacturerName"
                        placeholder="Manufacturer"
                        autoComplete="manufacturerName"
                        autoFocus
                        required
                        fullWidth
                        variant="outlined"
                        color={manufacturerNameError ? 'error' : 'primary'}
                        label="Manufacturer"
                        value={manufacturerName}
                        onChange={e => setManufacturerName(e.target.value)}
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
                        Add Manufacturer
                    </Button>
                </Box>
            </div>
        </div>
    )
}

export default AddManufacturer;