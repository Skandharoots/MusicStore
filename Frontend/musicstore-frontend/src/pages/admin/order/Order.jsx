import '../style/Order.scss';
import {useEffect, useState} from "react";
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {Slide, toast} from "react-toastify";
import {Backdrop, Button, CircularProgress, Stack, Pagination, Box, styled, TextField, IconButton, Typography} from "@mui/material";
import Grid from "@mui/material/Grid2";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import {RestoreRounded} from "@mui/icons-material";
import AdminOrderItem from "./AdminOrderItem.jsx";

const OrderContainer = styled(Box)(({theme}) => ({
    height: 'fit-content',
    minHeight: '80dvh',
    maxWidth: '796px',
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    borderLeft: `1px solid ${theme.palette.divider}`,
}));

const PageTitle = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
    alignItems: 'center',
    color: theme.palette.text.primary,
    fontSize: '20px',
    padding: theme.spacing(0, 2),
    padding: '16px 0 16px 16px',
}));

const ActionsContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    flexWrap: 'wrap',
    height: 'fit-content',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    color: theme.palette.text.primary,
    padding: theme.spacing(0, 2, 1, 2),
    marginBottom: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
}));

const SearchForm = styled('form')(({theme}) => ({
    display: 'flex',
    width: '30%',
    minWidth: '200px',
    height: '50px',
    padding: 0,
    margin: 0,
    alignItems: 'center',
    justifyContent: 'center',
}));

const SearchInput = styled(TextField)(({theme}) => ({
    height: '40px',
    margin: 0,
    backgroundColor: theme.palette.background.paper,
    '& .MuiOutlinedInput-root': {
        height: '40px',
        fontSize: '12px',
        color: theme.palette.text.secondary,
        '& fieldset': {
            borderColor: theme.palette.text.secondary,
            borderRadius: '1em',
        },
        '&:hover fieldset': {
            borderColor: theme.palette.text.primary,
        },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.text.primary,
        },
    },
    boxShadow: '0 5px 15px ' + theme.palette.formShadow.main,
}));

const SearchButton = styled(IconButton)(({theme}) => ({
    padding: 0,
    width: '40px',
    height: '40px',
    margin: 'auto -10px',
    zIndex: 1,
    backgroundColor: 'rgb(39, 99, 24)',
    border: `1px solid rgb(39, 99, 24)`,
    boxShadow: '0 5px 15px ' + theme.palette.formShadow.main,
    '&:hover': {
        backgroundColor: 'rgb(49,140,23)',
        border: `1px solid rgb(49,140,23)`,
    },
}));

const ClearButton = styled(Button)(({theme}) => ({
    width: 'fit-content',
    backgroundColor: 'rgb(39, 99, 24)',
    marginLeft: '30%',
    '&:hover': {
        backgroundColor: 'rgb(49,140,23)',
    },
}));

const OrdersGrid = styled(Grid)(({theme}) => ({
    padding: theme.spacing(0, 2),
    borderBottom: `1px solid ${theme.palette.divider}`,
}));

const PaginationContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: theme.spacing(2, 0),
}));

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
        LocalStorageHelper.CommitRefresh();
        axios.get('api/users/csrf/token')
            .then(res => {
                axios.post(`api/order/get/all`, {}, {
                    headers: {
                        'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                        'X-XSRF-TOKEN': res.data.token,
                        'Content-Type': 'application/json'
                    },
                    params: {
                        page: currentPage - 1,
                        pageSize: perPage
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
                        theme: "light",
                        transition: Slide,
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
                theme: "light",
                transition: Slide,
            })
        })
    }, [restoreDefaults, currentPage]);

    const onSubmitSearch = (e) => {
        e.preventDefault();
        let searchId = search.trim();
        setOpenBackdrop(true);
        LocalStorageHelper.CommitRefresh();
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
                    setTotalPages(1);
                    setCurrentPage(1);
                    toast.success("Order found.", {
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
                    toast.error("Order not found.", {
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
                theme: "light",
                transition: Slide,
            })
        })
    }

    const changePage = (event, value) => {
        setCurrentPage(value);
    }

    return (
        <OrderContainer>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            
            <PageTitle>
                <Typography variant="h5">Manage Orders</Typography>
            </PageTitle>
            
            <ActionsContainer>
                <SearchForm onSubmit={onSubmitSearch}>
                    <SearchInput
                        type="text"
                        placeholder="Search order by identifier"
                        required
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <SearchButton type="submit">
                        <SearchOutlinedIcon fontSize="small" />
                    </SearchButton>
                </SearchForm>
                
                {!hideClearButton && (
                    <ClearButton
                        variant="contained"
                        type="button"
                        endIcon={<RestoreRounded/>}
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

            <OrdersGrid container rowSpacing={2.7} columnSpacing={2.7}>
                {orders.map((product) => (
                    <AdminOrderItem key={product.id} id={product.id} item={product} />
                ))}
            </OrdersGrid>
            
            <PaginationContainer>
                <Stack spacing={2}>
                    <Pagination
                        page={currentPage}
                        count={totalPages}
                        onChange={changePage}
                        shape="rounded"
                        sx={{
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
            </PaginationContainer>
        </OrderContainer>
    )
}

export default Order;