import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    Typography
} from "@mui/material";
import TextField from "@mui/material/TextField";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Bounce, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";
import '../style/UpdateProduct.scss';
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {ImageSlider} from "./components/ImageSlider.jsx";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";


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
    const [hideUploadGalBtn, setHideUploadGalBtn] = useState(false);
    const [hideDeleteGalBtn, setHideDeleteGalBtn] = useState(true);
    const [wasGalleryUpdated, setWasGalleryUpdated] = useState(false);
    const [imagesPaths, setImagesPaths] = useState([]);

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
                theme: "colored",
                transition: Bounce,
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
                theme: "colored",
                transition: Bounce,
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
                theme: "colored",
                transition: Bounce,
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
                theme: "colored",
                transition: Bounce,
            });
            navigate('/admin/product');
        });

        axios.get(`api/azure/list?path=${skuId.skuId}`, {})
            .then(res => {
                setImagesPaths(res.data);
                if (res.data.length > 0) {
                    [...res.data].map((path) => {
                        axios.get(`api/azure/read?path=${path}`, {responseType: 'blob'})
                            .then(res => {
                                let blob = new Blob([res.data], { type: "image/*" });
                                setProductGalleryPhoto(oldGallery => [...oldGallery,blob]);
                            })
                    });
                    setHideGallery(false);
                    setHideDeleteGalBtn(false);
                    setHideUploadGalBtn(true);
                } else {
                    setHideDeleteGalBtn(true);
                    setHideUploadGalBtn(false);
                    setHideGallery(true);
                }

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
                    theme: "colored",
                    transition: Bounce,
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
                if (file.size > 40 * 1000 * 1024) {
                    sizeCheck = false;
                }
            })
            if (sizeCheck) {
                setProductGalleryPhoto(event.target.files);
                setHideGallery(false);
                setHideUploadGalBtn(true);
                setHideDeleteGalBtn(false);
                setWasGalleryUpdated(true);
            } else {
                toast.error('Photo file size cannot exceed 40MB', {
                    position: "bottom-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                })
            }
        }
    }

    const deleteGallery = () => {
        setProductGalleryPhoto([]);
        setHideGallery(true);
        setHideUploadGalBtn(false);
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
            setHideUploadGalBtn(false);
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
            || !/^[A-Z][A-Z 'a-z]+$/i.test(productName)) {
            setProductNameError(true);
            setProductNameErrorMsg('Please enter a valid product name.');
            isValid = false;
        } else {
            setProductNameError(false);
            setProductNameErrorMsg('');
        }

        if (!productPrice || !/^[1-9][0-9]{0,10}[.][0-9]{2}$/i.test(productPrice)) {
            setProductPriceError(true);
            setProductPriceErrorMsg('Please enter a valid price in format: 299.99');
            isValid = false;
        } else {
            setProductPriceError(false);
            setProductPriceErrorMsg('');
        }

        if (!productQuantity || !parseInt(productQuantity)) {
            setProductQuantityError(true);
            setProductQuantityErrorMsg('Please enter a valid quantity.');
            isValid = false;
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
                theme: "colored",
                transition: Bounce,
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
        if (wasGalleryUpdated) {
            [...imagesPaths].map((path) => {
                axios.get('api/users/csrf/token', {})
                .then((response) => {
                    axios.delete(`api/azure/delete?path=${path}`, {
                        headers: {
                            'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                            'X-XSRF-TOKEN': response.data.token,
                        }
                    })
                        .then(() => {
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
                    });
                })
            });
            axios.get('api/users/csrf/token', {})
                .then((response) => {
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
                                photos.map((photo, index) => {
                                    const formData = new FormData();
                                    formData.append('file', photo);
                                    formData.append('path', pathMain);
                                    formData.append('fileName', index);
                                    axios.post('api/azure/upload', formData, {
                                        headers: {
                                            'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                                            'X-XSRF-TOKEN': response.data.token,
                                            'Content-Type': 'multipart/form-data',
                                        }
                                    }).then(() => {
                                        toast.success('New product photo added!', {
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
                                        })
                                    })
                                })
                                toast.success('Product updated!', {
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
                                setTimeout(() => {navigate('/admin/product')}, 3000);
                            }).catch(() => {
                            toast.error('Cannot fetch token', {
                                position: "bottom-center",
                                autoClose: 3000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: false,
                                progress: undefined,
                                theme: "colored",
                                transition: Bounce,
                            })
                        })
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
        } else {
            axios.get('api/users/csrf/token', {})
                .then((response) => {
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
                            toast.success(response.data, {
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
                            setTimeout(() => {navigate('/admin/product')}, 3000);
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
                        theme: "colored",
                        transition: Bounce,
                    });
            });
        }
    }

    return (
        <div className="ProductUpdate">
            <div className="ProductUpdateForm">
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
                    <FormControl variant="outlined"
                                 size={"small"}
                                 autoFocus
                                 noValidate
                                 required
                                 error={categoryError}
                                 color={categoryError ? 'error' : 'primary'}
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
                    >
                        <InputLabel id="categoryLabel">Select category</InputLabel>
                        <Select
                            labelId="categoryLabel"
                            id="category"
                            value={
                                (selectCategoryId === undefined ||
                                    selectCategoryId === null ||
                                    categories.length === 0) ? '' : selectCategoryId}
                            onChange={handleCategoryChange}
                            required
                            variant={"filled"}>
                            {
                                categories.map(({id, name}) => (
                                    <MenuItem key={id} value={id}>{name}</MenuItem>
                                ))
                            }
                        </Select>
                        <FormHelperText>{categoryErrorMsg}</FormHelperText>
                    </FormControl>
                    <FormControl variant="outlined"
                                 size={"small"}
                                 required
                                 noValidate
                                 error={subcategoryError}
                                 color={subcategoryError ? 'error' : 'primary'}
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
                    >
                        <InputLabel id="subcategoryLabel">Select subcategory</InputLabel>
                        <Select
                            labelId="subcategoryLabel"
                            id="subcategory"
                            value={
                                (selectedSubcategoryId === undefined ||
                                    selectedSubcategoryId === null ||
                                    subcategories.length === 0) ? '' : selectedSubcategoryId}
                            onChange={handleSubcategoryChange}
                            required
                            variant={"filled"}>
                            {
                                subcategories.map(({id, name}) => (
                                    <MenuItem key={id} value={id}>{name}</MenuItem>
                                ))
                            }
                        </Select>
                        <FormHelperText>{subcategoryErrorMsg}</FormHelperText>
                    </FormControl>
                    <FormControl variant="outlined"
                                 size={"small"}
                                 required
                                 noValidate
                                 error={countryError}
                                 color={countryError ? 'error' : 'primary'}
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
                    >
                        <InputLabel id="countryLabel">Select country</InputLabel>
                        <Select
                            labelId="countryLabel"
                            id="country"
                            value={
                                (selectedCountryId === undefined ||
                                    selectedCountryId === null ||
                                    countries.length === 0) ? '' : selectedCountryId}
                            onChange={handleCountryChange}
                            required
                            variant={"filled"}>
                            {
                                countries.map(({id, name}) => (
                                    <MenuItem key={id} value={id}>{name}</MenuItem>
                                ))
                            }
                        </Select>
                        <FormHelperText>{countryErrorMsg}</FormHelperText>
                    </FormControl>
                    <FormControl variant="outlined"
                                 size={"small"}
                                 required
                                 error={manufacturerError}
                                 color={manufacturerError ? 'error' : 'primary'}
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
                    >
                        <InputLabel id="manufacturerLabel">Select manufacturer</InputLabel>
                        <Select
                            labelId="manufacturerLabel"
                            id="manufacturer"
                            value={
                                (selectedManufacturerId === undefined ||
                                    selectedManufacturerId === null ||
                                    manufacturers.length === 0) ? '' : selectedManufacturerId}
                            onChange={handleManufacturerChange}
                            required
                            variant={"filled"}>
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
                        type="email"
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
                        type="email"
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
                        type="email"
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
                    { !hideUploadGalBtn &&
                        <Button
                            variant="contained"
                            component="label"
                            hidden={hideUploadGalBtn}
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
                    }
                    { !hideDeleteGalBtn &&
                        <Button variant="contained"
                                hidden={hideDeleteGalBtn}
                                fullWidth
                                endIcon={<DeleteOutlineOutlinedIcon />}
                                onClick={deleteGallery}
                                sx={{
                                    width: '70%',
                                    marginBottom: '8px',
                                    backgroundColor: 'rgb(97,12,12)',
                                    "&:hover": {backgroundColor: 'rgb(175,38,38)'}
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
                        onClick={updateProduct}
                        sx={{
                            width: '70%',
                            backgroundColor: 'rgb(39, 99, 24)',
                            "&:hover": {backgroundColor: 'rgb(49,140,23)'}
                        }}
                    >
                        Update Product <AddOutlinedIcon />
                    </Button>
                </Box>
            </div>
        </div>
    )
}

export default UpdateProduct;