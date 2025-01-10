import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import LocalStorageHelper from "../../helpers/LocalStorageHelper.jsx";
import {Slide, toast} from "react-toastify";
import axios from "axios";
import {Backdrop, CircularProgress} from "@mui/material";
import './style/MyOrderPage.scss';
import OrderProductItem from "./components/OrderProductItem.jsx";
import { format } from "date-fns";


function MyOrderPage() {

    const [order, setOrder] = useState({});
    const [orderItems, setOrderItems] = useState([]);
    const [dateCreated, setDateCreated] = useState(null);
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [country, setCountry] = useState('');
    const [phone, setPhone] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [status, setStatus] = useState('');
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [showNotFound, setShowNotFound] = useState(false);
    const [showOrderDetails, setShowOrderDetails] = useState(false);

    const navigate = useNavigate();
    const orderId = useParams();

    useEffect(() => {
        if (LocalStorageHelper.IsUserLogged() === false) {
            navigate('/');
        }
    }, [])

    useEffect(() => {
        setOpenBackdrop(true);
        axios.get('api/users/csrf/token')
        .then(res => {
            axios.post(`api/order/get/${orderId.orderId}`, {}, {
                headers: {
                    Authorization: 'Bearer ' + LocalStorageHelper.getJwtToken(),
                    'X-XSRF-TOKEN': res.data.token,
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                    setOrder(response.data);
                    setOrderItems(response.data.orderItems);
                    setDateCreated(response.data.dateCreated);
                    setName(response.data.name);
                    setSurname(response.data.surname);
                    setEmail(response.data.email);
                    setCountry(response.data.country);
                    setPhone(response.data.phone);
                    setStreet(response.data.streetAddress);
                    setCity(response.data.city);
                    setZipCode(response.data.zipCode);
                    setStatus(response.data.status);
                    setTotalPrice(response.data.totalPrice);
                    setOpenBackdrop(false);
                    setShowOrderDetails(true);
                    setShowNotFound(false);
                }).catch(() => {
                setOpenBackdrop(false);
                setShowOrderDetails(false);
                setShowNotFound(true);
                toast.error('Order not found', {
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
            setOpenBackdrop(true);
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

    }, []);

    const parseStatus = (status) => {
        if (status === 'IN_PROGRESS') {
            return <p style={{
                margin: '0',
                fontSize: '36px',
                fontWeight: 'bold',
                overflow: 'hidden',
                textWrap: 'nowrap',
                color: 'black',
            }}>Received</p>
        } else if (status === 'SENT') {
            return <p style={{
                margin: '0',
                fontSize: '36px',
                fontWeight: 'bold',
                overflow: 'hidden',
                textWrap: 'nowrap',
                color: 'rgb(20,120,143)'
            }}>Sent</p>
        } else if (status === 'COMPLETED') {
            return <p style={{
                margin: '0',
                fontSize: '36px',
                fontWeight: 'bold',
                overflow: 'hidden',
                textWrap: 'nowrap',
                color: 'rgb(39,99,24)'
            }}>Completed</p>
        } else if (status === 'CANCELED') {
            return <p style={{
                margin: '0',
                fontSize: '36px',
                fontWeight: 'bold',
                overflow: 'hidden',
                textWrap: 'nowrap',
                color: 'rgb(218,113,24)'
            }}>Canceled</p>
        } else if (status === 'FAILED') {
            return <p style={{
                margin: '0',
                fontSize: '36px',
                fontWeight: 'bold',
                overflow: 'hidden',
                textWrap: 'nowrap',
                color: 'rgb(159,20,20)'
            }}>Order failed</p>
        }
    }


    return (
        <div className="my-order-page">
            <Backdrop
                sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
                open={openBackdrop}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            {showOrderDetails && (
                <>
                    <div className="my-order-page-content">
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            width: '100%',
                            height: 'fit-content',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            borderRadius: '1em',
                            padding: '16px',
                            boxSizing: 'border-box',
                            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                        }}>
                            {parseStatus(status)}
                        </div>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            height: 'fit-content',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            borderRadius: '1em',
                            padding: '16px',
                            boxSizing: 'border-box',
                            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                            marginBottom: '16px',
                        }}>
                            <p style={{margin: '0', fontSize: '22px', fontWeight: 'bold'}}>Order nr: <span
                                style={{
                                    margin: '0',
                                    fontSize: '22px',
                                    fontWeight: 'normal'
                                }}>{order.orderIdentifier}</span></p>
                            <p style={{
                                margin: '0',
                                fontSize: '18px',
                                fontWeight: 'bold',
                            }}>Date of purchase: <span
                                style={{
                                    margin: '0',
                                    fontSize: '18px',
                                    fontWeight: 'normal'
                                }}>{format(dateCreated, "MMMM do, yyyy")}</span></p>
                        </div>
                        <div className="my-order-left">
                            <div className="order-details-header">
                                <p style={{margin: '0', fontSize: '18px', fontWeight: 'bold'}}>Order details:</p>
                            </div>
                            <div className="order-personal-details">
                                <p style={{margin: '0', fontSize: '14px'}}>{name} {surname}</p>
                                <p style={{margin: '0', fontSize: '14px'}}>{email}</p>
                                <p style={{margin: '0', fontSize: '14px'}}>{phone}</p>
                            </div>
                            <div className="order-delivery-header">
                                <p style={{margin: '0', fontSize: '18px', fontWeight: 'bold'}}>Order delivery:</p>
                            </div>
                            <div className="order-delivery">
                                <p style={{margin: '0', fontSize: '14px',}}>{country}</p>
                                <p style={{margin: '0', fontSize: '14px',}}>{city}</p>
                                <p style={{margin: '0', fontSize: '14px',}}>{street}</p>
                                <p style={{margin: '0', fontSize: '14px',}}>{zipCode}</p>
                            </div>
                        </div>
                        <div className="my-order-right">
                            <p style={{margin: '0 0 16px 0', fontSize: '18px', fontWeight: 'bold'}}>Order items:</p>
                            {
                                [...orderItems].map(item => (
                                    <OrderProductItem key={item.id} item={item}/>
                                ))
                            }
                            <p style={{margin: '0', fontSize: '18px'}}>Total order price: <span
                                style={{fontWeight: 'bold'}}>{totalPrice}$</span></p>
                        </div>
                    </div>
                </>
            )}
            {showNotFound && (
                <>
                    <div style={{
                        width: '400px',
                        display: 'flex',
                        flexDirection: 'row',
                        height: 'fit-content',
                        padding: '16px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        borderRadius: '1em',
                        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                    }}>
                        <p style={{margin: '0', fontSize: '20px', fontWeight: 'normal'}}>
                            We have not found an order<br/>you are looking for.
                        </p>
                    </div>
                </>
            )}


        </div>
    )
}

export default MyOrderPage;