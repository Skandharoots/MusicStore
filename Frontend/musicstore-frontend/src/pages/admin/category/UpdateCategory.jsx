import {Backdrop, Box, Button, CircularProgress, Typography} from "@mui/material";
import TextField from "@mui/material/TextField";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Bounce, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";
import '../style/UpdateCategory.scss';


function UpdateCategory() {

    const id = useParams();

    const [categoryName, setCategoryName] = useState('');
    const [categoryNameError, setCategoryNameError] = useState(false);
    const [categoryNameErrorMsg, setCategoryNameErrorMsg] = useState('');
    const [openBackdrop, setOpenBackdrop] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Edit Category';
    }, []);

    useEffect(() => {
        if (LocalStorageHelper.IsUserLogged() === false || LocalStorageHelper.isUserAdmin() === false) {
            navigate('/');
        }
    }, []);

    useEffect(() => {
        axios.get(`api/products/categories/get/${id.id}`, {})
            .then(res => {
                setCategoryName(res.data.name);
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

        if (!categoryName
            || !/^[A-Z][A-Za-z ']{1,49}/i.test(categoryName)) {
            setCategoryNameError(true);
            setCategoryNameErrorMsg('Please enter a valid category name.');
            isValid = false;
        } else {
            setCategoryNameError(false);
            setCategoryNameErrorMsg('');
        }

        return isValid;
    };

    const updateCategory = (event) => {
        event.preventDefault();
        if (validateInputs() === false) {
            return;
        }
        axios.get('api/users/csrf/token', {})
            .then((response) => {
                setOpenBackdrop(true);
                axios.put(`api/products/categories/update/${id.id}`, {
                        categoryName: categoryName,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-XSRF-TOKEN': response.data.token,
                            'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                        }
                    }).then(() => {
                        setOpenBackdrop(false);
                        toast.success("Category updated!", {
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
        <div className="CategoryUpdate">
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className="CategoryUpdateForm">
                <Typography
                    component="h1"
                    variant="h5"
                    sx={{
                        width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', color: 'black'
                        , margin: '0 auto 5% auto'
                    }}
                >
                    Update category
                </Typography>
                <Box
                    component="form"
                    onSubmit={updateCategory}
                    noValidate

                >
                    <TextField
                        id="categoryId"
                        type="search"
                        name="categoryId"
                        autoComplete="id"
                        required
                        fullWidth
                        variant="outlined"
                        label="Category Id"
                        value={id.id}
                        disabled={true}
                        sx={{
                            width: '70%',
                            margin: '0 auto 5% auto',
                        }}
                    />
                    <TextField
                        error={categoryNameError}
                        helperText={categoryNameErrorMsg}
                        id="categoryName"
                        type="search"
                        name="categoryName"
                        placeholder="Category"
                        autoComplete="categoryName"
                        required
                        fullWidth
                        variant="outlined"
                        color={categoryNameError ? 'error' : 'primary'}
                        label="Category"
                        value={categoryName}
                        onChange={e => setCategoryName(e.target.value)}
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
                        Update Category
                    </Button>
                </Box>
            </div>
        </div>
    )
}

export default UpdateCategory;