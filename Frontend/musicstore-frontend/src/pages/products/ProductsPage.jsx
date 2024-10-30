import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import './style/ProductsPage.scss';
import {Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography} from "@mui/material";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';


function ProductsPage() {

    const [manufacturers, setManufacturers] = useState([]);
    const [selectedManufacturerName, setSelectedManufacturerName] = useState('');
    const [countries, setCountries] = useState([]);
    const [selectedCountryName, setSelectedCountryName] = useState('');
    const [subcategories, setSubcategories] = useState([]);
    const [selectedSubcategoryName, setSelectedSubcategoryName] = useState('');

    const categoryId = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`api/products/subcategories/get/search/${categoryId.categoryId}?country=${selectedCountryName}&manufacturer=${selectedManufacturerName}`)
        .then((response) => {
            setSubcategories(response.data);
        }).catch(() => {});
    }, [selectedManufacturerName, selectedCountryName]);

    useEffect(() => {
        axios.get(`api/products/countries/get/search/${categoryId.categoryId}?subcategory=${selectedSubcategoryName}&manufacturer=${selectedManufacturerName}`)
            .then((response) => {
                setCountries(response.data);
            }).catch(() => {});
    }, [selectedSubcategoryName, selectedManufacturerName]);

    useEffect(() => {
        axios.get(`api/products/manufacturers/get/search/${categoryId.categoryId}?country=${selectedCountryName}&subcategory=${selectedSubcategoryName}`)
            .then((response) => {
                setManufacturers(response.data);
            }).catch(() => {});
    }, [selectedSubcategoryName, selectedCountryName]);

    return (
        <div className="products-page">
            <div className="products-page-ribbon-wrapper">
                <div className="products-page-ribbon">
                    <div className="ribbon-header">
                        <h4 style={{margin: '4px 0'}}>Filters</h4>
                        <Button
                            sx={{
                                backgroundColor: 'transparent',
                                color: 'rgba(0,0,0,0.7)',
                                fontSize: '8px',
                                height: 'fit-content',
                                padding: '0 0',
                                "&:hover": {
                                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
                                },
                                "&:focus": {
                                    outline: 'none !important',
                                }
                            }}
                            endIcon={<CloseOutlinedIcon fontSize="small"/>}
                            onClick={() => {
                                setSelectedSubcategoryName('');
                                setSelectedManufacturerName('');
                                setSelectedCountryName('');
                            }}
                        >
                            Clear
                        </Button>
                    </div>
                    <div className="ribbon-subcat">
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                            height: 'fit-content',
                            padding: "0",
                        }}>
                            <h4 style={{margin: '4px 0'}}>Subcategories</h4>
                            <Button
                                sx={{
                                    backgroundColor: 'transparent',
                                    color: 'rgba(0,0,0,0.7)',
                                    fontSize: '8px',
                                    height: 'fit-content',
                                    padding: '0 0',
                                    "&:hover": {
                                        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
                                    },
                                    "&:focus": {
                                        outline: 'none !important',
                                    }
                                }}
                                endIcon={<CloseOutlinedIcon fontSize="small"/>}
                                onClick={() => {
                                    setSelectedSubcategoryName('')
                                }}
                            >
                                Clear
                            </Button>
                        </div>

                        <FormControl sx={{color: 'rgba(0, 0, 0, 0.5)'}}>
                            <RadioGroup
                                value={selectedSubcategoryName}
                                onChange={e => setSelectedSubcategoryName(e.target.value)}
                                name="radio-buttons-subcategory"

                            >
                                {
                                    [...subcategories].map((subcat, index) => (
                                        <FormControlLabel value={subcat.name}
                                                          key={subcat.id}
                                                          id={index}
                                                          control={<Radio size={"small"} color="success"/>}
                                                          label={<Typography variant="body2"
                                                                             color="textSecondary">{subcat.name}</Typography>}
                                        />
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <div className="ribbon-manufacturer">
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%"
                        }}>
                            <h4 style={{margin: '4px 0'}}>Manufacturers</h4>
                            <Button
                                sx={{
                                    backgroundColor: 'transparent',
                                    color: 'rgba(0,0,0,0.7)',
                                    fontSize: '8px',
                                    height: 'fit-content',
                                    padding: '0 0',
                                    "&:hover": {
                                        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
                                    },
                                    "&:focus": {
                                        outline: 'none !important',
                                    }
                                }}
                                endIcon={<CloseOutlinedIcon fontSize="small"/>}
                                onClick={() => {
                                    setSelectedManufacturerName('')
                                }}
                            >
                                Clear
                            </Button>
                        </div>

                        <FormControl sx={{color: 'rgba(0, 0, 0, 0.5)'}}>
                            <RadioGroup
                                value={selectedManufacturerName}
                                onChange={e => setSelectedManufacturerName(e.target.value)}
                                name="radio-buttons-manufacturer"

                            >
                                {
                                    [...manufacturers].map((man, index) => (
                                        <FormControlLabel value={man.name}
                                                          key={man.id}
                                                          id={index}
                                                          control={<Radio size={"small"} color="success"/>}
                                                          label={<Typography variant="body2"
                                                                             color="textSecondary">{man.name}</Typography>}
                                        />
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <div className="ribbon-country">
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%"
                        }}>
                            <h4 style={{margin: '4px 0'}}>Produced in</h4>
                            <Button
                                sx={{
                                    backgroundColor: 'transparent',
                                    color: 'rgba(0,0,0,0.7)',
                                    fontSize: '8px',
                                    height: 'fit-content',
                                    padding: '0 0',
                                    "&:hover": {
                                        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
                                    },
                                    "&:focus": {
                                        outline: 'none !important',
                                    }
                                }}
                                endIcon={<CloseOutlinedIcon fontSize="small"/>}
                                onClick={() => {
                                    setSelectedCountryName('')
                                }}
                            >
                                Clear
                            </Button>
                        </div>
                        <FormControl sx={{color: 'rgba(0, 0, 0, 0.5)'}}>
                            <RadioGroup
                                value={selectedCountryName}
                                onChange={e => setSelectedCountryName(e.target.value)}
                                name="radio-buttons-manufacturer"

                            >
                                {
                                    [...countries].map((count, index) => (
                                        <FormControlLabel value={count.name}
                                                          key={count.id}
                                                          id={index}
                                                          control={<Radio size={"small"} color="success"/>}
                                                          label={<Typography variant="body2"
                                                                             color="textSecondary">{count.name}</Typography>}
                                        />
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>
                    </div>
                </div>
            </div>

            <div className="products-page-content">
                <h1>Content</h1>
            </div>
        </div>
    )
}

export default ProductsPage;