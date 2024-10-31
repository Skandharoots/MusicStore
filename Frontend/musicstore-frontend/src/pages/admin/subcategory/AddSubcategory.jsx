import {Box, Button, Select, MenuItem, Typography, InputLabel, FormControl} from "@mui/material";
import TextField from "@mui/material/TextField";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import '../style/AddSubcategory.scss';
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";
import {Bounce, toast} from "react-toastify";


function AddSubcategory() {

    const [subcategoryName, setSubcategoryName] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectCategoryId, setSelectCategoryId] = useState('');
    const [subcategoryNameError, setSubcategoryNameError] = useState(false);
    const [subcategoryNameErrorMsg, setSubcategoryNameErrorMsg] = useState('');

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
                theme: "colored",
                transition: Bounce,
            });
        })
    }, [])

    const handleCategoryChange = (event) => {
        setSelectCategoryId(event.target.value);
    };

    const validateInputs = () => {

        let isValid = true;

        if (!subcategoryName
            || !/^[A-Z][A-Za-z ']{1,49}/i.test(subcategoryName)) {
            setSubcategoryNameError(true);
            setSubcategoryNameErrorMsg('Please enter a valid subcategory name.');
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

        axios.get('api/users/csrf/token', {})
            .then((response) => {
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
                    toast.success('Subcategory Added!', {
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
        <div className="SubcategoryAdd">
            <div className="AddSubcatForm">
                <Typography
                    component="h1"
                    variant="h5"
                    sx={{
                        width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', color: 'black'
                        , margin: '0 auto 5% auto'
                    }}
                >
                    Add subcategory
                </Typography>
                <Box
                    component="form"
                    onSubmit={submitSubcategory}
                    noValidate

                >
                    <FormControl
                                 size="small"
                                 autoFocus
                                 sx={{
                                     m: 1,
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
                    >
                        <InputLabel id="demo-simple-select-outlined-label">Select category</InputLabel>
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            label={"Select category"}
                            value={selectCategoryId}
                            onChange={handleCategoryChange}
                         variant={"outlined"}>
                            {
                                categories.map(({id, name}) => (
                                    <MenuItem key={id} value={id}>{name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
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
                        size="small"
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
                        Add Subcategory
                    </Button>
                </Box>
            </div>
        </div>
    )
}

export default AddSubcategory;