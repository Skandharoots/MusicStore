import '../style/Order.scss';
import {useEffect, useState} from "react";
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {Bounce, toast} from "react-toastify";
import {Backdrop, Button, CircularProgress} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import {RestoreRounded} from "@mui/icons-material";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import AdminOrderItem from "./AdminOrderItem.jsx";

const perPage = 20;

function Order() {

    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [hideClearButton, setHideClearButton] = useState(true);
    const [restoreDefaults, setRestoreDefaults] = useState(1);
    const [openBackdrop, setOpenBackdrop] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Orders management';
    }, []);

    useEffect(() => {
        if (LocalStorageHelper.IsUserLogged() === false || LocalStorageHelper.isUserAdmin() === false) {
            navigate('/');
        }
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [currentPage]);

    useEffect(() => {
        setOpenBackdrop(true);
        axios.get('api/users/csrf/token')
            .then(res => {
                axios.post(`api/order/get/all?page=${currentPage - 1}&pageSize=${perPage}`, {}, {
                    headers: {
                        'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                        'X-XSRF-TOKEN': res.data.token,
                        'Content-Type': 'application/json'
                    }
                }).then(res => {
                        setOrders(res.data.content);
                        setTotalPages(res.data.totalPages);
                        setOpenBackdrop(false);
                    }).catch(() => {
                    setOpenBackdrop(false);
                    toast.error('We could not load orders.', {
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
                });
            }).catch(() => {
            toast.error('Cannot fetch token', {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            })
        })
    }, [restoreDefaults]);

    const onSubmitSearch = () => {
        let searchId = search.trim();
        setOpenBackdrop(true);
        axios.get('api/users/csrf/token')
        .then(res => {
            axios.post(`api/order/get/${searchId}`, {}, {
                headers: {
                    'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                    'X-XSRF-TOKEN': res.data.token,
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                    const order = [res.data];
                    setOrders(order);
                    setHideClearButton(false);
                    setOpenBackdrop(false);
                    toast.success("Order found.", {
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
                    toast.error("Order not found.", {
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
        }).catch(() => {
            setOpenBackdrop(false);
            toast.error('Cannot fetch token', {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            })
        })
    }

    const changePage = (event, value) => {
        setCurrentPage(value);
    }

    return (
        <div className="order">
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className="page-title">
                <h5>Manage Orders</h5>
            </div>
            <div className="actions">
                <form className={"search-order"}>
                    <input
                        type="text"
                        className="search-prod-input"
                        placeholder="Search order by identifier"
                        required
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <button
                        type="button"
                        className="search-order-btn"
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
                                marginLeft: '30%',
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
                    orders.map((product) => (
                        <AdminOrderItem key={product.id} id={product.id} item={product} />
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

export default Order;