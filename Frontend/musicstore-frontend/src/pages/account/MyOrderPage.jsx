import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import LocalStorageHelper from "../../helpers/LocalStorageHelper.jsx";
import {Slide, toast} from "react-toastify";
import axios from "axios";
import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Stepper,
    Step,
    StepLabel,
    styled,
    Typography
} from "@mui/material";
import OrderProductItem from "./components/OrderProductItem.jsx";
import {format} from "date-fns";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const MyOrderPageContainer = styled(Box)(({theme}) => ({
    height: 'fit-content',
    minHeight: '80dvh',
    width: '780px',
    color: theme.palette.text.primary,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: '16px',
    boxSizing: 'border-box',
    borderLeft: `1px solid ${theme.palette.divider}`,
}));

const OrderPageContent = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
}));

const OrderLeftSection = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    boxSizing: 'border-box',
    width: '50%',
    minWidth: '340px',
}));

const OrderRightSection = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    boxSizing: 'border-box',
    width: '50%',
    minWidth: '340px',
    padding: '0',
}));

const SectionHeader = styled(Typography)(({theme}) => ({
    width: '300px',
    height: 'fit-content',
    padding: '0',
    marginLeft: '16px',
    fontSize: '18px',
    fontWeight: 'bold',
}));

const DetailsContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '300px',
    height: 'fit-content',
    padding: '16px',
    borderRadius: '1em',
    marginLeft: '16px',
    marginBottom: '32px',
    boxSizing: 'border-box',
    boxShadow: '0 5px 15px ' + theme.palette.formShadow.main,
}));

const DeliveryContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '300px',
    height: 'fit-content',
    padding: '16px',
    borderRadius: '1em',
    marginLeft: '16px',
    marginBottom: '64px',
    boxSizing: 'border-box',
    boxShadow: '0 5px 15px ' + theme.palette.formShadow.main,
}));

const DetailText = styled(Typography)(({theme}) => ({
    margin: '0',
    fontSize: '14px',
}));

const StatusContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: 'fit-content',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderRadius: '1em',
    padding: '16px',
    boxSizing: 'border-box',
    borderBottom: `1px solid ${theme.palette.divider}`,
}));

const OrderInfoContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: 'fit-content',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderRadius: '1em',
    padding: '16px',
    boxSizing: 'border-box',
    borderBottom: `1px solid ${theme.palette.divider}`,
    marginBottom: '16px',
    marginLeft: '16px',
    boxShadow: '0 5px 15px ' + theme.palette.formShadow.main,
}));

const InvoiceContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: 'fit-content',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '1em',
    marginBottom: '16px',
    padding: '16px',
    boxSizing: 'border-box',
    border: '1px solid ' + theme.palette.formShadow.main,
}));

const InvoiceInfo = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '50%',
    height: 'fit-content',
    justifyContent: 'center',
    alignItems: 'flex-start',
}));

const InvoiceButton = styled(Button)(({theme}) => ({
    width: '90%',
    margin: '0',
    '&:hover': {
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.light + '33',
    },
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
}));

const NotFoundContainer = styled(Box)(({theme}) => ({
    width: '400px',
    display: 'flex',
    flexDirection: 'row',
    height: 'fit-content',
    padding: '16px',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: '1em',
    boxShadow: theme.shadows[2],
}));

const NotFoundText = styled(Typography)(({theme}) => ({
    margin: '0',
    fontSize: '20px',
    fontWeight: 'normal',
}));

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
    const [status, setStatus] = useState([]);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [showNotFound, setShowNotFound] = useState(false);
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfFileName, setPdfFileName] = useState('');
    const [showDownloadInvoice, setShowDownloadInvoice] = useState(false);
    
    const navigate = useNavigate();
    const orderId = useParams();

    useEffect(() => {
        if (LocalStorageHelper.IsUserLogged() === false) {
            navigate('/');
        }
    }, []);

    useEffect(() => {
        setOpenBackdrop(true);
        LocalStorageHelper.CommitRefresh();
        axios.get('api/users/csrf/token')
            .then(res => {
                let token = res.data.token;
                axios.post(`api/order/get/${orderId.orderId}`, {}, {
                    headers: {
                        Authorization: 'Bearer ' + LocalStorageHelper.getJwtToken(),
                        'X-XSRF-TOKEN': token,
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
                    setShowOrderDetails(true);
                    setShowNotFound(false);

                    axios.get(`api/invoice/list?path=${orderId.orderId}`)
                        .then(res => {
                            if (res.data.length > 0) {
                                let fileName = res.data[0].split('/')[1];
                                axios.get(`api/invoice/read?path=${res.data[0]}`, {responseType: 'blob'})
                                    .then(res => {
                                        let blob = new Blob([res.data], {type: "application/pdf"});
                                        setPdfFile(blob);
                                        setPdfFileName(fileName);
                                        setShowDownloadInvoice(true);
                                        setOpenBackdrop(false);
                                    }).catch((e) => {
                                        setOpenBackdrop(false);
                                        toast.error(e.response.data.message, {
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
                            } else {
                                setOpenBackdrop(false);
                                setShowDownloadInvoice(false);
                            }
                        }).catch((e) => {
                            setOpenBackdrop(false);
                            toast.error(e.response.data.message, {
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
                });
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
                });
            });
    }, []);

    const downloadPdf = (e) => {
        const aTag = document.createElement('a');
        let file = URL.createObjectURL(pdfFile);
        let fileName = pdfFileName;
        aTag.href = file;
        aTag.setAttribute('download', fileName);
        document.body.appendChild(aTag);
        aTag.click();
        window.open(file);
    };

    const steps1 = [
        'Order received',
        'Order sent',
        'Order collected by buyer',
    ];

    const steps2 = [
        'Order received',
        'Order canceled',
    ];

    const steps3 = [
        'Order received',
        'Order sent',
        'Order returned',
    ];

    function parseStatus(status) {

        let lastStatus = status[status.length - 1];
        let previous = '';
        if (status.length > 1) {
            previous = status[status.length - 2];
        }
        if (lastStatus === 'COMPLETED' || lastStatus === 'SENT' || lastStatus === 'RECEIVED') {
            return (
                <Box sx={{ width: '100%' }}>
                  <Stepper activeStep={status.length} alternativeLabel>
                    {steps1.map((label) => (
                            <Step key={label}
                                sx={{
                                    '& .MuiStepLabel-root .Mui-completed': {
                                    color: 'rgb(39, 99, 24)', // circle color (COMPLETED)
                                    },
                                    '& .MuiStepLabel-root .Mui-active': {
                                    color: 'rgb(39, 99, 24)', // circle color (ACTIVE)
                                    },
                                }}
                            >
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                  </Stepper>
                </Box>
              );
        } else if (lastStatus === 'CANCELED') {
            return (
                <Box sx={{ width: '100%' }}>
                  <Stepper activeStep={status.length} alternativeLabel>
                    {steps2.map((label) => {
                        if (label === 'Order canceled') {
                            return (
                                <Step key={label} 
                                sx={{
                                    '& .MuiStepLabel-root .Mui-completed': {
                                    color: 'rgb(129, 36, 29)', // circle color (COMPLETED)
                                    },
                                    '& .MuiStepLabel-root .Mui-active': {
                                    color: 'rgb(129, 36, 29)', // circle color (ACTIVE)
                                    },
                                }}
                                >
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            )
                        } else {
                            return (
                                <Step key={label}
                                    sx={{
                                        '& .MuiStepLabel-root .Mui-completed': {
                                        color: 'rgb(39, 99, 24)', // circle color (COMPLETED)
                                        },
                                        '& .MuiStepLabel-root .Mui-active': {
                                        color: 'rgb(39, 99, 24)', // circle color (ACTIVE)
                                        },
                                    }}
                                >
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            )
                        }
                    })}
                  </Stepper>
                </Box>
              );
        } else if ((lastStatus === 'RETURNED' && previous === 'SENT')) {
            return (
                <Box sx={{ width: '100%' }}>
                  <Stepper activeStep={status.length} alternativeLabel>
                    {steps3.map((label) => {
                        if (label === 'Order returned') {
                            return (
                                <Step key={label} 
                                    sx={{
                                        '& .MuiStepLabel-root .Mui-completed': {
                                        color: 'rgb(172, 109, 20)', // circle color (COMPLETED)
                                        },
                                        '& .MuiStepLabel-root .Mui-active': {
                                        color: 'rgb(172, 109, 20)', // circle color (ACTIVE)
                                        },
                                    }}
                                >
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            )
                        } else {
                            return (
                                <Step key={label}
                                    sx={{
                                        '& .MuiStepLabel-root .Mui-completed': {
                                        color: 'rgb(39, 99, 24)', // circle color (COMPLETED)
                                        },
                                        '& .MuiStepLabel-root .Mui-active': {
                                        color: 'rgb(39, 99, 24)', // circle color (ACTIVE)
                                        },
                                    }}
                                >
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            )
                        }
                    })}
                  </Stepper>
                </Box>
              );
        } else if ((lastStatus === 'RETURNED' && previous === 'COMPLETED')) {
            return (
                <Box sx={{ width: '100%' }}>
                  <Stepper activeStep={status.length} alternativeLabel>
                    {steps3.map((label) => {
                        if (label === 'Order returned') {
                            return (
                                <Step key={label} 
                                    sx={{
                                        '& .MuiStepLabel-root .Mui-completed': {
                                        color: 'rgb(172, 109, 20)', // circle color (COMPLETED)
                                        },
                                        '& .MuiStepLabel-root .Mui-active': {
                                        color: 'rgb(172, 109, 20)', // circle color (ACTIVE)
                                        },
                                    }}
                                >
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            )
                        } else {
                            return (
                                <Step key={label}
                                    sx={{
                                        '& .MuiStepLabel-root .Mui-completed': {
                                        color: 'rgb(39, 99, 24)', // circle color (COMPLETED)
                                        },
                                        '& .MuiStepLabel-root .Mui-active': {
                                        color: 'rgb(39, 99, 24)', // circle color (ACTIVE)
                                        },
                                    }}
                                >
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            )
                        }
                    })}
                  </Stepper>
                </Box>
              );
        }

    }

    return (
        <MyOrderPageContainer>
            <Backdrop
                sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
                open={openBackdrop}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>

            {showOrderDetails && (
                <OrderPageContent>
                    <StatusContainer>
                        {parseStatus(status)}
                    </StatusContainer>

                    <OrderInfoContainer>
                        <Typography variant="h6" sx={{margin: '0'}}>
                            Order nr: <span style={{fontWeight: 'normal'}}>{order.orderIdentifier}</span>
                        </Typography>
                        <Typography variant="body1" sx={{margin: '0'}}>
                            Date of purchase: <span style={{fontWeight: 'normal'}}>
                                {format(dateCreated, "MMMM do, yyyy")}
                            </span>
                        </Typography>
                        <Typography variant="body1" sx={{margin: '0'}}>
                            Total order price: <span style={{color: theme => theme.palette.success.main}}>
                                {totalPrice}$
                            </span>
                        </Typography>
                    </OrderInfoContainer>

                    {showDownloadInvoice && (
                        <InvoiceContainer>
                            <InvoiceInfo>
                                <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                                    Download your invoice PDF:
                                </Typography>
                                <Typography variant="body2" sx={{maxWidth: '90%'}}>
                                    {pdfFileName}
                                </Typography>
                            </InvoiceInfo>
                            <Box sx={{width: '50%', textAlign: 'center'}}>
                                <InvoiceButton
                                    variant="outlined"
                                    endIcon={<PictureAsPdfIcon/>}
                                    onClick={downloadPdf}
                                >
                                    Download invoice
                                </InvoiceButton>
                            </Box>
                        </InvoiceContainer>
                    )}

                    <OrderLeftSection>
                        <SectionHeader>Order details:</SectionHeader>
                        <DetailsContainer>
                            <DetailText>{name} {surname}</DetailText>
                            <DetailText>{email}</DetailText>
                            <DetailText>{phone}</DetailText>
                        </DetailsContainer>

                        <SectionHeader>Order delivery:</SectionHeader>
                        <DeliveryContainer>
                            <DetailText>{country}</DetailText>
                            <DetailText>{city}</DetailText>
                            <DetailText>{street}</DetailText>
                            <DetailText>{zipCode}</DetailText>
                        </DeliveryContainer>
                    </OrderLeftSection>

                    <OrderRightSection>
                        <Typography variant="h6" sx={{margin: '0 0 16px 0'}}>
                            Order items:
                        </Typography>
                        {orderItems.map(item => (
                            <OrderProductItem key={item.id} item={item}/>
                        ))}
                    </OrderRightSection>
                </OrderPageContent>
            )}

            {showNotFound && (
                <NotFoundContainer>
                    <NotFoundText>
                        We have not found an order<br/>you are looking for.
                    </NotFoundText>
                </NotFoundContainer>
            )}
        </MyOrderPageContainer>
    );
}

export default MyOrderPage;