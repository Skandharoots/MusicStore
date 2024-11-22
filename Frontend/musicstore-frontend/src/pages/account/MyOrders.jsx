import './style/MyOrders.scss';
import {useEffect, useState} from "react";
import LocalStorageHelper from "../../helpers/LocalStorageHelper.jsx";
import {useNavigate} from "react-router-dom";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import OrderUserItem from "./components/OrderUserItem.jsx";
import axios from "axios";
import {Slide, toast} from "react-toastify";
import {Backdrop, CircularProgress} from "@mui/material";

const perPage = 20;

function MyOrders() {

    const [orders, setOrders] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [showNoOrdersInformation, setShowNoOrdersInformation] = useState(false);

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
        window.scrollTo(0, 0)
    }, [currentPage]);

    useEffect(() => {
        setOpenBackdrop(true);
        axios.get('api/users/csrf/token')
        .then(res => {
            axios.post(`api/order/get/all/${LocalStorageHelper.GetActiveUser()}?page=${currentPage - 1}&pageSize=${perPage}`, {}, {
                headers: {
                    'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                    'X-XSRF-TOKEN': res.data.token,
                    'Content-Type': 'application/json'
                }
            })
                .then(res => {
                    setOrders(res.data.content);
                    setTotalPages(res.data.totalPages);
                    if (res.data.totalPages < 1) {
                        setShowNoOrdersInformation(true);
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
            })
        })
    }, [])

    const changePage = (event, value) => {
        setCurrentPage(value);
    }

    return (
        <div className="my-orders">
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            {!showNoOrdersInformation && (
                <>
                    <Grid container
                          style={{
                              boxSizing: 'border-box',
                              paddingLeft: '16px',
                              paddingBottom: '16px',
                              paddingTop: '16px',
                              borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
                          }}
                          rowSpacing={2.7}
                          columnSpacing={2.7}
                    >
                        {
                            [...orders].map((order) => (
                                <OrderUserItem key={order.id} id={order.id} item={order}/>
                            ))
                        }
                    </Grid>
                    <div
                        style={{
                            display: 'flex',
                            width: '100%',
                            boxSizing: 'border-box',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            padding: '16px 0 16px 0'
                            }}
                    >
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
                </>
            )}
            {showNoOrdersInformation && (
                <>
                    <div
                        style={{
                            width: '70%',
                            height: 'fit-content',
                            padding: '4%',
                            margin: '32px auto',
                            boxSizing: 'border-box',
                            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                            borderRadius: '1em',
                            textAlign: 'center',
                        }}
                    >
                        <p style={{margin: '0 auto', fontSize: '26px'}}>You have not placed any orders yet.</p>
                    </div>
                </>
            )}

        </div>
    )

}

export default MyOrders;