import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import './style/ProductsDetailsPage.scss';
import {Gallery} from "./components/Gallery.jsx";
import {Button, FormControl, MenuItem, Select} from "@mui/material";
import ShareIcon from '@mui/icons-material/Share';
import axios from "axios";


function ProductDetailsPage() {

    const [imageGallery, setImageGallery] = useState([]);
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productQuantity, setProductQuantity] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [manufacturerName, setManufacturerName] = useState('');
    const [subcategoryName, setSubcategoryName] = useState('');
    const [countryName, setCountryName] = useState('');


    const [selectedQuantity, setSelectedQuantity] = useState(1);

    const productId = useParams();

    useEffect(() => {
        document.title = `Product page`;
    }, []);

    useEffect(() => {
        axios.get(`api/products/items/get/${productId.productSkuId}`)
        .then(res => {
            setProductName(res.data.productName);
            setProductDescription(res.data.productDescription);
            setProductPrice(res.data.productPrice);
            setProductQuantity(res.data.inStock);
            setCategoryName(res.data.category.name);
            setManufacturerName(res.data.manufacturer.name);
            setSubcategoryName(res.data.subcategory.name);
            setCountryName(res.data.builtinCountry.name);
            axios.get(`api/azure/list?path=${res.data.productSkuId}`)
            .then(res => {
                [...res.data].map((path) => (
                    axios.get(`api/azure/read?path=${path}`, {responseType: 'blob'})
                    .then(res => {
                        let blob = new Blob([res.data], { type: "image/*" });
                        setImageGallery(oldGallery => [blob,...oldGallery]);
                    }).catch(() => {})
                ))
            }).catch(() => {})
        }).catch(() => {});
    }, [productId.productSkuId]);

    const renderQuantityItems = () => {
        let items = []
        for (let i = 1; i < 10; i++) {
            if (i + 1 <= productQuantity) {
                items.push(<MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>)
            }
        }
        return items;
    }

    let inStockBanner;

    if (productQuantity >= 10) {
        inStockBanner = <p style={{
            margin: '0',
            fontSize: '20px',
            fontWeight: 'bold',
            color: 'rgb(53,166,26)'
        }}>In Stock</p>
    } else {
        inStockBanner = <p style={{
            margin: '0',
            fontSize: '20px',
            fontWeight: 'bold',
            color: 'rgb(184,16,16)'
        }}>Last items</p>
    }

    return (
        <div className="productDetails">
            <div className="productDetails-header">
                <div
                    style={{
                        maxWidth: "1200px",
                        width: "45%",
                        aspectRatio: "10 / 6",

                    }}>
                    <Gallery imageBinaries={imageGallery}/>
                </div>
                <div className="productDetails-info">
                    <div
                        style={{
                            width: "100%",
                            height: "fit-content",
                            display: "flex",
                            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <p style={{
                            margin: '0',
                            fontSize: '26px',
                            fontWeight: 'bold',
                            fontStyle: 'italic',
                            height: 'fit-content'
                        }}>{productName}</p>
                    </div>
                    <div style={{
                        width: '100%',
                        height: 'fit-content',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginTop: '1rem',
                    }}>
                        <div style={{
                            width: "48%",
                            height: "fit-content",
                            display: "flex",
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',

                        }}>
                            <div style={{
                                width: "100%",
                                height: "fit-content",
                                display: "flex",
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
                            }}>
                                <p style={{margin: '0', fontSize: '14px'}}>Category: {categoryName}</p>
                                <p style={{margin: '0', fontSize: '14px'}}>Subcategory: {subcategoryName}</p>
                                <p style={{margin: '0', fontSize: '14px'}}>Manufacturer: {manufacturerName}</p>
                                <p style={{margin: '0 0 8px 0', width: '100%', fontSize: '14px',}}>Produced in: {countryName}</p>
                            </div>
                        </div>
                        <div style={{
                            width: "50%",
                            height: "fit-content",
                            display: "flex",
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            border: '1px solid rgba(0, 0, 0, 0.1)',
                            borderRadius: '0.5em',
                        }}>
                            <div style={{
                                width: '100%',
                                boxSizing: 'border-box',
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '0 5% 0 0',
                                justifyContent: 'flex-end',
                                alignItems: 'flex-end',
                                borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
                            }}>
                                <p style={{margin: '0', fontSize: '24px', fontWeight: 'bold'}}>{productPrice}$</p>
                                {
                                    inStockBanner
                                }
                            </div>
                            <div style={{
                                width: '100%',
                                height: '80px',
                                boxSizing: 'border-box',
                                padding: '0 5% 0 5%',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                                <FormControl
                                    size="small"
                                    autoFocus
                                    sx={{
                                        m: 1,
                                        width: 'fit-content',
                                        height: 'fit-content',
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
                                    <Select
                                        id="quantity-select"
                                        disabled={productQuantity === 0}
                                        value={selectedQuantity}
                                        onChange={e => setSelectedQuantity(e.target.value)}
                                        variant={"outlined"}
                                        sx={{
                                            height: '40px',
                                        }}
                                    >
                                        <MenuItem key={1} value={1}>1</MenuItem>
                                        {renderQuantityItems()}
                                    </Select>
                                </FormControl>
                                <Button
                                    className="purchase-btn"
                                    fullWidth
                                    variant="contained"
                                    disabled={productQuantity === 0}
                                    sx={{
                                        width: '60%',
                                        height: '40px',
                                        padding: '0',
                                        borderRadius: '1em',
                                        fontSize: '10px',
                                        backgroundColor: 'rgb(39, 99, 24)',
                                        "&:hover": {backgroundColor: 'rgb(49,140,23)'}
                                    }}
                                >
                                    Add to basket
                                </Button>
                            </div>
                            <div style={{
                                width: '100%',
                                height: 'fit-content',
                                boxSizing: 'border-box',
                                padding: '0 5% 0 10%',
                                marginBottom: '4px',
                                display: 'flex',
                                justifyContent: 'flex-end',
                                alignItems: 'center'
                            }}>
                                <Button
                                    variant={"outlined"}
                                    fullWidth={false}
                                    sx={{
                                        borderColor: 'rgb(39, 99, 24)',
                                        backgroundColor: 'transparent',
                                        width: 'fit-content',
                                        minWidth: '0',
                                        color: 'rgb(39, 99, 24)',
                                        height: '35px',
                                        display: 'flex',
                                        borderRadius: '0.5em',
                                        "&:hover": {
                                            backgroundColor: 'rgba(49,140,23, 0.2)',
                                            outline: 'none !important',
                                            borderColor: 'rgb(39, 99, 24)',
                                        },
                                        "&:focus": {
                                            backgroundColor: 'rgba(49,140,23, 0.2)',
                                            outline: 'none !important',
                                            borderColor: 'rgb(39, 99, 24)',
                                        }
                                    }}
                                >
                                    <p style={{margin: '0', fontSize: '16px'}}>Share</p>
                                    <ShareIcon size={"small"} sx={{color: 'rgb(39, 99, 24)', fontSize: '16px'}}/>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="product-description" dangerouslySetInnerHTML={{__html: productDescription}} style={{
                width: '100%',
                height: 'fit-content',

                boxSizing: 'border-box',
            }}>
            </div>
        </div>
    )
}

export default ProductDetailsPage;