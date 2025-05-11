import {useParams} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import axios from "axios";
import {styled} from "@mui/material/styles";
import {
    Backdrop,
    Button,
    CircularProgress,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    Slider,
    Typography,
    Box,
    Stack,
    Pagination,
    TextField,
} from "@mui/material";
import { useTheme } from "@mui/material";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Grid from "@mui/material/Grid2";
import ProductItem from "./components/ProductItem.jsx"

const ProductsPageContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    width: '100%',
    padding: 0,
    margin: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row',
    minHeight: '80dvh',
    color: 'black',
    boxSizing: 'border-box',
    '& input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button': {
        WebkitAppearance: 'none',
        margin: 0,
    },
    '& input[type="number"]': {
        MozAppearance: 'textfield',
    },
}));

const ProductsPageRibbon = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    color: theme.palette.text.primary,
    width: '240px',
    minWidth: '240px',
    overflow: 'hidden',
    margin: '0 0',
    padding: 0,
    height: '100%',
    minHeight: '80vh',
    boxSizing: 'border-box',
    [theme.breakpoints.down('sm')]: {
        display: 'none !important',
    },
}));

const ProductsRibbonImage = styled(Box)(({ theme }) => ({
    width: '100%',
    height: 'fit-content',
    maxHeight: '250px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
}));

const ImgContainer = styled(Box)(({ theme }) => ({
    width: '80%',
    height: '72px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundSize: 'cover',
}));

const RibbonHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    color: theme.palette.text.primary,
    justifyContent: 'space-between',
    width: '100%',
    padding: '16px 8px 0 8px',
    height: 'fit-content',
    borderTop: '1px solid ' + theme.palette.divider,
}));

const RibbonSection = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    color: theme.palette.text.primary,
    width: '100%',
    padding: '0 8px',
    height: 'fit-content',
}));

const ProductsPageContent = styled(Box)(({ theme }) => ({
    margin: '0 0',
    width: '781px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    boxSizing: 'border-box',
    borderLeft: '1px solid ' + theme.palette.divider,
    minHeight: '80dvh',
}));

const ContentControls = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: theme.palette.text.primary,
    padding: '8px 0',
    width: '100%',
    boxSizing: 'border-box',
    borderBottom: 'solid 1px ' + theme.palette.divider,
}));

const ContentGrid = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: '16px',
    width: '100%',
    boxSizing: 'border-box',
}));

const StyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: 'transparent',
    color: theme.palette.text.primary,
    fontSize: '8px',
    height: 'fit-content',
    padding: '0 0',
    "&:hover": {
        boxShadow: '0 5px 15px ' + theme.palette.shadowLink.main,
    },
    "&:focus": {
        outline: 'none !important',
    }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    width: '80px',
    height: '40px',
    justifyContent: 'center',
    '& input': {
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
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
    color: theme.palette.text.primary,
    "& label.Mui-focused": {
        color: 'rgb(39, 99, 24)'
    },
    "& .MuiOutlinedInput-root": {
        "&.Mui-focused fieldset": {
            borderColor: 'rgb(39, 99, 24)'
        }
    }
}));

const StyledButton2 = styled(Button)(({ theme }) => ({
    backgroundColor: 'rgb(39, 99, 24)',
    color: theme.palette.mybutton.colorTwo,
    "&:hover": {backgroundColor: 'rgb(49,140,23)'},
    "&:focus": {outline: 'none'},
}));

function ProductsPage() {

    const [manufacturers, setManufacturers] = useState([]);
    const [selectedManufacturerName, setSelectedManufacturerName] = useState('');
    const [countries, setCountries] = useState([]);
    const [selectedCountryName, setSelectedCountryName] = useState('');
    const [subcategories, setSubcategories] = useState([]);
    const [selectedSubcategoryName, setSelectedSubcategoryName] = useState('');
    const [subcategoriesTierTwo, setSubcategoriesTierTwo] = useState([]);
    const [selectedSubcategoryTierTwoName, setSelectedSubcategoryTierTwoName] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [disableSubcategory, setDisableSubcategory] = useState(false);

    const [products, setProducts] = useState([]);
    const [sortBy, setSortBy] = useState(JSON.stringify({sortBy: 'date_added', direction: 'desc'}));
    const [sliderValue, setSliderValue] = useState([0, 1]);
    const [sliderMaxValue, setSliderMaxValue] = useState(1);
    const [lowPrice, setLowPrice] = useState(0);
    const [highPrice, setHighPrice] = useState(100000);


    const [openBackdrop, setOpenBackdrop] = useState(false);

    const categoryId = useParams();

    const theme = useTheme();

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
                subcategoryTierTwo: selectedSubcategoryTierTwoName
            }
        }).then(res => {
                setSliderValue([0, res.data]);
                setSliderMaxValue(res.data);
            }).catch(() => {})
    }, [selectedSubcategoryName, selectedCountryName, selectedManufacturerName, selectedSubcategoryTierTwoName, categoryId.categoryId])

    useEffect(() => {
        axios.get(`api/products/subcategories/get/search/${categoryId.categoryId}`, {
            params: {
                country: selectedCountryName,
                manufacturer: selectedManufacturerName,
                subcategoryTierTwo: selectedSubcategoryTierTwoName
            }
        }).then((response) => {
                setSubcategories(response.data);
            }).catch(() => {});
    }, [selectedManufacturerName, selectedCountryName, selectedSubcategoryTierTwoName, categoryId.categoryId]);

    useEffect(() => {
        axios.get(`api/products/countries/get/search/${categoryId.categoryId}`, {
            params: {
                subcategory: selectedSubcategoryName,
                manufacturer: selectedManufacturerName,
                subcategoryTierTwo: selectedSubcategoryTierTwoName
            }
        }).then((response) => {
                setCountries(response.data);
            }).catch(() => {});
    }, [selectedSubcategoryName, selectedManufacturerName, selectedSubcategoryTierTwoName, categoryId.categoryId]);

    useEffect(() => {
        axios.get(`api/products/manufacturers/get/search/${categoryId.categoryId}`, {
            params: {
                country: selectedCountryName,
                subcategory: selectedSubcategoryName,
                subcategoryTierTwo: selectedSubcategoryTierTwoName
            }
        }).then((response) => {
                setManufacturers(response.data);
            }).catch(() => {});
    }, [selectedSubcategoryName, selectedCountryName, selectedSubcategoryTierTwoName, categoryId.categoryId]);

    useEffect(() => {
        axios.get(`api/products/subcategory_tier_two/get/search/${categoryId.categoryId}`, {
            params: {
                subcategory: selectedSubcategoryName,
                country: selectedCountryName,
                manufacturer: selectedManufacturerName,
            }
        }).then((response) => {
            setSubcategoriesTierTwo(response.data);
        }).catch(() => {});
    }, [selectedSubcategoryName, selectedCountryName, selectedManufacturerName, categoryId.categoryId]);

    useEffect(() => {
        setOpenBackdrop(true);
        let sorting = JSON.parse(sortBy);
        axios.get(`api/products/items/get/values/${categoryId.categoryId}`, {
            params: {
                country: selectedCountryName,
                manufacturer: selectedManufacturerName,
                subcategory: selectedSubcategoryName,
                subcategoryTierTwo: selectedSubcategoryTierTwoName,
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

    }, [sortBy, selectedSubcategoryName, selectedCountryName, selectedManufacturerName, selectedSubcategoryTierTwoName, lowPrice, highPrice , categoryId.categoryId, perPage, currentPage]);


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
        <ProductsPageContainer>
            <ProductsPageRibbon>
                <ProductsRibbonImage>
                    <ImgContainer />
                </ProductsRibbonImage>
                <RibbonHeader>
                    <Typography variant="h6" sx={{ margin: '4px 0' }}>Filters</Typography>
                    <StyledButton
                        endIcon={<CloseOutlinedIcon fontSize="small"/>}
                        onClick={() => {
                            setSelectedSubcategoryName('');
                            setSelectedManufacturerName('');
                            setSelectedCountryName('');
                        }}
                    >
                        Clear
                    </StyledButton>
                </RibbonHeader>
                <RibbonSection>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        height: 'fit-content',
                        padding: "0",
                    }}>
                        <Typography variant="h6" sx={{ margin: '4px 0' }}>Subcategories</Typography>
                        <StyledButton
                            endIcon={<CloseOutlinedIcon fontSize="small"/>}
                            onClick={() => {setSelectedSubcategoryName(''); setDisableSubcategory(false)}}
                        >
                            Clear
                        </StyledButton>
                    </Box>
                    <StyledFormControl>
                        <RadioGroup
                            value={selectedSubcategoryName}
                            onChange={e => {setSelectedSubcategoryName(e.target.value); setDisableSubcategory(true)}}
                            name="radio-buttons-subcategory"
                        >
                            {[...subcategories].map((subcat, index) => (
                                <FormControlLabel
                                    disabled={disableSubcategory}
                                    value={subcat.name}
                                    key={subcat.id}
                                    id={index}
                                    control={<Radio size={"small"} color="success"/>}
                                    label={<Typography variant="body2" color="textSecondary">{subcat.name}</Typography>}
                                />
                            ))}
                        </RadioGroup>
                    </StyledFormControl>
                </RibbonSection>
                {(disableSubcategory && subcategoriesTierTwo.length > 0) && (
                        <RibbonSection>
                            <Box sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "100%",
                                height: 'fit-content',
                                padding: "0",
                            }}>
                                <Typography variant="h7" sx={{ margin: '4px 0' }}>Sub subcategories</Typography>
                                <StyledButton
                                    endIcon={<CloseOutlinedIcon fontSize="small"/>}
                                    onClick={() => {setSelectedSubcategoryTierTwoName('');}}
                                >
                                    Clear
                                </StyledButton>
                            </Box>
                            <StyledFormControl>
                                <RadioGroup
                                    value={selectedSubcategoryTierTwoName}
                                    onChange={e => {setSelectedSubcategoryTierTwoName(e.target.value)}}
                                    name="radio-buttons-subcategory"
                                >
                                    {[...subcategoriesTierTwo].map((subcat, index) => (
                                        <FormControlLabel
                                            value={subcat.name}
                                            key={subcat.id}
                                            id={index}
                                            control={<Radio size={"small"} color="success"/>}
                                            label={<Typography variant="body2" color="textSecondary">{subcat.name}</Typography>}
                                        />
                                    ))}
                                </RadioGroup>
                            </StyledFormControl>
                        </RibbonSection>
                )
                }
                <RibbonSection>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%"
                    }}>
                        <Typography variant="h6" sx={{ margin: '4px 0' }}>Manufacturers</Typography>
                        <StyledButton
                            endIcon={<CloseOutlinedIcon fontSize="small"/>}
                            onClick={() => setSelectedManufacturerName('')}
                        >
                            Clear
                        </StyledButton>
                    </Box>
                    <StyledFormControl>
                        <RadioGroup
                            value={selectedManufacturerName}
                            onChange={e => setSelectedManufacturerName(e.target.value)}
                            name="radio-buttons-manufacturer"
                        >
                            {[...manufacturers].map((man, index) => (
                                <FormControlLabel
                                    value={man.name}
                                    key={man.id}
                                    id={index}
                                    control={<Radio size={"small"} color="success"/>}
                                    label={<Typography variant="body2" color="textSecondary">{man.name}</Typography>}
                                />
                            ))}
                        </RadioGroup>
                    </StyledFormControl>
                </RibbonSection>
                <RibbonSection>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%"
                    }}>
                        <Typography variant="h6" sx={{ margin: '4px 0' }}>Produced in</Typography>
                        <StyledButton
                            endIcon={<CloseOutlinedIcon fontSize="small"/>}
                            onClick={() => setSelectedCountryName('')}
                        >
                            Clear
                        </StyledButton>
                    </Box>
                    <StyledFormControl>
                        <RadioGroup
                            value={selectedCountryName}
                            onChange={e => setSelectedCountryName(e.target.value)}
                            name="radio-buttons-manufacturer"
                        >
                            {[...countries].map((count, index) => (
                                <FormControlLabel
                                    value={count.name}
                                    key={count.id}
                                    id={index}
                                    control={<Radio size={"small"} color="success"/>}
                                    label={<Typography variant="body2" color="textSecondary">{count.name}</Typography>}
                                />
                            ))}
                        </RadioGroup>
                    </StyledFormControl>
                </RibbonSection>
                <RibbonSection>
                    <Typography variant="h6" sx={{ margin: '4px 0' }}>Price range</Typography>
                    <Box sx={{
                        width: '100%',
                        height: 'fit-content',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '4px',
                    }}>
                        <StyledTextField
                            id="lowPrice"
                            type="number"
                            variant="outlined"
                            size="small"
                            value={sliderValue[0]}
                            onChange={handleLowPriceChange}
                        />
                        <StyledTextField
                            id="highPrice"
                            type="number"
                            variant="outlined"
                            size="small"
                            value={sliderValue[1]}
                            onChange={handleHighPriceChange}
                        />
                    </Box>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%"
                    }}>
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
                    </Box>
                    <Box sx={{
                        width: '100%',
                        height: 'fit-content',
                        marginTop: '4px',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <StyledButton2 
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
                        </StyledButton2>
                    </Box>
                </RibbonSection>
            </ProductsPageRibbon>
            <ProductsPageContent>
                <ContentControls>
                    <Box sx={{width: '15%'}} />
                    <StyledFormControl size="small" sx={{ m: 1, maxWidth: 200 }}>
                        <InputLabel id="sortBy-label">Sort by:</InputLabel>
                        <Select
                            labelId="sortBy-label"
                            id="sortBy"
                            value={sortBy}
                            label="Sort by:"
                            onChange={e => setSortBy(e.target.value)}
                            variant={"outlined"}
                        >
                            <MenuItem value={JSON.stringify({sortBy: 'date_added', direction: 'desc'})}>Newest (default)</MenuItem>
                            <MenuItem value={JSON.stringify({sortBy: 'product_price', direction: 'desc'})}>Price: highest to lowest</MenuItem>
                            <MenuItem value={JSON.stringify({sortBy: 'product_price', direction: 'asc'})}>Price: lowest to highest</MenuItem>
                        </Select>
                    </StyledFormControl>
                    <StyledFormControl size="small" sx={{ m: 1, width: 100, maxWidth: 100 }}>
                        <InputLabel id="pageSize-label">Page size</InputLabel>
                        <Select
                            labelId="pageSize-label"
                            id="pageSize"
                            value={perPage}
                            label="Page size"
                            onChange={e => setPerPage(e.target.value)}
                            variant={"outlined"}
                        >
                            <MenuItem value={20}>20</MenuItem>
                            <MenuItem value={30}>30</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                        </Select>
                    </StyledFormControl>
                </ContentControls>
                <ContentGrid>
                    <Backdrop
                        sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
                        open={openBackdrop}
                    >
                        <CircularProgress color="inherit"/>
                    </Backdrop>
                    <Grid
                        container
                        sx={{
                            boxSizing: 'border-box',
                            paddingLeft: '16px',
                            width: '100%',
                            paddingBottom: '16px',
                            borderBottom: '1px solid ' + theme.palette.divider,
                        }}
                        rowSpacing={2.7}
                        columnSpacing={2.7}
                    >
                        {[...products].map((product) => (
                            <ProductItem key={product.id} id={product.id} item={product}/>
                        ))}
                    </Grid>
                    <Box sx={{
                        display: 'flex',
                        width: '100%',
                        boxSizing: 'border-box',
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        padding: '16px 0 16px 0'
                    }}>
                        <Stack spacing={2} sx={{boxSizing: 'border-box'}}>
                            <Pagination
                                page={currentPage}
                                count={totalPages}
                                onChange={changePage}
                                shape={"rounded"}
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
                    </Box>
                </ContentGrid>
            </ProductsPageContent>
        </ProductsPageContainer>
    )
}

export default ProductsPage;