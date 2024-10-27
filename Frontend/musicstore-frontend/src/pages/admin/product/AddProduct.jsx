import {
    Box,
    Button,
    Select,
    MenuItem,
    Typography,
    InputLabel,
    FormControl, InputAdornment,
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
import {Bounce, toast} from "react-toastify";
import SimpleImageSlider from "react-simple-image-slider";

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
    const [productHeaderPhoto, setProductHeaderPhoto] = useState([]);
    const [image, setImage] = useState(null);
    const [productGalleryPhoto, setProductGalleryPhoto] = useState([]);
    const [hideMain, setHidMain] = useState(true);
    const [hideGallery, setHideGallery] = useState(true);
    const [hideUploadMainBtn, setHideUploadMainBtn] = useState(false);
    const [hideUploadGalBtn, setHideUploadGalBtn] = useState(false);
    const [hideDeleteGalBtn, setHideDeleteGalBtn] = useState(true);
    const [hideDeleteMainBtn, setHideDeleteMainBtn] = useState(true);

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
                theme: "colored",
                transition: Bounce,
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
                    theme: "colored",
                    transition: Bounce,
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
                theme: "colored",
                transition: Bounce,
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
                theme: "colored",
                transition: Bounce,
            });
        })
    }, [])

    const handleCategoryChange = (event) => {
        setSelectCategoryId(event.target.value);
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

    const handlePhoto = (event) => {
            if (event.target.files && event.target.files[0]) {
                setImage(URL.createObjectURL(event.target.files[0]));
                setProductHeaderPhoto(event.target.files[0]);
                setHidMain(false);
                setHideUploadMainBtn(true);
                setHideDeleteMainBtn(false);
            }
    }

    const deletePhoto = () => {
        setProductHeaderPhoto([]);
        setImage(null);
        setHidMain(true);
        setHideUploadMainBtn(false);
        setHideDeleteMainBtn(true);
    }

    const handleGallery = (event) => {
        if (event.target.files) {
            setProductGalleryPhoto(event.target.files);
            setHideGallery(false);
            setHideUploadGalBtn(true);
            setHideDeleteGalBtn(false);
        }
    }

    const deleteGallery = () => {
        setProductGalleryPhoto([]);
        setHideGallery(true);
        setHideUploadGalBtn(false);
        setHideDeleteGalBtn(true);
    }

    const printImages = () => {
        let images = [];
        [...productGalleryPhoto].map((f) => (
            images.push(URL.createObjectURL(f))
        ))
        return images;
    }

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

        return isValid;
    };

    const submitProduct = (event) => {
        event.preventDefault();
        if (validateInputs() === false) {
            return;
        }

        // axios.get('api/users/csrf/token', {})
        //     .then((response) => {
        //         axios.post('api/products/subcategories/create',
        //             {
        //                 name: productName,
        //                 categoryId: selectCategoryId,
        //             },
        //             {
        //                 headers: {
        //                     'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
        //                     'X-XSRF-TOKEN': response.data.token,
        //                     'Content-Type': 'application/json',
        //                 }
        //             }).then(() => {
        //             toast.success('Product Added!', {
        //                 position: "bottom-center",
        //                 autoClose: 5000,
        //                 hideProgressBar: false,
        //                 closeOnClick: true,
        //                 pauseOnHover: true,
        //                 draggable: false,
        //                 progress: undefined,
        //                 theme: "colored",
        //                 transition: Bounce,
        //             });
        //             navigate('/admin/product');
        //         }).catch((error) => {
        //             toast.error(error.response.data.message, {
        //                 position: "bottom-center",
        //                 autoClose: 3000,
        //                 hideProgressBar: false,
        //                 closeOnClick: true,
        //                 pauseOnHover: true,
        //                 draggable: false,
        //                 progress: undefined,
        //                 theme: "colored",
        //                 transition: Bounce,
        //             });
        //         })
        //     }).catch(() => {
        //     toast.error("Cannot fetch token", {
        //         position: "bottom-center",
        //         autoClose: 3000,
        //         hideProgressBar: false,
        //         closeOnClick: true,
        //         pauseOnHover: true,
        //         draggable: false,
        //         progress: undefined,
        //         theme: "colored",
        //         transition: Bounce,
        //     });
        // });
    }



    return (
        <div className="ProductAdd">
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
                    component="form"
                    onSubmit={submitProduct}
                    noValidate

                >
                    <FormControl variant="outlined"
                                 size={"small"}
                                 autoFocus
                                 required
                                 error={categoryError}
                                 helperText={categoryErrorMsg}
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
                            value={selectCategoryId}
                            onChange={handleCategoryChange}
                            required
                            variant={"filled"}>
                            {
                                categories.map(({id, name}) => (
                                    <MenuItem key={id} value={id}>{name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined"
                                 size={"small"}
                                 required
                                 error={subcategoryError}
                                 helperText={subcategoryErrorMsg}
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
                            value={selectedSubcategoryId}
                            onChange={handleSubcategoryChange}
                            required
                            variant={"filled"}>
                            {
                                subcategories.map(({id, name}) => (
                                    <MenuItem key={id} value={id}>{name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined"
                                 size={"small"}
                                 required
                                 error={countryError}
                                 helperText={countryErrorMsg}
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
                            value={selectedCountryId}
                            onChange={handleCountryChange}
                            required
                            variant={"filled"}>
                            {
                                countries.map(({id, name}) => (
                                    <MenuItem key={id} value={id}>{name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined"
                                 size={"small"}
                                 required
                                 error={manufacturerError}
                                 helperText={manufacturerErrorMsg}
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
                            value={selectedManufacturerId}
                            onChange={handleManufacturerChange}
                            required
                            variant={"filled"}>
                            {
                                manufacturers.map(({id, name}) => (
                                    <MenuItem key={id} value={id}>{name}</MenuItem>
                                ))
                            }
                        </Select>
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
                    { !hideUploadMainBtn &&
                    <Button
                        variant="contained"
                        component="label"
                        fullWidth
                        endIcon={<CloudUploadOutlinedIcon />}
                        sx={{
                            width: '70%',
                            marginBottom: '8px',
                            backgroundColor: 'rgb(39, 99, 24)',
                            "&:hover": {backgroundColor: 'rgb(49,140,23)'}
                        }}
                    >
                        Upload Main Photo
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            multiple={false}
                            onChange={handlePhoto}
                        />
                    </Button>
                    }
                    { !hideDeleteMainBtn &&
                    <Button variant="contained"
                            hidden={hideDeleteMainBtn}
                            fullWidth
                            endIcon={<DeleteOutlineOutlinedIcon />}
                            onClick={deletePhoto}
                            sx={{
                                width: '70%',
                                marginBottom: '8px',
                                backgroundColor: 'rgb(97,12,12)',
                                "&:hover": {backgroundColor: 'rgb(175,38,38)'}
                            }}
                    >
                        Delete Main Photo
                    </Button>
                    }
                    <img alt={"Main photo"} src={image} width={"70%"} hidden={hideMain} />
                    { !hideUploadGalBtn &&
                    <Button
                        variant="contained"
                        component="label"
                        hidden={hideUploadGalBtn}
                        endIcon={<CloudUploadOutlinedIcon />}
                        fullWidth
                        sx={{
                            width: '70%',
                            marginBottom: '8px',
                            backgroundColor: 'rgb(39, 99, 24)',
                            "&:hover": {backgroundColor: 'rgb(49,140,23)'}
                        }}
                    >
                        Upload Gallery Photos
                        <input
                            type="file"
                            accept="image/*"
                            hidden
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
                            <SimpleImageSlider style={{margin: '0 auto 8px auto', border: '1px solid black'}} width={356} height={200} images={printImages()} showNavs={true} showBullets={true}/>
                    }

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
                        Add Product <AddOutlinedIcon />
                    </Button>
                </Box>
            </div>
        </div>
    )
}

export default AddProduct;