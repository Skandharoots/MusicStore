import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormHelperText,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    styled
} from "@mui/material";
import TextField from "@mui/material/TextField";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Slide, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {ImageSlider} from "./components/ImageSlider.jsx";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

const ProductUpdateContainer = styled(Box)(({theme}) => ({
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '80dvh',
    width: '796px',
    borderLeft: '1px solid ' + theme.palette.divider,
}));

const ProductUpdateForm = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyItems: 'center',
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: '600px',
    minWidth: '200px',
    margin: '16px 20% 16px 20%',
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
    },
    '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': {
        '-webkit-appearance': 'none',
        margin: 0,
    },
    '& input[type="number"]': {
        '-moz-appearance': 'textfield',
    },
}));

const UploadButton = styled(Button)(({theme}) => ({
    width: '70%',
    marginBottom: '8px',
    backgroundColor: theme.palette.blueBtn.main,
    color: theme.palette.mybutton.colorTwo,
    "&:hover": {backgroundColor: theme.palette.blueBtn.light},
}));

const DeleteGalleryButton = styled(Button)(({theme}) => ({
    width: '70%',
    marginBottom: '8px',
    backgroundColor: theme.palette.errorBtn.main,
    color: theme.palette.mybutton.colorTwo,
    "&:hover": {backgroundColor: theme.palette.errorBtn.light},
}));

const UpdateProductButton = styled(Button)(({theme}) => ({
    width: '70%',
    backgroundColor: theme.palette.irish.main,
    color: theme.palette.mybutton.colorTwo,
    "&:hover": {backgroundColor: theme.palette.irish.light},
}));

const ImageSliderContainer = styled(Box)(({theme}) => ({
    maxWidth: "1200px",
    width: "70%",
    aspectRatio: "10 / 6",
    margin: "0 auto 32px auto",
}));

function UpdateProduct() {

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
    const [wasGalleryUpdated, setWasGalleryUpdated] = useState(false);
    const [imagesPaths, setImagesPaths] = useState([]);
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

    const skuId = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Edit Product';
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
        });

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
        });

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
        });

        axios.get(`api/products/items/get/${skuId.skuId}`, {})
            .then(res => {
                setProductName(res.data.productName);
                setProductDescription(res.data.productDescription);
                setProductPrice(res.data.productPrice);
                setProductQuantity(res.data.inStock);
                setSelectCategoryId(res.data.category.id);
                setSelectedSubcategoryId(res.data.subcategory.id);
                setSelectedManufacturerId(res.data.manufacturer.id);
                setSelectedCountryId(res.data.builtinCountry.id);
            }).catch(() => {
            toast.error("Cannot find product, redirecting", {
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
        });

        axios.get(`api/azure/list?path=${skuId.skuId}`, {})
            .then(res => {
                setImagesPaths(res.data);
                if (res.data.length > 0) {
                    const promises = [];
                    [...res.data].map((path) => {
                        promises.push(axios.get(`api/azure/read?path=${path}`, {responseType: 'blob'}))
                    })
                    Promise.all(promises).then(ordered_array => {
                        ordered_array.forEach( result => {
                            let blob = new Blob([result.data], {type: "image/*"});
                            setProductGalleryPhoto(old => [...old, blob]);
                        } );
                    });
                    setHideGallery(false);
                    setHideDeleteGalBtn(false);
                } else {
                    setHideDeleteGalBtn(true);
                    setHideGallery(true);
                }
            }).catch(() => {})

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
                if (file.size > 6 * 1000 * 1024) {
                    sizeCheck = false;
                }
            })
            if (sizeCheck) {
                setProductGalleryPhoto(oldGallery => [...oldGallery, ...files]);
                setHideGallery(false);
                setHideDeleteGalBtn(false);
                setWasGalleryUpdated(true);
            } else {
                toast.error('Photo file size cannot exceed 6MB', {
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
        setWasGalleryUpdated(true);
    }

    const delGalPhoto = (imageBin) => {
        let newGallery = [...productGalleryPhoto];
        setProductGalleryPhoto(() =>
            newGallery.filter((image) => {
                return imageBin !== image;
            })
        );
        setWasGalleryUpdated(true);
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

        if (productName.length < 2 || productName.length > 100) {
            setProductNameError(true);
            setProductNameErrorMsg('Product name must be from 2 to 100 characters long.');
            isValid = false;
        } else {
            setProductNameError(false);
            setProductNameErrorMsg('');
        }

        if (!productName
            || !/^[A-Za-z0-9][A-Za-z0-9&' :+=#?%()/"\-]{1,99}$/i.test(productName)) {
            setProductNameError(true);
            setProductNameErrorMsg('Please enter a valid product name. Can contain capital and ' +
                'lowercase letters and numbers. Permitted special characters: &\':+=#?()%/"-');
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

        if (!productPrice || !/^[1-9][0-9]{0,10}[.][0-9]{2}$/i.test(productPrice)) {
            setProductPriceError(true);
            setProductPriceErrorMsg('Please enter a valid price in format: 299.99.  Price cannot be smaller than 1.00.');
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
            toast.error('Gallery photos not selected!', {
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

    const updateProduct = (event) => {
        event.preventDefault();
        if (validateInputs() === false) {
            return;
        }
        LocalStorageHelper.CommitRefresh();
        if (wasGalleryUpdated) {
            [...imagesPaths].map((path) => {
                axios.get('api/users/csrf/token', {})
                .then((response) => {
                    axios.delete(`api/azure/delete?path=${path}`, {
                        headers: {
                            'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                            'X-XSRF-TOKEN': response.data.token,
                        }
                    }).then(() => {
                        //
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
                })
            });
            axios.get('api/users/csrf/token', {})
                .then((response) => {
                    setOpenBackdrop(true);
                    axios.put(`api/products/items/update/${skuId.skuId}`,
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
                        }).then(() => {
                        const pathMain = `${skuId.skuId}`;
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
                                            if (result.status === 200) {
                                                toast.success('Product photo updated!', {
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
                                                toast.error('Error ' + result.status + ': Failed to update product photo!', {
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
        } else {
            axios.get('api/users/csrf/token', {})
                .then((response) => {
                    setOpenBackdrop(true);
                    axios.put(`api/products/items/update/${skuId.skuId}`,
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
                            setOpenBackdrop(false);
                            toast.success(response.data, {
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
                            })
                        })
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
                    });
            });
        }
    }

    return (
        <ProductUpdateContainer>
            <Backdrop
                sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
                open={openBackdrop}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            
            <ProductUpdateForm>
                <Typography
                    component="h1"
                    variant="h5"
                    sx={{
                        width: '100%',
                        fontSize: 'clamp(2rem, 10vw, 2.15rem)',
                        margin: '0 auto 5% auto'
                    }}
                >
                    Update product
                </Typography>
                
                <Box>
                    <StyledFormControl
                        size="small"
                        autoFocus
                        noValidate
                        required
                        error={categoryError}
                        color={categoryError ? 'error' : 'primary'}
                    >
                        <InputLabel id="categoryLabel">Select category</InputLabel>
                        <Select
                            labelId="categoryLabel"
                            id="category"
                            label={"Select category"}
                            value={(selectCategoryId === undefined || selectCategoryId === null || categories.length === 0) ? '' : selectCategoryId}
                            onChange={handleCategoryChange}
                            required
                            variant={"outlined"}
                        >
                            {categories.map(({id, name}) => (
                                <MenuItem key={id} value={id}>{name}</MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{categoryErrorMsg}</FormHelperText>
                    </StyledFormControl>

                    <StyledFormControl
                        size="small"
                        required
                        noValidate
                        error={subcategoryError}
                        color={subcategoryError ? 'error' : 'primary'}
                    >
                        <InputLabel id="subcategoryLabel">Select subcategory</InputLabel>
                        <Select
                            labelId="subcategoryLabel"
                            id="subcategory"
                            label={"Select subcategory"}
                            value={(selectedSubcategoryId === undefined || selectedSubcategoryId === null || subcategories.length === 0) ? '' : selectedSubcategoryId}
                            onChange={handleSubcategoryChange}
                            required
                            variant={"outlined"}
                        >
                            {subcategories.map(({id, name}) => (
                                <MenuItem key={id} value={id}>{name}</MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{subcategoryErrorMsg}</FormHelperText>
                    </StyledFormControl>

                    <StyledFormControl
                        size="small"
                        required
                        noValidate
                        error={countryError}
                        color={countryError ? 'error' : 'primary'}
                    >
                        <InputLabel id="countryLabel">Select country</InputLabel>
                        <Select
                            labelId="countryLabel"
                            id="country"
                            label={"Select country"}
                            value={(selectedCountryId === undefined || selectedCountryId === null || countries.length === 0) ? '' : selectedCountryId}
                            onChange={handleCountryChange}
                            required
                            variant={"outlined"}
                        >
                            {countries.map(({id, name}) => (
                                <MenuItem key={id} value={id}>{name}</MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{countryErrorMsg}</FormHelperText>
                    </StyledFormControl>

                    <StyledFormControl
                        size="small"
                        required
                        error={manufacturerError}
                        color={manufacturerError ? 'error' : 'primary'}
                    >
                        <InputLabel id="manufacturerLabel">Select manufacturer</InputLabel>
                        <Select
                            labelId="manufacturerLabel"
                            id="manufacturer"
                            label={"Select manufacturer"}
                            value={(selectedManufacturerId === undefined || selectedManufacturerId === null || manufacturers.length === 0) ? '' : selectedManufacturerId}
                            onChange={handleManufacturerChange}
                            required
                            variant={"outlined"}
                        >
                            {manufacturers.map(({id, name}) => (
                                <MenuItem key={id} value={id}>{name}</MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{manufacturerErrorMsg}</FormHelperText>
                    </StyledFormControl>

                    <StyledTextField
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
                    />

                    <StyledTextField
                        size={"small"}
                        id="productDescription"
                        label="Description"
                        multiline
                        rows={4}
                        required
                        value={productDescription}
                        error={productDescriptionError}
                        helperText={productDescriptionErrorMsg}
                        color={productDescriptionError ? 'error' : 'primary'}
                        onChange={e => setProductDescription(e.target.value)}
                        variant={"outlined"}
                    />

                    <StyledTextField
                        size={"small"}
                        error={productPriceError}
                        helperText={productPriceErrorMsg}
                        id="productPrice"
                        type="number"
                        step="1.00"
                        name="productPrice"
                        placeholder="2699.99"
                        autoComplete="productPrice"
                        required
                        fullWidth
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        inputProps={{
                            maxLength: 10,
                            step: 0.50,
                            inputMode: 'numeric',
                        }}
                        variant="outlined"
                        color={productPriceError ? 'error' : 'primary'}
                        label="Price"
                        value={productPrice}
                        onChange={e => setProductPrice(e.target.value)}
                    />

                    <StyledTextField
                        size={"small"}
                        error={productQuantityError}
                        helperText={productQuantityErrorMsg}
                        id="productQuantity"
                        type="number"
                        name="productQuantity"
                        placeholder="1"
                        autoComplete="productQuantity"
                        required
                        fullWidth
                        inputProps={{
                            maxLength: 10,
                            step: 1,
                            inputMode: 'numeric',
                        }}
                        variant="outlined"
                        color={productQuantityError ? 'error' : 'primary'}
                        label="Quantity"
                        value={productQuantity}
                        onChange={e => setProductQuantity(e.target.value)}
                    />

                    <UploadButton
                        variant="contained"
                        component="label"
                        endIcon={<CloudUploadOutlinedIcon/>}
                        formNoValidate
                        fullWidth
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
                    </UploadButton>

                    {!hideGallery && (
                        <ImageSliderContainer>
                            <ImageSlider imageBinaries={productGalleryPhoto} onDelete={delGalPhoto}/>
                        </ImageSliderContainer>
                    )}

                    {!hideDeleteGalBtn && (
                        <DeleteGalleryButton
                            variant="contained"
                            hidden={hideDeleteGalBtn}
                            fullWidth
                            endIcon={<DeleteOutlineOutlinedIcon/>}
                            onClick={deleteGallery}
                        >
                            Delete Gallery Photos
                        </DeleteGalleryButton>
                    )}

                    <UpdateProductButton
                        type="button"
                        fullWidth
                        variant="contained"
                        onClick={updateProduct}
                    >
                        Update Product <AddOutlinedIcon/>
                    </UpdateProductButton>
                </Box>
            </ProductUpdateForm>
        </ProductUpdateContainer>
    );
}

export default UpdateProduct;