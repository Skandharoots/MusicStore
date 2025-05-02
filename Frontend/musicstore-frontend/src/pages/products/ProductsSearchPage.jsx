import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {
    Backdrop,
    Box,
    CircularProgress,
    Pagination,
    Stack,
    styled,
    Typography
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import ProductItem from "./components/ProductItem.jsx";
import axios from "axios";

const pageSize = 20;

const ProductsSearchContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    width: '100%',
    padding: '0',
    margin: '0',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row',
    backgroundColor: theme.palette.background.paper,
    minHeight: '80dvh',
    color: theme.palette.text.primary,
    boxSizing: 'border-box',
}));

const SearchHeader = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px 0',
    width: '100%',
    boxSizing: 'border-box',
    borderBottom: `1px solid ${theme.palette.divider}`,
}));

const SearchContent = styled(Box)(({theme}) => ({
    margin: '0 0',
    width: '781px',
    display: 'flex',
    minHeight: '80vh',
    backgroundColor: theme.palette.background.paper,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    boxSizing: 'border-box',
}));

const ProductsGrid = styled(Grid)(({theme}) => ({
    boxSizing: 'border-box',
    paddingLeft: '16px',
    paddingBottom: '16px',
    width: '100%',
    paddingTop: '16px',
    borderBottom: `1px solid ${theme.palette.divider}`,
}));

function ProductsSearchPage() {
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [openBackdrop, setOpenBackdrop] = useState(false);

    const searchPhrase = useParams();

    useEffect(() => {
        document.title = `Product search - ${searchPhrase.searchPhrase}`;
    }, []);

    useEffect(() => {
        setOpenBackdrop(true);
        axios.get(`api/products/items/get/search`, {
            params: {
                searchPhrase: searchPhrase.searchPhrase,
                page: currentPage - 1,
                pageSize: pageSize
            }
        }).then(res => {
            setProducts(res.data.content);
            setTotalPages(res.data.totalPages);
            setTotalItems(res.data.totalElements);
            setOpenBackdrop(false);
        }).catch(() => {
            setOpenBackdrop(false);
        });
    }, [currentPage]);

    const changePage = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <ProductsSearchContainer>
            <Backdrop
                sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
                open={openBackdrop}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            <SearchContent>
                <SearchHeader>
                    <Typography variant="h5">
                        We have found {totalItems} products
                    </Typography>
                </SearchHeader>
                <ProductsGrid container rowSpacing={2.7} columnSpacing={2.7}>
                    {products.map((product) => (
                        <ProductItem key={product.id} id={product.id} item={product}/>
                    ))}
                </ProductsGrid>
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
            </SearchContent>
        </ProductsSearchContainer>
    );
}

export default ProductsSearchPage;