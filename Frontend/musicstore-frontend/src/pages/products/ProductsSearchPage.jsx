import './style/ProductSearchPage.scss';
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Backdrop, CircularProgress} from "@mui/material";
import Grid from "@mui/material/Grid2";
import ProductItem from "./components/ProductItem.jsx";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import axios from "axios";

const pageSize = 20;

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
        axios.get(`api/products/items/get/search?searchPhrase=${searchPhrase.searchPhrase}&page=${currentPage - 1}&pageSize=${pageSize}`)
            .then(res => {
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
    }

    return (
        <div className="products-search-page">
            <Backdrop
                sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
                open={openBackdrop}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            <div className="products-search-content">
                <div className="content-search-header">
                    <p style={{margin: '0', fontSize: '26px'}}>We have found {totalItems} products</p>
                </div>
                <Grid container
                      style={{
                          boxSizing: 'border-box',
                          paddingLeft: '16px',
                          paddingBottom: '16px',
                          width: '100%',
                          paddingTop: '16px',
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

    )
}

export default ProductsSearchPage;