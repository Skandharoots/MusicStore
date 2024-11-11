import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";
import {Bounce, toast} from "react-toastify";
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
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";

function UpdateOrder() {

    const [order, setOrder] = useState({});
    const [orderId, setOrderId] = useState('');
    const [dateCreated, setDateCreated] = useState('');
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
               setOrderId(res.data.orderIdentifier);
               setDateCreated(res.data.dateCreated);
               setName(res.data.name);
               setSurname(res.data.surname);
               setEmail(res.data.email);
               setPhone(res.data.phone);
               setCountry(res.data.country);
               setStreetAddress(res.data.streetAddress);
               setCity(res.data.state.city);
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
                   theme: "colored",
                   transition: Bounce,
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
                theme: "colored",
                transition: Bounce,
            })
        })
    }, [])

    const updateOrder = (e) => {
        e.preventDefault();
        setOpenBackdrop(true);
        console.log(JSON.stringify(order));
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
                setTimeout(() => {setOpenBackdrop(false)}, 500);
                toast.success("Order status updated!", {
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
                navigate("/admin/order");
            }).catch(error => {
                setTimeout(() => {setOpenBackdrop(false);}, 500);
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
                })
            })
        }).catch(() => {
            setTimeout(() => {setOpenBackdrop(false);}, 500);
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
                <Box
                >
                    <TextField
                        size={"small"}
                        disabled={true}
                        id="orderId"
                        type="search"
                        name="orderId"
                        placeholder="Order identifier"
                        autoComplete="orderIdentifier"
                        required
                        fullWidth
                        variant="outlined"
                        label="Order id"
                        value={orderId}
                        sx={{
                            width: '70%',
                            margin: '0 auto 5% auto',
                            "& label.Mui-focused": {
                                color: 'rgb(39, 99, 24)'
                            },
                            "& .MuiOutlinedInput-root": {
                                "&.Mui-focused fieldset": {
                                    borderColor: 'rgb(39, 99, 24)'
                                }
                            }
                        }}
                    />
                    <TextField
                        size={"small"}
                        disabled={true}
                        id="dateCreated"
                        type="search"
                        name="dateCreated"
                        placeholder="Order identifier"
                        autoComplete="orderIdentifier"
                        required
                        fullWidth
                        variant="outlined"
                        label="Date created"
                        value={dateCreated}
                        sx={{
                            width: '70%',
                            margin: '0 auto 5% auto',
                            "& label.Mui-focused": {
                                color: 'rgb(39, 99, 24)'
                            },
                            "& .MuiOutlinedInput-root": {
                                "&.Mui-focused fieldset": {
                                    borderColor: 'rgb(39, 99, 24)'
                                }
                            }
                        }}
                    />
                    <TextField
                        size={"small"}
                        disabled={true}
                        id="name"
                        type="search"
                        name="name"
                        placeholder="First name"
                        autoComplete="name"
                        required
                        fullWidth
                        variant="outlined"
                        label="First name"
                        value={name}
                        sx={{
                            width: '70%',
                            margin: '0 auto 5% auto',
                            "& label.Mui-focused": {
                                color: 'rgb(39, 99, 24)'
                            },
                            "& .MuiOutlinedInput-root": {
                                "&.Mui-focused fieldset": {
                                    borderColor: 'rgb(39, 99, 24)'
                                }
                            }
                        }}
                    />
                    <TextField
                        size={"small"}
                        disabled={true}
                        id="surname"
                        type="search"
                        name="surname"
                        placeholder="Surname"
                        autoComplete="surname"
                        required
                        fullWidth
                        variant="outlined"
                        label="Surname"
                        value={surname}
                        sx={{
                            width: '70%',
                            margin: '0 auto 5% auto',
                            "& label.Mui-focused": {
                                color: 'rgb(39, 99, 24)'
                            },
                            "& .MuiOutlinedInput-root": {
                                "&.Mui-focused fieldset": {
                                    borderColor: 'rgb(39, 99, 24)'
                                }
                            }
                        }}
                    />
                    <TextField
                        size={"small"}
                        disabled={true}
                        id="email"
                        type="search"
                        name="email"
                        placeholder="your@email.com"
                        autoComplete="email"
                        required
                        fullWidth
                        variant="outlined"
                        label="Email"
                        value={email}
                        sx={{
                            width: '70%',
                            margin: '0 auto 5% auto',
                            "& label.Mui-focused": {
                                color: 'rgb(39, 99, 24)'
                            },
                            "& .MuiOutlinedInput-root": {
                                "&.Mui-focused fieldset": {
                                    borderColor: 'rgb(39, 99, 24)'
                                }
                            }
                        }}
                    />
                    <TextField
                        size={"small"}
                        disabled={true}
                        id="phone"
                        type="tel"
                        name="phone"
                        placeholder="+48 567 234 902"
                        autoComplete="phone"
                        required
                        fullWidth
                        variant="outlined"
                        label="Phone number"
                        value={phone}
                        sx={{
                            width: '70%',
                            margin: '0 auto 5% auto',
                            "& label.Mui-focused": {
                                color: 'rgb(39, 99, 24)'
                            },
                            "& .MuiOutlinedInput-root": {
                                "&.Mui-focused fieldset": {
                                    borderColor: 'rgb(39, 99, 24)'
                                }
                            }
                        }}
                    />
                    <TextField
                        size={"small"}
                        disabled={true}
                        id="country"
                        type="search"
                        name="country"
                        placeholder="Country"
                        autoComplete="country"
                        required
                        fullWidth
                        variant="outlined"
                        label="Country"
                        value={country}
                        sx={{
                            width: '70%',
                            margin: '0 auto 5% auto',
                            "& label.Mui-focused": {
                                color: 'rgb(39, 99, 24)'
                            },
                            "& .MuiOutlinedInput-root": {
                                "&.Mui-focused fieldset": {
                                    borderColor: 'rgb(39, 99, 24)'
                                }
                            }
                        }}
                    />
                    <TextField
                        size={"small"}
                        disabled={true}
                        id="city"
                        type="search"
                        name="city"
                        placeholder="Surname"
                        autoComplete="city"
                        required
                        fullWidth
                        variant="outlined"
                        label="City"
                        value={city}
                        sx={{
                            width: '70%',
                            margin: '0 auto 5% auto',
                            "& label.Mui-focused": {
                                color: 'rgb(39, 99, 24)'
                            },
                            "& .MuiOutlinedInput-root": {
                                "&.Mui-focused fieldset": {
                                    borderColor: 'rgb(39, 99, 24)'
                                }
                            }
                        }}
                    />
                    <TextField
                        size={"small"}
                        disabled={true}
                        id="streetAddress"
                        type="search"
                        name="streetAddress"
                        placeholder="Street Address"
                        autoComplete="streetAddress"
                        required
                        fullWidth
                        variant="outlined"
                        label="Street address"
                        value={streetAddress}
                        sx={{
                            width: '70%',
                            margin: '0 auto 5% auto',
                            "& label.Mui-focused": {
                                color: 'rgb(39, 99, 24)'
                            },
                            "& .MuiOutlinedInput-root": {
                                "&.Mui-focused fieldset": {
                                    borderColor: 'rgb(39, 99, 24)'
                                }
                            }
                        }}
                    />
                    <TextField
                        size={"small"}
                        disabled={true}
                        id="zipCode"
                        type="search"
                        name="name"
                        placeholder="Zip code"
                        autoComplete="zipCode"
                        required
                        fullWidth
                        variant="outlined"
                        label="Zip-code"
                        value={zipCode}
                        sx={{
                            width: '70%',
                            margin: '0 auto 5% auto',
                            "& label.Mui-focused": {
                                color: 'rgb(39, 99, 24)'
                            },
                            "& .MuiOutlinedInput-root": {
                                "&.Mui-focused fieldset": {
                                    borderColor: 'rgb(39, 99, 24)'
                                }
                            }
                        }}
                    />
                    <FormControl
                        size="small"
                        sx={{
                            m: 1,
                            width: '70%',
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
                        endIcon={<EditIcon />}
                        fullWidth
                        variant="contained"
                        onClick={updateOrder}
                        sx={{
                            width: '70%',
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