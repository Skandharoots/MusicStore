import {Backdrop, Button, CircularProgress, Typography, Box, styled} from "@mui/material";
import TextField from "@mui/material/TextField";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Slide, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";

const ManufacturerUpdateContainer = styled(Box)(({theme}) => ({
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '80dvh',
    width: '796px',
    borderLeft: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
}));

const ManufacturerUpdateForm = styled(Box)(({theme}) => ({
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
                theme: "light",
                transition: Slide,
            });
        })
    }, [id.id])

    const validateInputs = () => {
        let isValid = true;

        if (!manufacturerName || !/^[A-Z][A-Za-z ']{1,49}/i.test(manufacturerName)) {
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
        LocalStorageHelper.CommitRefresh();
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
                    setOpenBackdrop(false);
                    toast.success("Manufacturer updated!", {
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
                    navigate('/admin/manufacturer');
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
                theme: "light",
                transition: Slide,
            });
        });
    }

    return (
        <ManufacturerUpdateContainer>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            
            <ManufacturerUpdateForm>
                <Typography
                    component="h1"
                    variant="h5"
                    sx={{
                        width: '100%',
                        fontSize: 'clamp(2rem, 10vw, 2.15rem)',
                        margin: '0 auto 5% auto'
                    }}
                >
                    Update manufacturer
                </Typography>
                
                <Box
                    component="form"
                    onSubmit={updateManufacturer}
                    noValidate
                >
                    <StyledTextField
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
                    />
                    
                    <StyledTextField
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
                    />
                    
                    <UpdateButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        onClick={validateInputs}
                    >
                        Update Manufacturer
                    </UpdateButton>
                </Box>
            </ManufacturerUpdateForm>
        </ManufacturerUpdateContainer>
    )
}

export default UpdateManufacturer;