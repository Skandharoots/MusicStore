import {useEffect, useState} from "react";
import LocalStorageHelper from "../../helpers/LocalStorageHelper.jsx";
import {useNavigate} from "react-router-dom";
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
import OrderUserItem from "./components/OrderUserItem.jsx";
import axios from "axios";
import {Slide, toast} from "react-toastify";

const perPage = 20;

const MyOrdersContainer = styled(Box)(({theme}) => ({
    height: 'fit-content',
    minHeight: '80dvh',
    maxWidth: '780px',
    width: '100%',
    color: theme.palette.text.primary,
    borderLeft: `1px solid ${theme.palette.divider}`,

}));

const OrdersGrid = styled(Grid)(({theme}) => ({
    boxSizing: 'border-box',
    padding: '16px',
    borderBottom: `1px solid ${theme.palette.divider}`,
    rowSpacing: 2.7,
    columnSpacing: 2.7,
}));

const NoOrdersContainer = styled(Box)(({theme}) => ({
    width: '70%',
    height: 'fit-content',
    padding: '4%',
    margin: '32px auto',
    boxSizing: 'border-box',
    boxShadow: theme.shadows[2],
    borderRadius: '1em',
    textAlign: 'center',
}));

const NoOrdersText = styled(Typography)(({theme}) => ({
    margin: '0 auto',
    fontSize: '26px',
}));

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [showNoOrdersInformation, setShowNoOrdersInformation] = useState(false);
    const [showOrders, setShowOrders] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'My orders';
    }, []);

    useEffect(() => {
        if (LocalStorageHelper.IsUserLogged() === false) {
            navigate('/');
        }
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);

    useEffect(() => {
        setOpenBackdrop(true);
        LocalStorageHelper.CommitRefresh();
        axios.get('api/users/csrf/token')
            .then(res => {
                axios.post(`api/order/get/all/${LocalStorageHelper.GetActiveUser()}`, {}, {
                    headers: {
                        'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                        'X-XSRF-TOKEN': res.data.token,
                        'Content-Type': 'application/json'
                    },
                    params: {
                        page: currentPage - 1,
                        pageSize: perPage,
                    }
                }).then(res => {
                    setOrders(res.data.content);
                    setTotalPages(res.data.totalPages);
                    if (res.data.totalPages < 1) {
                        setShowNoOrdersInformation(true);
                        setShowOrders(false);
                    } else {
                        setShowNoOrdersInformation(false);
                        setShowOrders(true);
                    }
                    setOpenBackdrop(false);
                }).catch(() => {
                    setOpenBackdrop(false);
                    toast.error('We could not load your orders.', {
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
                });
            });
    }, [currentPage]);

    const changePage = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <MyOrdersContainer>
            <Backdrop
                sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
                open={openBackdrop}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>

            {showOrders && (
                <>
                    <OrdersGrid container spacing={2.7}>
                        {orders.map((order) => (
                            <OrderUserItem key={order.id} id={order.id} item={order}/>
                        ))}
                    </OrdersGrid>
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
                </>
            )}

            {showNoOrdersInformation && (
                <NoOrdersContainer>
                    <NoOrdersText variant="h5">
                        You have not placed any orders yet.
                    </NoOrdersText>
                </NoOrdersContainer>
            )}
        </MyOrdersContainer>
    );
}

export default MyOrders;