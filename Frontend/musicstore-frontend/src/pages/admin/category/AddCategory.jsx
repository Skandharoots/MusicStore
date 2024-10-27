import {Box, Button, Typography} from "@mui/material";
import TextField from "@mui/material/TextField";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import '../style/AddCategory.scss';
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";
import {Bounce, toast} from "react-toastify";


function AddCategory() {

    const [categoryName, setCategoryName] = useState('');
    const [categoryNameError, setCategoryNameError] = useState(false);
    const [categoryNameErrorMsg, setCategoryNameErrorMsg] = useState('');

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

        if (!categoryName
            || !/^[A-Z][A-Z 'a-z]+$/i.test(categoryName)) {
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

        axios.get('api/users/csrf/token', {})
            .then((response) => {
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
                        toast.success('Category Added', {
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
        <div className="CategoryAdd">
            <div className="AddCatForm">
                <Typography
                    component="h1"
                    variant="h5"
                    sx={{
                        width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', color: 'black'
                        , margin: '0 auto 5% auto'
                    }}
                >
                    Add category
                </Typography>
                <Box
                    component="form"
                    onSubmit={submitCategory}
                    noValidate

                >

                    <TextField
                        error={categoryNameError}
                        helperText={categoryNameErrorMsg}
                        id="categoryName"
                        type="email"
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
                        Add Category
                    </Button>
                </Box>
            </div>
        </div>
    )
}

export default AddCategory;