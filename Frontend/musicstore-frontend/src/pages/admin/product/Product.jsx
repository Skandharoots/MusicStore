import '../style/Product.scss';
import {Backdrop, Button, CircularProgress} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";
import ProductItem from "./components/ProductItem.jsx";
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";
import {Bounce, toast} from "react-toastify";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import {RestoreRounded} from "@mui/icons-material";

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
    }

    const removeById = (idToDelete) => {
        setProducts(currentProducts => currentProducts.filter(
            ({id}) => id !== idToDelete)
        );
        if (totalElements - 1 <= 0) {
            console.log(totalElements);
            setCurrentPage(currentPage - 1);
        }
    };

    const changePage = (event, value) => {
        setCurrentPage(value);
    }


    useEffect(() => {
        setOpenBackdrop(true);
        setHideClearButton(true);
        axios.get(`api/products/items/get?page=${currentPage - 1}&pageSize=${pageSize}`, {})
            .then(res => {
                setTotalPages(res.data.totalPages);
                setTotalElements(res.data.numberOfElements);
                setProducts(res.data.content);
                setTimeout(() => {setOpenBackdrop(false)}, 500);
            }).catch(error => {
            setTimeout(() => {setOpenBackdrop(false)}, 500);
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
    }, [currentPage, restoreDefaults]);

    const onSubmitSearch = () => {
        const searchId = search.trim();
        setOpenBackdrop(true);
        axios.get(`api/products/items/get/${searchId}`, {})
        .then(res => {
            const products = [res.data];
            setProducts(products);
            setHideClearButton(false);
            setOpenBackdrop(false);
            toast.success("Product found.", {
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
                theme: "colored",
                transition: Bounce,
            });
        })
    }

    return (
        <div className="product">
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className="page-title">
                <h5>Products</h5>
            </div>
            <div className="actions">
                <div style={{ display: 'inline-block' }}>
                    <Button
                        className="add-button"
                        variant="contained"
                        type="button"
                        endIcon={<AddIcon fontSize="small"/>}
                        fullWidth
                        onClick={redirect}
                        sx={{
                            width: 'fit-content',
                            backgroundColor: 'rgb(39, 99, 24)',
                            "&:hover": {backgroundColor: 'rgb(49,140,23)'},
                        }}
                    >
                        Add
                    </Button>
                </div>

                    <form className={"search-prod"}>
                        <input
                            type="text"
                            className="search-prod-input"
                            placeholder="Search product by skuId"
                            required
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <button
                            type="button"
                            className="search-prod-btn"
                            onClick={onSubmitSearch}>
                            <SearchOutlinedIcon fontSize="small" />
                        </button>
                    </form>
                <div>
                    { !hideClearButton &&
                        <Button
                            className="add-button"
                            variant="contained"
                            type="button"
                            endIcon={<RestoreRounded/>}
                            fullWidth
                            onClick={() => {setHideClearButton(true); setRestoreDefaults(restoreDefaults + 1); setSearch('')}}
                            sx={{
                                width: 'fit-content',
                                backgroundColor: 'rgb(39, 99, 24)',
                                "&:hover": {backgroundColor: 'rgb(49,140,23)'},
                            }}
                        >
                            Clear
                        </Button>
                    }
                </div>

            </div>

            <Grid container style={{ paddingLeft: '16px', paddingBottom: '16px', borderBottom: '1px solid rgba(0, 0, 0, 0.1)'}} rowSpacing={2.7} columnSpacing={2.7}>
                {
                    products.map((product) => (
                        <ProductItem key={product.id} id={product.id} item={product}
                                     onDelete={removeById} {...product}/>
                    ))
                }
            </Grid>
            <div  style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', padding: '16px 0 16px 0'}}>
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
    )
}

export default Product;