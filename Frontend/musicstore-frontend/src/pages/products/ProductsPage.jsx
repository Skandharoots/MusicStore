import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import './style/ProductsPage.scss';
import ribbonImg from '../../assets/ribbon-img.jpg';
import {
    Button,
    FormControl,
    FormControlLabel,
    FormHelperText, InputLabel,
    MenuItem,
    Radio,
    RadioGroup, Select,
    Typography
} from "@mui/material";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Grid from "@mui/material/Grid2";
import ProductItem from "./components/ProductItem.jsx"
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";

const pageSize = 10;

function ProductsPage() {

    const [manufacturers, setManufacturers] = useState([]);
    const [selectedManufacturerName, setSelectedManufacturerName] = useState('');
    const [countries, setCountries] = useState([]);
    const [selectedCountryName, setSelectedCountryName] = useState('');
    const [subcategories, setSubcategories] = useState([]);
    const [selectedSubcategoryName, setSelectedSubcategoryName] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const [products, setProducts] = useState([]);
    const [sortBy, setSortBy] = useState(JSON.stringify({sortBy: 'dateAdded', direction: 'desc'}));
    const [lowPrice, setLowPrice] = useState(0);
    const [highPrice, setHighPrice] = useState(100000);

    const categoryId = useParams();
    const navigate = useNavigate();


    useEffect(() => {
        axios.get(`api/products/subcategories/get/search/${categoryId.categoryId}?country=${selectedCountryName}&manufacturer=${selectedManufacturerName}`)
        .then((response) => {
            setSubcategories(response.data);
        }).catch(() => {});
    }, [selectedManufacturerName, selectedCountryName, categoryId]);

    useEffect(() => {
        axios.get(`api/products/countries/get/search/${categoryId.categoryId}?subcategory=${selectedSubcategoryName}&manufacturer=${selectedManufacturerName}`)
            .then((response) => {
                setCountries(response.data);
            }).catch(() => {});
    }, [selectedSubcategoryName, selectedManufacturerName, categoryId]);

    useEffect(() => {
        axios.get(`api/products/manufacturers/get/search/${categoryId.categoryId}?country=${selectedCountryName}&subcategory=${selectedSubcategoryName}`)
            .then((response) => {
                setManufacturers(response.data);
            }).catch(() => {});
    }, [selectedSubcategoryName, selectedCountryName, categoryId]);

    useEffect(() => {
        let sorting = JSON.parse(sortBy);
        axios.get(`api/products/items/get/values/${categoryId.categoryId}?country=${selectedCountryName}&manufacturer=${selectedManufacturerName}&subcategory=${selectedSubcategoryName}&lowPrice=${lowPrice}&highPrice=${highPrice}&sortBy=${sorting.sortBy}&sortDir=${sorting.direction}&page=${currentPage - 1}&pageSize=${pageSize}`)
            .then(res => {
                setProducts(res.data.content);
                setTotalPages(res.data.totalPages);
                setTotalElements(res.data.numberOfElements);
            }).catch(() => {});

    }, [sortBy, selectedSubcategoryName, selectedCountryName, selectedManufacturerName, categoryId]);


    const changePage = (event, value) => {
        setCurrentPage(value);
    }

    return (
        <div className="products-page">
            <div className="products-page-ribbon-wrapper">
                <div className="products-page-ribbon">
                    <div className="products-ribbon-image">
                        <div className="img-container">
                            <img src={ribbonImg}
                                 alt={"For music enthusiasts"}
                                 style={{
                                     objectFit: 'cover',
                                     maxWidth: '100%',
                                     maxHeight: '100%',
                                     display: 'block',
                                     flexShrink: '0',
                                     flexGrow: '0',
                                     borderRadius: '4em',
                                 }}
                            />
                        </div>
                    </div>
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
                <div className="content-controls">
                    <FormControl
                        size="small"
                        sx={{
                        m: 1,
                        minWidth: 300,
                        "& label.Mui-focused": {
                            color: 'rgb(39, 99, 24)'
                        },
                        "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                                borderColor: 'rgb(39, 99, 24)'
                            }
                        }
                    }}>
                        <InputLabel id="sortBy-label">Sort by:</InputLabel>
                        <Select
                            labelId="sortBy-label"
                            id="sortBy"
                            value={sortBy}
                            label="Sort by:"
                            onChange={e => setSortBy(e.target.value)}
                            variant={"outlined"}
                        >
                            <MenuItem value={JSON.stringify({sortBy: 'dateAdded', direction: 'desc'})}>Newest (default)</MenuItem>
                            <MenuItem value={JSON.stringify({sortBy: 'productPrice', direction: 'desc'})}>Price (from highest)</MenuItem>
                            <MenuItem value={JSON.stringify({sortBy: 'productPrice', direction: 'asc'})}>Price (from lowest)</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className="content-grid">
                    <Grid container style={{ marginLeft: '16px'}} rowSpacing={3} columnSpacing={3}>
                        {
                            [...products].map((product) => (
                                <ProductItem key={product.id} id={product.id} item={product}/>
                            ))
                        }
                    </Grid>
                    <div  style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: '16px 0 16px 0'}}>
                        <Stack spacing={2}>
                            <Pagination page={currentPage} count={totalPages} onChange={changePage} shape={"rounded"}
                                        sx={{
                                            '& .MuiPaginationItem-rounded': {
                                                outline: 'none !important',
                                                "&:hover": {outline: 'none !important', backgroundColor: 'rgba(39, 99, 24, 0.2)'},
                                            },
                                            '& .Mui-selected': {
                                                backgroundColor: 'rgba(39, 99, 24, 0.5) !important',
                                                "&:hover": {outline: 'none !important', backgroundColor: 'rgba(39, 99, 24, 0.2) !important'},
                                            }
                                        }}
                            />
                        </Stack>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductsPage;