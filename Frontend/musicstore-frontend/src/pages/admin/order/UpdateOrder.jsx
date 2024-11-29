import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";
import {Slide, toast} from "react-toastify";
import '../style/UpdateOrder.scss';
import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import {format} from "date-fns";
import AdminOrderProductItem from "./components/AdminOrderProductItem.jsx";

function UpdateOrder() {

    const [order, setOrder] = useState({});
    const [orderItems, setOrderItems] = useState([]);
    const [orderId, setOrderId] = useState('');
    const [dateCreated, setDateCreated] = useState(null);
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [country, setCountry] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [status, setStatus] = useState("IN_PROGRESS");
    const [openBackdrop, setOpenBackdrop] = useState(false);

    const iden = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        axios.get('api/users/csrf/token')
        .then(res => {
           axios.post(`api/order/get/${iden.orderIdentifier}`, {}, {
               headers: {
                   'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                   'X-XSRF-TOKEN': res.data.token,
                   'Content-Type': 'application/json'
               }
           }).then(res => {
               setOrder(res.data);
               setOrderItems(res.data.orderItems);
               setOrderId(res.data.orderIdentifier);
               setDateCreated(res.data.dateCreated);
               setName(res.data.name);
               setSurname(res.data.surname);
               setEmail(res.data.email);
               setPhone(res.data.phone);
               setCountry(res.data.country);
               setStreetAddress(res.data.streetAddress);
               setCity(res.data.city);
               setZipCode(res.data.zipCode);
               setStatus(res.data.status);
           }).catch(err => {
               toast.error(err.response, {
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

    const updateOrder = (e) => {
        e.preventDefault();
        setOpenBackdrop(true);
        axios.get('api/users/csrf/token')
        .then(res => {
            axios.put(`api/order/update/${orderId}`, {
                status: status,
                itemsToCancel: order.orderItems
            }, {
                headers: {
                    'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                    'X-XSRF-TOKEN': res.data.token,
                    'Content-Type': 'application/json'
                }
            }).then(() => {
                setOpenBackdrop(false);
                toast.success("Order status updated!", {
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
                navigate("/admin/order");
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
                })
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

    return (
        <div className="OrderUpdate">
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className="OrderUpdateForm">
                <Typography
                    component="h1"
                    variant="h5"
                    sx={{
                        width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', color: 'black'
                        , margin: '0 auto 5% auto'
                    }}
                >
                    Update order
                </Typography>
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
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                    marginBottom: '16px',
                    color: 'black',
                }}>
                    <p style={{margin: '0', fontSize: '14px', fontWeight: 'bold'}}>Order nr: <span
                        style={{margin: '0', fontSize: '14px', fontWeight: 'normal'}}>{order.orderIdentifier}</span></p>
                    <p style={{margin: '0', fontSize: '14px', fontWeight: 'bold'}}>Date of purchase: <span
                        style={{
                            margin: '0',
                            fontSize: '14px',
                            fontWeight: 'normal'
                        }}>{format(dateCreated, "MMMM do, yyyy H:mma")}</span></p>
                    <p style={{margin: '0', fontSize: '14px', fontWeight: 'bold'}}>Total order price: <span
                        style={{fontWeight: 'normal'}}>{order.totalPrice}$</span></p>
                </div>
                <div className="update-order-left">
                    <div className="order-personal-details">
                        <p style={{margin: '0', fontSize: '14px'}}>{name} {surname}</p>
                        <p style={{margin: '0', fontSize: '14px'}}>{email}</p>
                        <p style={{margin: '0', fontSize: '14px'}}>{phone}</p>
                    </div>
                    <div className="order-delivery">
                        <p style={{margin: '0', fontSize: '14px',}}>{country}</p>
                        <p style={{margin: '0', fontSize: '14px',}}>{city}</p>
                        <p style={{margin: '0', fontSize: '14px',}}>{streetAddress}</p>
                        <p style={{margin: '0', fontSize: '14px',}}>{zipCode}</p>
                    </div>
                </div>
                <div className="update-order-right">
                    {
                        [...orderItems].map(item => (
                            <AdminOrderProductItem key={item.id} item={item}/>
                        ))
                    }
                </div>
                <Box
                    style={{
                        marginTop: '16px',
                        width: '100%',
                    }}
                >
                    <FormControl
                        size="small"
                        sx={{
                            m: 1,
                            width: '100%',
                            margin: '0 auto 5% auto',
                            "& label.Mui-focused": {
                                color: 'rgb(39, 99, 24)'
                            },
                            "& .MuiOutlinedInput-root": {
                                "&.Mui-focused fieldset": {
                                    borderColor: 'rgb(39, 99, 24)'
                                }
                            }
                        }}>
                        <InputLabel id="status-label">Order status</InputLabel>
                        <Select
                            labelId="status-label"
                            id="status"
                            value={status}
                            label="Order status"
                            onChange={e => setStatus(e.target.value)}
                            variant={"outlined"}
                        >
                            <MenuItem value={"IN_PROGRESS"}>Order received</MenuItem>
                            <MenuItem value={"SENT"}>Order sent</MenuItem>
                            <MenuItem value={"COMPLETED"}>Order completed</MenuItem>
                            <MenuItem value={"CANCELED"}>Order canceled</MenuItem>
                            <MenuItem value={"FAILED"}>Order failed</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        className="add-btn"
                        type="button"
                        endIcon={<EditIcon/>}
                        fullWidth
                        variant="contained"
                        onClick={updateOrder}
                        sx={{
                            width: '100%',
                            backgroundColor: 'rgb(39, 99, 24)',
                            "&:hover": {backgroundColor: 'rgb(49,140,23)'}
                        }}
                    >
                        Update Order
                    </Button>
                </Box>
            </div>
        </div>
    )
}

export default UpdateOrder;