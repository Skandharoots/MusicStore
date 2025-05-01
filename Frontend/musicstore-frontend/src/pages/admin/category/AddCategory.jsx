import {Backdrop, Box, Button, CircularProgress, Typography, TextField, styled} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import '../style/AddCategory.scss';
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";
import {Slide, toast} from "react-toastify";

const CategoryAddContainer = styled(Box)(({theme}) => ({
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '80dvh',
    width: '796px',
    borderLeft: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
}));

const AddCategoryForm = styled(Box)(({theme}) => ({
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

const SubmitButton = styled(Button)(({theme}) => ({
    width: '70%',
    backgroundColor: 'rgb(39, 99, 24)',
    color: theme.palette.mybutton.colorTwo,
    "&:hover": {
        backgroundColor: 'rgb(49,140,23)'
    }
}));

function AddCategory() {
    const [categoryName, setCategoryName] = useState('');
    const [categoryNameError, setCategoryNameError] = useState(false);
    const [categoryNameErrorMsg, setCategoryNameErrorMsg] = useState('');
    const [openBackdrop, setOpenBackdrop] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Add Category';
    }, []);

    useEffect(() => {
        if (LocalStorageHelper.IsUserLogged() === false || LocalStorageHelper.isUserAdmin() === false) {
            navigate('/');
        }
    }, []);

    const validateInputs = () => {
        let isValid = true;

        if (!categoryName || !/^[A-Z][A-Za-z ']{1,49}/i.test(categoryName)) {
            setCategoryNameError(true);
            setCategoryNameErrorMsg('Please enter a valid category name.');
            isValid = false;
        } else {
            setCategoryNameError(false);
            setCategoryNameErrorMsg('');
        }

        return isValid;
    };

    const submitCategory = (event) => {
        event.preventDefault();
        if (validateInputs() === false) {
            return;
        }
        LocalStorageHelper.CommitRefresh();
        axios.get('api/users/csrf/token', {})
            .then((response) => {
                setOpenBackdrop(true);
                axios.post('api/products/categories/create',
                    {
                        categoryName: categoryName,
                    },
                    {
                        headers: {
                            'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                            'X-XSRF-TOKEN': response.data.token,
                            'Content-Type': 'application/json',
                        }
                    }).then(() => {
                        setOpenBackdrop(false);
                        window.dispatchEvent(new Event("category"));
                        toast.success('Category Added', {
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
                        navigate('/admin/category');
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
    };

    return (
        <CategoryAddContainer>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            
            <AddCategoryForm>
                <Typography
                    component="h1"
                    variant="h5"
                    sx={{
                        width: '100%',
                        fontSize: 'clamp(2rem, 10vw, 2.15rem)',
                        margin: '0 auto 5% auto'
                    }}
                >
                    Add category
                </Typography>
                
                <Box
                    component="form"
                    onSubmit={submitCategory}
                    noValidate
                >
                    <StyledTextField
                        error={categoryNameError}
                        helperText={categoryNameErrorMsg}
                        id="categoryName"
                        type="search"
                        name="categoryName"
                        placeholder="Category"
                        autoComplete="categoryName"
                        autoFocus
                        required
                        fullWidth
                        variant="outlined"
                        color={categoryNameError ? 'error' : 'primary'}
                        label="Category"
                        value={categoryName}
                        onChange={e => setCategoryName(e.target.value)}
                    />
                    
                    <SubmitButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        onClick={validateInputs}
                    >
                        Add Category
                    </SubmitButton>
                </Box>
            </AddCategoryForm>
        </CategoryAddContainer>
    );
}

export default AddCategory;