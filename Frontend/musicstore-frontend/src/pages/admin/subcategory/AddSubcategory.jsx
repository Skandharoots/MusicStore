import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    styled
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";
import {Slide, toast} from "react-toastify";

const SubcategoryAddContainer = styled(Box)(({theme}) => ({
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '80dvh',
    width: '796px',
    borderLeft: '1px solid ' + theme.palette.divider,
}));

const AddSubcategoryForm = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: '400px',
    minWidth: '200px',
    margin: '5% 20%',
    borderRadius: '1em',
    boxShadow: '0 5px 15px ' + theme.palette.formShadow.main,
    padding: '2%',
}));

const StyledFormControl = styled(FormControl)(({theme}) => ({
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

const AddButton = styled(Button)(({theme}) => ({
    width: '70%',
    backgroundColor: theme.palette.irish.main,
    color: theme.palette.mybutton.colorTwo,
    "&:hover": {backgroundColor: theme.palette.irish.light},
}));

function AddSubcategory() {
    const [subcategoryName, setSubcategoryName] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectCategoryId, setSelectCategoryId] = useState('');
    const [subcategoryNameError, setSubcategoryNameError] = useState(false);
    const [subcategoryNameErrorMsg, setSubcategoryNameErrorMsg] = useState('');
    const [openBackdrop, setOpenBackdrop] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Add Subcategory';
    }, []);

    useEffect(() => {
        if (LocalStorageHelper.IsUserLogged() === false || LocalStorageHelper.isUserAdmin() === false) {
            navigate('/');
        }
    }, []);

    useEffect(() => {
        axios.get('api/products/categories/get', {})
            .then(res => {
                setCategories(res.data);
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

    const handleCategoryChange = (event) => {
        setSelectCategoryId(event.target.value);
    };

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

    const submitSubcategory = (event) => {
        event.preventDefault();
        if (validateInputs() === false) {
            return;
        }
        LocalStorageHelper.CommitRefresh();
        axios.get('api/users/csrf/token', {})
            .then((response) => {
                setOpenBackdrop(true);
                axios.post('api/products/subcategories/create',
                    {
                        name: subcategoryName,
                        categoryId: selectCategoryId,
                    },
                    {
                        headers: {
                            'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                            'X-XSRF-TOKEN': response.data.token,
                            'Content-Type': 'application/json',
                        }
                    }).then(() => {
                    setOpenBackdrop(false);
                    toast.success('Subcategory Added!', {
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
        <SubcategoryAddContainer>
            <Backdrop
                sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
                open={openBackdrop}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>

            <AddSubcategoryForm>
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
                    Add subcategory
                </Typography>

                <Box component="form" onSubmit={submitSubcategory} noValidate>
                    <StyledFormControl size="small" autoFocus>
                        <InputLabel id="categoryLabel">Select category</InputLabel>
                        <Select
                            labelId="categoryLabel"
                            id="category"
                            label="Select category"
                            value={selectCategoryId}
                            onChange={handleCategoryChange}
                            variant="outlined"
                        >
                            {categories.map(({id, name}) => (
                                <MenuItem key={id} value={id}>{name}</MenuItem>
                            ))}
                        </Select>
                    </StyledFormControl>

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

                    <AddButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        onClick={validateInputs}
                    >
                        Add Subcategory
                    </AddButton>
                </Box>
            </AddSubcategoryForm>
        </SubcategoryAddContainer>
    );
}

export default AddSubcategory;