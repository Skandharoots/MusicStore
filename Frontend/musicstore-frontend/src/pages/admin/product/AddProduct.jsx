import {
    Box,
    Button,
    Select,
    MenuItem,
    Typography,
    InputLabel,
    FormControl, InputAdornment, FormHelperText, CircularProgress, Backdrop,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import axios from "axios";
import '../style/AddProduct.scss';
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";
import {Slide, toast} from "react-toastify";
import {ImageSlider} from "./components/ImageSlider.jsx";

function AddProduct() {

    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productQuantity, setProductQuantity] = useState('');
    const [manufacturers, setManufacturers] = useState([]);
    const [selectedManufacturerId, setSelectedManufacturerId] = useState('');
    const [countries, setCountries] = useState([]);
    const [selectedCountryId, setSelectedCountryId] = useState('');
    const [subcategories, setSubcategories] = useState([]);
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectCategoryId, setSelectCategoryId] = useState('');
    const [productGalleryPhoto, setProductGalleryPhoto] = useState([]);
    const [hideGallery, setHideGallery] = useState(true);
    const [hideDeleteGalBtn, setHideDeleteGalBtn] = useState(true);
    const [openBackdrop, setOpenBackdrop] = useState(false);

    const [categoryError, setCategoryError] = useState(false);
    const [categoryErrorMsg, setCategoryErrorMsg] = useState('');
    const [subcategoryError, setSubcategoryError] = useState(false);
    const [subcategoryErrorMsg, setSubcategoryErrorMsg] = useState('');
    const [countryError, setCountryError] = useState(false);
    const [countryErrorMsg, setCountryErrorMsg] = useState('');
    const [manufacturerError, setManufacturerError] = useState(false);
    const [manufacturerErrorMsg, setManufacturerErrorMsg] = useState('');
    const [productNameError, setProductNameError] = useState(false);
    const [productNameErrorMsg, setProductNameErrorMsg] = useState('');
    const [productDescriptionError, setProductDescriptionError] = useState(false);
    const [productDescriptionErrorMsg, setProductDescriptionErrorMsg] = useState('');
    const [productPriceError, setProductPriceError] = useState(false);
    const [productPriceErrorMsg, setProductPriceErrorMsg] = useState('');
    const [productQuantityError, setProductQuantityError] = useState(false);
    const [productQuantityErrorMsg, setProductQuantityErrorMsg] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Add Product';
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

    useEffect(() => {
        if (selectCategoryId) {
            axios.get(`api/products/subcategories/get/category?category=${selectCategoryId}`, {})
                .then(res => {
                    setSubcategories(res.data);
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
            });
        }
    }, [selectCategoryId]);

    useEffect(() => {
        axios.get(`api/products/manufacturers/get`, {})
        .then(res => {
            setManufacturers(res.data);
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

    useEffect(() => {
        axios.get(`api/products/countries/get`, {})
            .then(res => {
                setCountries(res.data);
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
        setSelectedSubcategoryId('');
    };

    const handleSubcategoryChange = (event) => {
        setSelectedSubcategoryId(event.target.value);
    }

    const handleCountryChange = (event) => {
        setSelectedCountryId(event.target.value);
    }

    const handleManufacturerChange = (event) => {
        setSelectedManufacturerId(event.target.value);
    }

    const handleGallery = (event) => {
        if (event.target.files) {
            let sizeCheck = true;
            const files = [...event.target.files];
            files.forEach(file => {
                if (file.size > 40 * 1000 * 1024) {
                    sizeCheck = false;
                }
            })
            if (sizeCheck) {
                setProductGalleryPhoto(oldGallery => [...oldGallery, ...files]);
                setHideGallery(false);
                setHideDeleteGalBtn(false);
            } else {
                toast.error('Photo file size cannot exceed 40MB', {
                    position: "bottom-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                    theme: "light",
                    transition: Slide,
                })
            }
        }
    }

    const deleteGallery = () => {
        setProductGalleryPhoto([]);
        setHideGallery(true);
        setHideDeleteGalBtn(true);
    }

    const delGalPhoto = (imageBin) => {
        let newGallery = [...productGalleryPhoto];
        setProductGalleryPhoto(() =>
            newGallery.filter((image) => {
                return imageBin !== image;
            })
        );
        if (productGalleryPhoto.length <= 1) {
            setHideGallery(true);
            setHideDeleteGalBtn(true);
        }
    };

    const validateInputs = () => {

        let isValid = true;

        if(!selectCategoryId) {
            setCategoryError(true);
            setCategoryErrorMsg('Please select a category.')
            isValid = false;
        } else {
            setCategoryError(false);
            setCategoryErrorMsg('');
        }

        if (!selectedSubcategoryId) {
            setSubcategoryError(true);
            setSubcategoryErrorMsg('Please select a subcategory.')
            isValid = false;
        } else {
            setSubcategoryError(false);
            setSubcategoryErrorMsg('');
        }

        if (!selectedCountryId) {
            setCountryError(true);
            setCountryErrorMsg('Please select a country.')
            isValid = false;
        } else {
            setCountryError(false);
            setCountryErrorMsg('');
        }

        if (!selectedManufacturerId) {
            setManufacturerError(true);
            setManufacturerErrorMsg('Please select a manufacturer.')
            isValid = false;
        } else {
            setManufacturerError(false);
            setManufacturerErrorMsg('');
        }

        if (!productName
            || !/^[A-Za-z0-9][A-Za-z0-9&' :+=#?%()/"-]{1,49}$/i.test(productName)) {
            setProductNameError(true);
            setProductNameErrorMsg('Please enter a valid product name. Permitted special characters: &\':+=#?()%/"-');
            isValid = false;
        } else {
            setProductNameError(false);
            setProductNameErrorMsg('');
        }

        if (!/^[ -~]*$/gm.test(productDescription)) {
            setProductDescriptionError(true);
            setProductDescriptionErrorMsg('Please enter a valid product description.');
            isValid = false;
        } else if (!productDescription) {
            setProductDescriptionError(true);
            setProductDescriptionErrorMsg('Product description cannot be empty.');
            isValid = false;
        } else {
            setProductDescriptionError(false);
            setProductDescriptionErrorMsg('');
        }

        if (!productPrice || !/^[1-9][0-9]*[.][0-9]{2}$/i.test(productPrice)) {
            setProductPriceError(true);
            setProductPriceErrorMsg('Please enter a valid price in format: 299.99. Price cannot be smaller than 1.00.');
            isValid = false;
        } else {
            setProductPriceError(false);
            setProductPriceErrorMsg('');
        }

        if (!productQuantity) {
            setProductQuantityError(true);
            setProductQuantityErrorMsg('Please enter a valid quantity.');
            isValid = false;
        } else if (productQuantity < 0) {
            setProductQuantityError(true);
            setProductQuantityErrorMsg('Quantity cannot be less than 0.');
        } else {
            setProductQuantityError(false);
            setProductQuantityErrorMsg('');
        }

        if (productGalleryPhoto.length <= 0) {
            toast.warning('Gallery photos not selected!', {
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
            isValid = false;
        }

        return isValid;
    };

    const submitProduct = (event) => {
        event.preventDefault();
        if (validateInputs() === false) {
            return;
        }
        axios.get('api/users/csrf/token', {})
            .then((response) => {
                setOpenBackdrop(true);
                axios.post('api/products/items/create',
                    {
                        productName: productName,
                        description: productDescription,
                        price: productPrice,
                        quantity: productQuantity,
                        manufacturerId: selectedManufacturerId,
                        countryId: selectedCountryId,
                        categoryId: selectCategoryId,
                        subcategoryId: selectedSubcategoryId,
                    },
                    {
                        headers: {
                            'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                            'X-XSRF-TOKEN': response.data.token,
                            'Content-Type': 'application/json',
                        }
                    }).then((response) => {
                        const pathMain = `${response.data}`;
                        axios.get('api/users/csrf/token', {})
                            .then((response) => {
                                const photos = [...productGalleryPhoto];
                                const promises = [];
                                photos.map((photo, index) => {
                                    const formData = new FormData();
                                    formData.append('file', photo);
                                    formData.append('path', pathMain);
                                    formData.append('fileName', index);
                                    promises.push(
                                        axios.post('api/azure/upload', formData, {
                                            headers: {
                                                'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                                                'X-XSRF-TOKEN': response.data.token,
                                                'Content-Type': 'multipart/form-data',
                                            }
                                        })
                                    );
                                });
                                Promise.all(promises.map(p => p.catch(e => e)))
                                    .then(results => {
                                        results.forEach((result) => {
                                            if (result.status === 201) {
                                                toast.success('New product photo added!', {
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
                                            } else {
                                                toast.error('Error ' + result.status + ': Failed to add product photo!', {
                                                    position: "bottom-center",
                                                    autoClose: 3000,
                                                    hideProgressBar: false,
                                                    closeOnClick: true,
                                                    pauseOnHover: true,
                                                    draggable: false,
                                                    progress: undefined,
                                                    theme: "light",
                                                    transition: Slide,
                                                })
                                            }
                                        });
                                        setOpenBackdrop(false);
                                        toast.success('New product added!', {
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
                                        navigate('/admin/product');
                                    }).catch(() => {
                                    //
                                });
                            }).catch(() => {
                                toast.error('Cannot fetch token', {
                                    position: "bottom-center",
                                    autoClose: 3000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: false,
                                    progress: undefined,
                                    theme: "light",
                                    transition: Slide,
                                })
                        })
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
        <div className="ProductAdd">
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className="AddProductForm">
                <Typography
                    component="h1"
                    variant="h5"
                    sx={{
                        width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', color: 'black'
                        , margin: '0 auto 5% auto'
                    }}
                >
                    Add product
                </Typography>
                <Box
                >
                    <FormControl
                                 autoFocus
                                 noValidate
                                 required
                                 error={categoryError}
                                 color={categoryError ? 'error' : 'primary'}
                                 size="small"
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
                        <InputLabel id="categoryLabel">Select category</InputLabel>
                        <Select
                            labelId="categoryLabel"
                            id="category"
                            label={"Select category"}
                            value={selectCategoryId}
                            onChange={handleCategoryChange}
                            required
                            variant={"outlined"}>
                            {
                                categories.map(({id, name}) => (
                                    <MenuItem key={id} value={id}>{name}</MenuItem>
                                ))
                            }
                        </Select>
                        <FormHelperText>{categoryErrorMsg}</FormHelperText>
                    </FormControl>
                    <FormControl
                                 size="small"
                                 required
                                 noValidate
                                 error={subcategoryError}
                                 color={subcategoryError ? 'error' : 'primary'}
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
                        <InputLabel id="subcategoryLabel">Select subcategory</InputLabel>
                        <Select
                            labelId="subcategoryLabel"
                            id="subcategory"
                            label={"Select subcategory"}
                            value={selectedSubcategoryId}
                            onChange={handleSubcategoryChange}
                            required
                            variant={"outlined"}>
                            {
                                subcategories.map(({id, name}) => (
                                    <MenuItem key={id} value={id}>{name}</MenuItem>
                                ))
                            }
                        </Select>
                        <FormHelperText>{subcategoryErrorMsg}</FormHelperText>
                    </FormControl>
                    <FormControl
                                 size="small"
                                 required
                                 noValidate
                                 error={countryError}
                                 color={countryError ? 'error' : 'primary'}
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
                        <InputLabel id="countryLabel">Select country</InputLabel>
                        <Select
                            labelId="countryLabel"
                            id="country"
                            label={"Select country"}
                            value={selectedCountryId}
                            onChange={handleCountryChange}
                            required
                            variant={"outlined"}>
                            {
                                countries.map(({id, name}) => (
                                    <MenuItem key={id} value={id}>{name}</MenuItem>
                                ))
                            }
                        </Select>
                        <FormHelperText>{countryErrorMsg}</FormHelperText>
                    </FormControl>
                    <FormControl
                                 size="small"
                                 required
                                 error={manufacturerError}
                                 color={manufacturerError ? 'error' : 'primary'}
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
                        <InputLabel id="manufacturerLabel">Select manufacturer</InputLabel>
                        <Select
                            labelId="manufacturerLabel"
                            id="manufacturer"
                            label={"Select manufacturer"}
                            value={selectedManufacturerId}
                            onChange={handleManufacturerChange}
                            required
                            variant={"outlined"}>
                            {
                                manufacturers.map(({id, name}) => (
                                    <MenuItem key={id} value={id}>{name}</MenuItem>
                                ))
                            }
                        </Select>
                        <FormHelperText>{manufacturerErrorMsg}</FormHelperText>
                    </FormControl>
                    <TextField
                        size={"small"}
                        error={productNameError}
                        helperText={productNameErrorMsg}
                        id="productName"
                        type="search"
                        name="productName"
                        placeholder="Product"
                        autoComplete="productName"
                        required
                        fullWidth
                        variant="outlined"
                        color={productNameError ? 'error' : 'primary'}
                        label="Product"
                        value={productName}
                        onChange={e => setProductName(e.target.value)}
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
                    <TextField
                        size={"small"}
                        id="productDescription"
                        label="Description"
                        multiline
                        rows={4}
                        required
                        error={productDescriptionError}
                        helperText={productDescriptionErrorMsg}
                        color={productDescriptionError ? 'error' : 'primary'}
                        value={productDescription}
                        onChange={e => setProductDescription(e.target.value)}
                        variant={"outlined"}
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
                        }}/>
                    <TextField
                        size={"small"}
                        error={productPriceError}
                        helperText={productPriceErrorMsg}
                        id="productPrice"
                        type="search"
                        name="productPrice"
                        placeholder="2699.99"
                        autoComplete="productPrice"
                        required
                        fullWidth
                        slotProps={{
                            input: {
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                maxLength: 10,
                                step: 0.50,
                                inputMode: 'numeric',
                            },
                        }}
                        variant="outlined"
                        color={productPriceError ? 'error' : 'primary'}
                        label="Price"
                        value={productPrice}
                        onChange={e => setProductPrice(e.target.value)}
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
                    <TextField
                        size={"small"}
                        error={productQuantityError}
                        helperText={productQuantityErrorMsg}
                        id="productQuantity"
                        type="search"
                        name="productQuantity"
                        placeholder="1"
                        autoComplete="productQuantity"
                        required
                        fullWidth
                        slotProps={{
                            input: {
                                maxLength: 10,
                                step: 1,
                                inputMode: 'numeric',
                            },
                        }}
                        variant="outlined"
                        color={productQuantityError ? 'error' : 'primary'}
                        label="Quantity"
                        value={productQuantity}
                        onChange={e => setProductQuantity(e.target.value)}
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
                        variant="contained"
                        component="label"
                        endIcon={<CloudUploadOutlinedIcon />}
                        formNoValidate
                        fullWidth
                        sx={{
                            width: '70%',
                            marginBottom: '8px',
                            backgroundColor: 'rgb(15,90,110)',
                            "&:hover": {backgroundColor: 'rgb(33,123,145)'}
                        }}
                    >
                        Upload Gallery Photos
                        <input
                            type="file"
                            accept="image/jpeg, image/png"
                            hidden
                            formNoValidate
                            multiple={true}
                            onChange={handleGallery}
                        />
                    </Button>
                    { !hideDeleteGalBtn &&
                    <Button variant="contained"
                            fullWidth
                            endIcon={<DeleteOutlineOutlinedIcon />}
                            onClick={deleteGallery}
                            sx={{
                                width: '70%',
                                marginBottom: '8px',
                                backgroundColor: 'rgb(159,20,20)',
                                "&:hover": {backgroundColor: 'rgb(193,56,56)'},
                            }}
                    >
                        Delete Gallery Photos
                    </Button>
                    }
                    {!hideGallery &&
                        <div
                            style={{
                                maxWidth: "1200px",
                                width: "70%",
                                aspectRatio: "10 / 6",
                                margin: "0 auto 32px auto",
                            }}>
                            <ImageSlider imageBinaries={productGalleryPhoto} onDelete={delGalPhoto}/>
                        </div>
                    }
                    <Button
                        className="add-btn"
                        type="button"
                        fullWidth
                        variant="contained"
                        endIcon={<AddOutlinedIcon />}
                        onClick={submitProduct}
                        sx={{
                            width: '70%',
                            backgroundColor: 'rgb(39, 99, 24)',
                            "&:hover": {backgroundColor: 'rgb(49,140,23)'}
                        }}
                    >
                        Add Product
                    </Button>
                </Box>
            </div>
        </div>
    )
}

export default AddProduct;