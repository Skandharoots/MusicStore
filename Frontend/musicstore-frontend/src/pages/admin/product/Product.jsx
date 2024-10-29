import '../style/Product.scss';
import {Button} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useNavigate } from "react-router-dom";
import React, {useCallback, useEffect, useState} from "react";
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";
import ProductItem from "./components/ProductItem.jsx";
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";
import {Bounce, toast} from "react-toastify";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const pageSize = 2;

function Product() {

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);


    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Product management';
    }, []);

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
        if (LocalStorageHelper.IsUserLogged() === false || LocalStorageHelper.isUserAdmin() === false) {
            navigate('/');
        }
    }, []);

    useEffect(() => {
        axios.get(`api/products/items/get?page=${currentPage - 1}&pageSize=${pageSize}`, {})
            .then(res => {
                setTotalPages(res.data.totalPages);
                setTotalElements(res.data.numberOfElements);
                setProducts(res.data.content);
            }).catch(error => {
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
    }, [currentPage]);

    const onSubmitSearch = () => {
        navigate(`/admin/product/update/${search}`);
    }

    return (
        <div className="manufacturer">
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
                            marginBottom: '16px',
                        }}
                    >
                        Add New
                    </Button>
                </div>

                    <form className={"search-prod"}>
                        <input
                            type="text"
                            className="search-prod-input"
                            placeholder="Update product by skuId"
                            required
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <button
                            type="button"
                            className="search-prod-btn"
                            onClick={onSubmitSearch}>
                            <SearchOutlinedIcon fontSize={"small"}/>
                        </button>
                    </form>

            </div>

            <Grid container style={{marginRight: '20%', marginLeft: '16px'}} rowSpacing={2} columnSpacing={2}>
                {
                    products.map((product) => (
                        <ProductItem key={product.id} id={product.id} item={product}
                                     onDelete={removeById} {...product}/>
                    ))
                }
            </Grid>
            <Stack spacing={2} sx={{marginTop: '16px'}}>
                <Pagination page={currentPage} count={totalPages} onChange={changePage}
                            sx={{
                                '& .Mui-selected': {
                                    "&:focus": {outline: 'none !important'},
                                },
                            }}
                />
            </Stack>
        </div>
    )
}

export default Product;