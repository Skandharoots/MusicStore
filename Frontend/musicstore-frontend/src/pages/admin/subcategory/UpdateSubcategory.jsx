import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    TextField,
    Typography,
    styled
} from "@mui/material";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Slide, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";

const SubcategoryUpdateContainer = styled(Box)(({theme}) => ({
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '80dvh',
    width: '796px',
    borderLeft: '1px solid ' + theme.palette.divider,
}));

const SubcategoryUpdateForm = styled(Box)(({theme}) => ({
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
        color: theme.palette.irish.main,
    },
    "& .MuiOutlinedInput-root": {
        "&.Mui-focused fieldset": {
            borderColor: theme.palette.irish.main,
        }
    }
}));

const UpdateButton = styled(Button)(({theme}) => ({
    width: '70%',
    backgroundColor: theme.palette.irish.main,
    color: theme.palette.mybutton.colorTwo,
    "&:hover": {backgroundColor: theme.palette.irish.light},
}));

function UpdateSubcategory() {
    const id = useParams();
    const [subcategoryName, setSubcategoryName] = useState('');
    const [subcategoryNameError, setSubcategoryNameError] = useState(false);
    const [subcategoryNameErrorMsg, setSubcategoryNameErrorMsg] = useState('');
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Edit Subcategory';
    }, []);

    useEffect(() => {
        if (LocalStorageHelper.IsUserLogged() === false || LocalStorageHelper.isUserAdmin() === false) {
            navigate('/');
        }
    }, []);

    useEffect(() => {
        axios.get(`api/products/subcategories/get/${id.id}`, {})
            .then(res => {
                setSubcategoryName(res.data.name);
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
    }, [])

    const validateInputs = () => {
        let isValid = true;

        if (!subcategoryName
            || !/^[A-Z][A-Za-z '\-]{1,49}/i.test(subcategoryName)) {
            setSubcategoryNameError(true);
            setSubcategoryNameErrorMsg('Please enter a valid subcategory name. Must be from 2 to 50 characters long.' +
                ' Must start with a capital letter, can contain lowercase' +
                ' letters, spaces and special characters \'-');
            isValid = false;
        } else {
            setSubcategoryNameError(false);
            setSubcategoryNameErrorMsg('');
        }

        return isValid;
    };

    const updateSubcategory = (event) => {
        event.preventDefault();
        if (validateInputs() === false) {
            return;
        }
        LocalStorageHelper.CommitRefresh();
        axios.get('api/users/csrf/token', {})
            .then((response) => {
                setOpenBackdrop(true);
                axios.put(`api/products/subcategories/update/${id.id}`, {
                        name: subcategoryName,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-XSRF-TOKEN': response.data.token,
                            'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                        }
                    }).then(() => {
                    setOpenBackdrop(false);
                    toast.success("Subcategory updated!", {
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
                    navigate('/admin/subcategory');
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
        <SubcategoryUpdateContainer>
            <Backdrop
                sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
                open={openBackdrop}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>

            <SubcategoryUpdateForm>
                <Typography
                    component="h1"
                    variant="h5"
                    sx={{
                        width: '100%',
                        fontSize: 'clamp(2rem, 10vw, 2.15rem)',
                        color: theme => theme.palette.text.primary,
                        margin: '0 auto 5% auto'
                    }}
                >
                    Update subcategory
                </Typography>

                <Box component="form" onSubmit={updateSubcategory} noValidate>
                    <StyledTextField
                        id="subcategoryId"
                        type="search"
                        name="subcategoryId"
                        autoComplete="id"
                        required
                        fullWidth
                        size="small"
                        variant="outlined"
                        label="Subcategory Id"
                        value={id.id}
                        disabled={true}
                    />

                    <StyledTextField
                        error={subcategoryNameError}
                        helperText={subcategoryNameErrorMsg}
                        id="subcategoryName"
                        type="search"
                        name="subcategoryName"
                        placeholder="Subcategory"
                        autoComplete="subcategoryName"
                        required
                        fullWidth
                        size="small"
                        variant="outlined"
                        color={subcategoryNameError ? 'error' : 'primary'}
                        label="Subcategory"
                        value={subcategoryName}
                        onChange={e => setSubcategoryName(e.target.value)}
                    />

                    <UpdateButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        onClick={validateInputs}
                    >
                        Update Subcategory
                    </UpdateButton>
                </Box>
            </SubcategoryUpdateForm>
        </SubcategoryUpdateContainer>
    );
}

export default UpdateSubcategory;