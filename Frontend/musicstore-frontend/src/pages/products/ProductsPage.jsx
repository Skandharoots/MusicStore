import {useParams} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import axios from "axios";
import './style/ProductsPage.scss';
import {
    Backdrop,
    Button, CircularProgress,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup, Select, Slider,
    Typography
} from "@mui/material";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Grid from "@mui/material/Grid2";
import ProductItem from "./components/ProductItem.jsx"
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import TextField from "@mui/material/TextField";

function ProductsPage() {

    const [manufacturers, setManufacturers] = useState([]);
    const [selectedManufacturerName, setSelectedManufacturerName] = useState('');
    const [countries, setCountries] = useState([]);
    const [selectedCountryName, setSelectedCountryName] = useState('');
    const [subcategories, setSubcategories] = useState([]);
    const [selectedSubcategoryName, setSelectedSubcategoryName] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(20);

    const [products, setProducts] = useState([]);
    const [sortBy, setSortBy] = useState(JSON.stringify({sortBy: 'dateAdded', direction: 'desc'}));
    const [sliderValue, setSliderValue] = useState([0, 1]);
    const [sliderMaxValue, setSliderMaxValue] = useState(1);
    const [lowPrice, setLowPrice] = useState(0);
    const [highPrice, setHighPrice] = useState(100000);


    const [openBackdrop, setOpenBackdrop] = useState(false);

    const categoryId = useParams();

    useEffect(() => {
        document.title = `${categoryId.name}`;
    }, [categoryId.name]);

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [currentPage]);

    useMemo(() => {
        setSelectedManufacturerName('');
        setSelectedSubcategoryName('');
        setSelectedCountryName('');
        setLowPrice(0);
        setHighPrice(100000);
        setTotalPages(1);
        setCurrentPage(1);
    }, [categoryId.categoryId]);

    useEffect(() => {
        axios.get(`api/products/items/get/max_price/${categoryId.categoryId}`, {
            params: {
                country: selectedCountryName,
                manufacturer: selectedManufacturerName,
                subcategory: selectedSubcategoryName,
            }
        }).then(res => {
                setSliderValue([0, res.data]);
                setSliderMaxValue(res.data);
            }).catch(() => {})
    }, [selectedSubcategoryName, selectedCountryName, selectedManufacturerName, categoryId.categoryId])

    useEffect(() => {
        axios.get(`api/products/subcategories/get/search/${categoryId.categoryId}`, {
            params: {
                country: selectedCountryName,
                manufacturer: selectedManufacturerName,
            }
        }).then((response) => {
                setSubcategories(response.data);
            }).catch(() => {});
    }, [selectedManufacturerName, selectedCountryName, categoryId.categoryId]);

    useEffect(() => {
        axios.get(`api/products/countries/get/search/${categoryId.categoryId}`, {
            params: {
                subcategory: selectedSubcategoryName,
                manufacturer: selectedManufacturerName,
            }
        }).then((response) => {
                setCountries(response.data);
            }).catch(() => {});
    }, [selectedSubcategoryName, selectedManufacturerName, categoryId.categoryId]);

    useEffect(() => {
        axios.get(`api/products/manufacturers/get/search/${categoryId.categoryId}`, {
            params: {
                country: selectedCountryName,
                subcategory: selectedSubcategoryName,
            }
        }).then((response) => {
                setManufacturers(response.data);
            }).catch(() => {});
    }, [selectedSubcategoryName, selectedCountryName, categoryId.categoryId]);

    useEffect(() => {
        setOpenBackdrop(true);
        let sorting = JSON.parse(sortBy);
        axios.get(`api/products/items/get/values/${categoryId.categoryId}`, {
            params: {
                country: selectedCountryName,
                manufacturer: selectedManufacturerName,
                subcategory: selectedSubcategoryName,
                lowPrice: lowPrice,
                highPrice: highPrice,
                sortBy: sorting.sortBy,
                sortDir: sorting.direction,
                page: currentPage - 1,
                pageSize: perPage,
            }
        }).then(res => {
                setProducts(res.data.content);
                setTotalPages(res.data.totalPages);
                if (res.data.totalPages < currentPage) {
                    setCurrentPage(1);
                }
                setOpenBackdrop(false);
            }).catch(() => {
            setOpenBackdrop(false);
        });

    }, [sortBy, selectedSubcategoryName, selectedCountryName, selectedManufacturerName, lowPrice, highPrice , categoryId.categoryId, perPage, currentPage]);


    const changePage = (event, value) => {
        setCurrentPage(value);
    }

    const handleSliderChange = (event, newValue) => {
        setSliderValue(newValue);
    };

    const sliderValueText = (value) => {
        return `${value}$`;
    }

    const handleLowPriceChange = (e) => {
        setSliderValue([e.target.value === '' ? 0 : Number(e.target.value), sliderValue[1]]);
    }

    const handleHighPriceChange = (e) => {
        setSliderValue([sliderValue[0], e.target.value === '' ? sliderMaxValue : Number(e.target.value)]);
    }

    const setLowAndHighPrice = () => {
        setLowPrice(sliderValue[0]);
        setHighPrice(sliderValue[1]);
    }

    return (
        <div className="products-page">

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
                <div className="ribbon-price">
                    <h4 style={{margin: '4px 0'}}>Price range </h4>
                    <div style={{
                        width: '100%',
                        height: 'fit-content',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '4px',
                    }}>
                        <TextField
                            id="lowPrice"
                            type="number"
                            variant="outlined"
                            size="small"
                            value={sliderValue[0]}
                            onChange={handleLowPriceChange}
                            sx={{
                                width: '80px',
                                height: '40px',
                                justifyContent: 'center',
                                input: {
                                    textAlign: "center",
                                    fontSize: '12px',
                                },
                                fontSize: '8px !important',
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
                            id="lowPrice"
                            type="number"
                            variant="outlined"
                            size="small"
                            value={sliderValue[1]}
                            onChange={handleHighPriceChange}
                            sx={{
                                width: '80px',
                                height: '40px',
                                justifyContent: 'center',
                                input: {
                                    textAlign: "center",
                                    fontSize: '12px',
                                },
                                fontSize: '8px !important',
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
                    </div>
                    <div className="ribbon-price-range"
                         style={{
                             display: "flex",
                             justifyContent: "center",
                             alignItems: "center",
                             width: "100%"
                         }}
                    >
                        <Slider
                            getAriaLabel={() => 'Price range'}
                            value={sliderValue}
                            min={0.00}
                            max={sliderMaxValue}
                            step={0.01}
                            onChange={handleSliderChange}
                            valueLabelDisplay="off"
                            getAriaValueText={sliderValueText}
                            sx={{
                                width: '90%',
                                color: 'rgb(39, 99, 24)',
                            }}
                        />
                    </div>
                    <div style={{
                        width: '100%',
                        height: 'fit-content',
                        marginTop: '4px',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Button
                            className="signup-btn"
                            type="submit"
                            fullWidth
                            size="small"
                            variant="contained"
                            onClick={setLowAndHighPrice}
                            sx={{
                                width: '100%',
                                backgroundColor: 'rgb(39, 99, 24)',
                                "&:hover": {backgroundColor: 'rgb(49,140,23)'},
                                "&:focus": {outline: 'none'},
                            }}
                        >
                            Search
                        </Button>
                    </div>
                </div>
            </div>
            <div className="products-page-content">
                <div className="content-controls">
                    <div style={{maxWidth: 100}}>

                    </div>
                    <FormControl
                        size="small"
                        sx={{
                            m: 1,
                            maxWidth: 200,
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
                            <MenuItem value={JSON.stringify({sortBy: 'dateAdded', direction: 'desc'})}>Newest
                                (default)</MenuItem>
                            <MenuItem value={JSON.stringify({sortBy: 'productPrice', direction: 'desc'})}>Price: highest
                                to lowest</MenuItem>
                            <MenuItem value={JSON.stringify({sortBy: 'productPrice', direction: 'asc'})}>Price: lowest
                                to highest</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl
                        size="small"
                        sx={{
                            m: 1,
                            width: 100,
                            maxWidth: 100,
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
                    <Backdrop
                        sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
                        open={openBackdrop}
                    >
                        <CircularProgress color="inherit"/>
                    </Backdrop>
                    <Grid container
                          style={{
                              boxSizing: 'border-box',
                              paddingLeft: '16px',
                              width: '100%',
                              paddingBottom: '16px',
                              borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
                          }}
                          rowSpacing={2.7}
                          columnSpacing={2.7}
                    >
                        {
                            [...products].map((product) => (
                                <ProductItem key={product.id} id={product.id} item={product}/>
                            ))
                        }
                    </Grid>
                    <div style={{
                        display: 'flex',
                        width: '100%',
                        boxSizing: 'border-box',
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        padding: '16px 0 16px 0'
                    }}>
                        <Stack spacing={2} sx={{boxSizing: 'border-box',}}>
                            <Pagination page={currentPage} count={totalPages} onChange={changePage} shape={"rounded"}
                                        sx={{
                                            boxSizing: 'border-box',
                                            '& .MuiPaginationItem-rounded': {
                                                outline: 'none !important',
                                                "&:hover": {
                                                    outline: 'none !important',
                                                    backgroundColor: 'rgba(39, 99, 24, 0.2)'
                                                },
                                            },
                                            '& .Mui-selected': {
                                                backgroundColor: 'rgba(39, 99, 24, 0.5) !important',
                                                "&:hover": {
                                                    outline: 'none !important',
                                                    backgroundColor: 'rgba(39, 99, 24, 0.2) !important'
                                                },
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