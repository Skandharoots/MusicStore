import {Alert, AlertTitle, Box, Button, Typography} from "@mui/material";
import TextField from "@mui/material/TextField";
import React, {useEffect, useState} from "react";
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

    const [showErrorMsg, setShowErrorMsg] = React.useState('none');
    const [updateErrorMsg, setUpdateErrorMsg] = React.useState('');

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`api/products/categories/get/${id.id}`, {})
            .then(res => {
                setCategoryName(res.data.name);
            }).catch(err => {
                console.log(err);
        })
    }, [])

    const validateInputs = () => {

        let isValid = true;

        if (!categoryName
            || !/^[A-Z][a-z]+$/i.test(categoryName)) {
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
                        toast.success("Category updated ;)", {
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
                    setShowErrorMsg('flex');
                    setUpdateErrorMsg(error.response.data.message);
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
                        type="email"
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
                        type="email"
                        name="categoryName"
                        placeholder="Fender"
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
            <Alert variant='filled'
                   severity='error'
                   onClose={() => setShowErrorMsg('none')}
                   sx={{
                       display: showErrorMsg,
                       width: 'fit-content',
                       margin: '5% auto 0 auto',
                   }}>
                <AlertTitle>Error, {updateErrorMsg}</AlertTitle>
            </Alert>
        </div>
    )
}

export default UpdateCategory;