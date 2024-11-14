import {Backdrop, Box, Button, CircularProgress, Typography} from "@mui/material";
import TextField from "@mui/material/TextField";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Bounce, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";
import '../style/UpdateManufacturer.scss';


function UpdateManufacturer() {

    const id = useParams();

    const [manufacturerName, setManufacturerName] = useState('');
    const [manufacturerNameError, setManufacturerNameError] = useState(false);
    const [manufacturerNameErrorMsg, setManufacturerNameErrorMsg] = useState('');
    const [openBackdrop, setOpenBackdrop] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Edit Manufacturer';
    }, []);

    useEffect(() => {
        if (LocalStorageHelper.IsUserLogged() === false || LocalStorageHelper.isUserAdmin() === false) {
            navigate('/');
        }
    }, []);

    useEffect(() => {
        axios.get(`api/products/manufacturers/get/${id.id}`, {})
            .then(res => {
                setManufacturerName(res.data.name);
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

    const updateManufacturer = (event) => {
        event.preventDefault();
        if (validateInputs() === false) {
            return;
        }

        axios.get('api/users/csrf/token', {})
            .then((response) => {
                setOpenBackdrop(true);
                axios.put(`api/products/manufacturers/update/${id.id}`, {
                        name: manufacturerName,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-XSRF-TOKEN': response.data.token,
                            'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                        }
                    }).then(() => {
                        setTimeout(() => {setOpenBackdrop(false)}, 500);
                        toast.success("Manufacturer updated!", {
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
                    setTimeout(() => {setOpenBackdrop(false)}, 500);
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
        <div className="ManufacturerUpdate">
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className="ManufacturerUpdateForm">
                <Typography
                    component="h1"
                    variant="h5"
                    sx={{
                        width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', color: 'black'
                        , margin: '0 auto 5% auto'
                    }}
                >
                    Update manufacturer
                </Typography>
                <Box
                    component="form"
                    onSubmit={updateManufacturer}
                    noValidate

                >
                    <TextField
                        id="manufacturerId"
                        type="search"
                        name="manufacturerId"
                        autoComplete="id"
                        required
                        fullWidth
                        variant="outlined"
                        label="Manufacturer Id"
                        value={id.id}
                        disabled={true}
                        sx={{
                            width: '70%',
                            margin: '0 auto 5% auto',
                        }}
                    />
                    <TextField
                        error={manufacturerNameError}
                        helperText={manufacturerNameErrorMsg}
                        id="manufacturerName"
                        type="search"
                        name="manufacturerName"
                        placeholder="Manufacturer"
                        autoComplete="manufacturerName"
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
                        Update Manufacturer
                    </Button>
                </Box>
            </div>
        </div>
    )
}

export default UpdateManufacturer;