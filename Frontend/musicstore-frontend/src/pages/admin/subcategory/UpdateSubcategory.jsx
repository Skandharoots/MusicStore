import {Box, Button, FormControl, InputLabel, MenuItem, Select, Typography} from "@mui/material";
import TextField from "@mui/material/TextField";
// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Bounce, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";
import '../style/UpdateSubcategory.scss';


function UpdateSubcategory() {

    const id = useParams();

    const [subcategoryName, setSubcategoryName] = useState('');
    const [subcategoryNameError, setSubcategoryNameError] = useState(false);
    const [subcategoryNameErrorMsg, setSubcategoryNameErrorMsg] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Edit Subcategory';
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
                theme: "colored",
                transition: Bounce,
            });
        })
    }, [])

    const validateInputs = () => {

        let isValid = true;

        if (!subcategoryName
            || !/^[A-Z][A-Z 'a-z]+$/i.test(subcategoryName)) {
            setSubcategoryNameError(true);
            setSubcategoryNameErrorMsg('Please enter a valid subcategory name.');
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

        axios.get('api/users/csrf/token', {})
            .then((response) => {
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
                    toast.success("Subcategory updated!", {
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
                    navigate('/admin/subcategory');

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
        <div className="SubcategoryUpdate">
            <div className="SubcategoryUpdateForm">
                <Typography
                    component="h1"
                    variant="h5"
                    sx={{
                        width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', color: 'black'
                        , margin: '0 auto 5% auto'
                    }}
                >
                    Update subcategory
                </Typography>
                <Box
                    component="form"
                    onSubmit={updateSubcategory}
                    noValidate

                >
                    <TextField
                        id="subcategoryId"
                        type="email"
                        name="subcategoryId"
                        autoComplete="id"
                        required
                        fullWidth
                        variant="outlined"
                        label="Subcategory Id"
                        value={id.id}
                        disabled={true}
                        sx={{
                            width: '70%',
                            margin: '0 auto 5% auto',
                        }}
                    />
                    <TextField
                        error={subcategoryNameError}
                        helperText={subcategoryNameErrorMsg}
                        id="subcategoryName"
                        type="email"
                        name="subcategoryName"
                        placeholder="Subcategory"
                        autoComplete="subcategoryName"
                        required
                        fullWidth
                        variant="outlined"
                        color={subcategoryNameError ? 'error' : 'primary'}
                        label="Subcategory"
                        value={subcategoryName}
                        onChange={e => setSubcategoryName(e.target.value)}
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
                        Update Subcategory
                    </Button>
                </Box>
            </div>
        </div>
    )
}

export default UpdateSubcategory;