import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import './style/ProductsPage.scss';
import {
    Button,
    FormControl,
    FormControlLabel,
    InputLabel,
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
    const [perPage, setPerPage] = useState(20);

    const [products, setProducts] = useState([]);
    const [sortBy, setSortBy] = useState(JSON.stringify({sortBy: 'dateAdded', direction: 'desc'}));
    const [lowPrice, setLowPrice] = useState(0);
    const [highPrice, setHighPrice] = useState(100000);

    const categoryId = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = `${categoryId.name}`;
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [currentPage]);

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
        axios.get(`api/products/items/get/values/${categoryId.categoryId}?country=${selectedCountryName}&manufacturer=${selectedManufacturerName}&subcategory=${selectedSubcategoryName}&lowPrice=${lowPrice}&highPrice=${highPrice}&sortBy=${sorting.sortBy}&sortDir=${sorting.direction}&page=${currentPage - 1}&pageSize=${perPage}`)
            .then(res => {
                setProducts(res.data.content);
                setTotalPages(res.data.totalPages);
                setTotalElements(res.data.numberOfElements);
            }).catch(() => {});

    }, [sortBy, selectedSubcategoryName, selectedCountryName, selectedManufacturerName, categoryId, perPage, currentPage]);


    const changePage = (event, value) => {
        setCurrentPage(value);
    }

    return (
        <div className="products-page">
            <div className="products-page-ribbon-wrapper">
                <div className="products-page-ribbon">
                    <div className="products-ribbon-image">
                        <div className="img-container">
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
                    <div>

                    </div>
                    <FormControl
                        size="small"
                        sx={{
                        m: 1,
                        minWidth: 200,
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
                            <MenuItem value={JSON.stringify({sortBy: 'productPrice', direction: 'desc'})}>Price: highest to lowest</MenuItem>
                            <MenuItem value={JSON.stringify({sortBy: 'productPrice', direction: 'asc'})}>Price: lowest to highest</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl
                        size="small"
                        sx={{
                            m: 1,
                            minWidth: 100,
                            "& label.Mui-focused": {
                                color: 'rgb(39, 99, 24)'
                            },
                            "& .MuiOutlinedInput-root": {
                                "&.Mui-focused fieldset": {
                                    borderColor: 'rgb(39, 99, 24)'
                                }
                            }
                        }}>
                        <InputLabel id="sortBy-label">Page size</InputLabel>
                        <Select
                            labelId="sortBy-label"
                            id="sortBy"
                            value={perPage}
                            label="Page size"
                            onChange={e => setPerPage(e.target.value)}
                            variant={"outlined"}
                        >
                            <MenuItem value={20}>20</MenuItem>
                            <MenuItem value={30}>30</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className="content-grid">
                    <Grid container style={{ marginLeft: '16px', paddingBottom: '16px', borderBottom: '1px solid rgba(0, 0, 0, 0.1)'}} rowSpacing={2} columnSpacing={2}>
                        {
                            [...products].map((product) => (
                                <ProductItem key={product.id} id={product.id} item={product}/>
                            ))
                        }
                    </Grid>
                    <div  style={{display: 'flex', width: '100%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', padding: '16px 0 16px 0'}}>
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