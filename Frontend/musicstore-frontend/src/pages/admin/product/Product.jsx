import {Backdrop, Button, CircularProgress, Stack, Pagination, TextField, IconButton, Box, Typography, styled, InputBase} from "@mui/material";
import Grid from '@mui/material/Grid2';
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";
import ProductItem from "./components/ProductItem.jsx";
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";
import {Slide, toast} from "react-toastify";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import {RestoreRounded} from "@mui/icons-material";

const ProductContainer = styled(Box)(({theme}) => ({
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '80dvh',
    width: '796px',
    borderLeft: '1px solid ' + theme.palette.divider,
}));

const PageTitle = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
    alignItems: 'center',
    color: theme.palette.text.primary,
    fontSize: '20px',
    padding: '0 16px',
}));

const ActionsContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    flexWrap: 'wrap',
    height: 'fit-content',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'space-between',
    color: theme.palette.text.primary,
    padding: '0 16px 8px 16px',
    marginBottom: '16px',
    borderBottom: '1px solid ' + theme.palette.divider,
}));

const SearchForm = styled('form')(({theme}) => ({
    width: '30%',
    minWidth: '200px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    backgroundColor: 'transparent',
    boxShadow: 'none',
}));

const SearchInput = styled(InputBase)(({theme}) => ({
    width: '80%',
    height: '40px',
    margin: 0,
    backgroundColor: theme.palette.background.paper,
    fontSize: '16px',
    color: theme.palette.text.primary,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '1em',
    padding: '0 10px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    transition: 'border-color 0.3s ease-in-out',
    '&:focus': {
        borderColor: theme.palette.primary.main,
        outline: 'none',
    },
}));

const SearchButton = styled(IconButton)(({theme}) => ({
    padding: '0 0',
    width: '40px',
    height: '40px',
    margin: 'auto -10px',
    zIndex: 1,
    backgroundColor: theme.palette.irish.main,
    border: '1px solid ' + theme.palette.irish.main,
    boxShadow: '0 5px 15px ' + theme.palette.itemShadow.main,
    '&:hover': {
        backgroundColor: theme.palette.irish.light,
        border: '1px solid ' + theme.palette.irish.light,
    },
    '&:focus': {
        outline: 'none',
    },
}));

const AddButton = styled(Button)(({theme}) => ({
    width: 'fit-content',
    color: theme.palette.mybutton.colorTwo,
    backgroundColor: 'rgb(39, 99, 24)',
    "&:hover": {backgroundColor: 'rgb(49,140,23)'},
}));

const ClearButton = styled(Button)(({theme}) => ({
    width: 'fit-content',
    color: theme.palette.mybutton.colorTwo,
    backgroundColor: 'rgb(39, 99, 24)',
    "&:hover": {backgroundColor: 'rgb(49,140,23)'},
}));

const ProductsGrid = styled(Grid)(({theme}) => ({
    paddingLeft: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid ' + theme.palette.divider,
}));

const PaginationContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: '16px 0 16px 0',
}));

const StyledPagination = styled(Pagination)(({theme}) => ({
    '& .MuiPaginationItem-rounded': {
        outline: 'none !important',
        "&:hover": {outline: 'none !important', backgroundColor: 'rgba(39, 99, 24, 0.2)'},
    },
    '& .Mui-selected': {
        backgroundColor: 'rgba(39, 99, 24, 0.5) !important',
        "&:hover": {outline: 'none !important', backgroundColor: 'rgba(39, 99, 24, 0.2) !important'},
    },
}));

const pageSize = 20;

function Product() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [hideClearButton, setHideClearButton] = useState(true);
    const [restoreDefaults, setRestoreDefaults] = useState(1);
    const [openBackdrop, setOpenBackdrop] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Product management';
    }, []);

    useEffect(() => {
        if (LocalStorageHelper.IsUserLogged() === false || LocalStorageHelper.isUserAdmin() === false) {
            navigate('/');
        }
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [currentPage]);

    const redirect = () => {
        navigate('/admin/product/add');
    };

    const removeById = (idToDelete) => {
        setProducts(currentProducts => currentProducts.filter(
            ({id}) => id !== idToDelete)
        );
        if (totalElements - 1 <= 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const changePage = (event, value) => {
        setCurrentPage(value);
    };

    useEffect(() => {
        setOpenBackdrop(true);
        setHideClearButton(true);
        axios.get(`api/products/items/get`, {
            params: {
                page: currentPage - 1,
                pageSize: pageSize,
            }
        })
            .then(res => {
                setTotalPages(res.data.totalPages);
                setTotalElements(res.data.numberOfElements);
                setProducts(res.data.content);
                setOpenBackdrop(false);
            }).catch(error => {
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
    }, [currentPage, restoreDefaults]);

    const onSubmitSearch = (e) => {
        e.preventDefault();
        const searchId = search.trim();
        setOpenBackdrop(true);
        axios.get(`api/products/items/get/${searchId}`, {})
            .then(res => {
                const products = [res.data];
                setProducts(products);
                setHideClearButton(false);
                setOpenBackdrop(false);
                setTotalPages(1);
                setCurrentPage(1);
                toast.success("Product found.", {
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
            }).catch(() => {
            setOpenBackdrop(false);
            toast.error("Product not found.", {
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
    };

    return (
        <ProductContainer>
            <Backdrop
                sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
                open={openBackdrop}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            
            <PageTitle>
                <Typography variant="h5">Products</Typography>
            </PageTitle>
            
            <ActionsContainer>
                <AddButton
                    variant="contained"
                    type="button"
                    endIcon={<AddIcon fontSize="small"/>}
                    fullWidth
                    onClick={redirect}
                >
                    Add
                </AddButton>

                <SearchForm elevation={0} onSubmit={onSubmitSearch}>
                    <SearchInput
                        placeholder="Search product by skuId"
                        elevation={0}
                        required
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <SearchButton type="submit">
                        <SearchOutlinedIcon fontSize="small"/>
                    </SearchButton>
                </SearchForm>

                {!hideClearButton && (
                    <ClearButton
                        variant="contained"
                        type="button"
                        endIcon={<RestoreRounded/>}
                        fullWidth
                        onClick={() => {
                            setHideClearButton(true);
                            setRestoreDefaults(restoreDefaults + 1);
                            setSearch('');
                        }}
                    >
                        Clear
                    </ClearButton>
                )}
            </ActionsContainer>

            <ProductsGrid container rowSpacing={2.7} columnSpacing={2.7}>
                {products.map((product) => (
                    <ProductItem key={product.id} id={product.id} item={product}
                               onDelete={removeById} {...product}/>
                ))}
            </ProductsGrid>

            <PaginationContainer>
                <Stack spacing={2}>
                    <StyledPagination
                        page={currentPage}
                        count={totalPages}
                        onChange={changePage}
                        shape="rounded"
                    />
                </Stack>
            </PaginationContainer>
        </ProductContainer>
    );
}

export default Product;