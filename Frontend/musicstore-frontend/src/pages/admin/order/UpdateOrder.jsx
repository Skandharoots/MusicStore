import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";
import {Slide, toast} from "react-toastify";
import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    styled,
    TextField,
    Stepper,
    Step,
    StepLabel, useTheme
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import {format} from "date-fns";
import AdminOrderProductItem from "./components/AdminOrderProductItem.jsx";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const OrderUpdateContainer = styled(Box)(({theme}) => ({
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '80dvh',
    width: '796px',
    borderLeft: '1px solid ' + theme.palette.divider,
    color: theme.palette.text.primary,
}));

const OrderUpdateForm = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: '950px',
    width: '500px',
    minWidth: '200px',
    margin: '16px 20% 16px 20%',
    borderRadius: '1em',
    boxShadow: '0 5px 15px ' + theme.palette.formShadow.main,
    padding: '2%',
}));

const UpdateOrderLeft = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    boxSizing: 'border-box',
    width: '100%',
    borderBottom: '1px solid ' + theme.palette.divider,
}));

const OrderPersonalDetails = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    height: 'fit-content',
    padding: '16px',
    borderRadius: '1em',
    marginBottom: '16px',
    boxSizing: 'border-box',
    boxShadow: '0 5px 15px ' + theme.palette.itemShadow.main,
}));

const OrderDelivery = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    height: 'fit-content',
    padding: '16px',
    borderRadius: '1em',
    marginBottom: '16px',
    boxSizing: 'border-box',
    boxShadow: '0 5px 15px ' + theme.palette.itemShadow.main,
}));

const UpdateOrderRight = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    boxSizing: 'border-box',
    width: '100%',
    minWidth: '180px',
    padding: '0 0 0 0',
    marginTop: '16px',
}));

const GenPdfContainer = styled(Box)(({theme}) => ({
    width: '100%',
    height: 'fit-content',
    padding: '16px 0 0 0',
    marginTop: '16px',
    borderTop: '1px solid ' + theme.palette.divider,
    display: 'flex',
    flexDirection: 'column',
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
    boxShadow: '0 5px 15px ' + theme.palette.itemShadow.main,
    marginBottom: '16px',
}));

const OrderInfoText = styled(Typography)(({theme}) => ({
    margin: '0',
    fontSize: '14px',
    maxWidth: '100%',
    textWrap: 'wrap',
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'left',
}));

const OrderInfoValue = styled(Typography)(({theme}) => ({
    margin: '0',
    fontSize: '14px',
    maxWidth: '100%',
    textWrap: 'wrap',
    fontWeight: 'normal',
    width: '100%',
    textAlign: 'left',
}));

const PersonalInfoText = styled(Typography)(({theme}) => ({
    margin: '0',
    maxWidth: '100%',
    wordBreak: 'break-all',
    fontSize: '14px',
    textWrap: 'wrap',
    width: '100%',
    textAlign: 'left',
}));

const StatusStepper = styled(Stepper)(({theme}) => ({
    width: '100%',
}));

const StatusStep = styled(Step)(({theme, status}) => ({
    '& .MuiStepLabel-root .Mui-completed': {
        color: status === 'CANCELED' ? 'rgb(129, 36, 29)' :
               status === 'RETURNED' ? 'rgb(172, 109, 20)' :
               'rgb(39, 99, 24)',
    },
    '& .MuiStepLabel-root .Mui-active': {
        color: status === 'CANCELED' ? 'rgb(129, 36, 29)' :
               status === 'RETURNED' ? 'rgb(172, 109, 20)' :
               'rgb(39, 99, 24)',
    },
}));

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
    const [statusArr, setStatusArr] = useState([]);
    const [status, setStatus] = useState('RECEIVED');
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfFileName, setPdfFileName] = useState('');
    const [pdfFileError, setPdfFileError] = useState(false);
    const [pdfFileErrorMessage, setPdfFileErrorMessage] = useState('');
    const [showFileUploadButton, setShowFileUploadButton] = useState(true);
    const [showDownloadButton, setShowDownloadButton] = useState(false);
    const [showUploadButton, setShowUploadButton] = useState(false);
    const [showDeleteButton, setShowDeleteButton] = useState(false);

    const iden = useParams();

    const theme = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        setOpenBackdrop(true);
        LocalStorageHelper.CommitRefresh();
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
               setStatus(res.data.status[res.data.status.length - 1]);
               setStatusArr(res.data.status);
               axios.get(`api/invoice/list?path=${iden.orderIdentifier}`, {})
                    .then(res => {
                        if (res.data.length > 0) {
                            let fileName = res.data[0].split('/')[1];
                            axios.get(`api/invoice/read?path=${res.data[0]}`, {responseType: 'blob'})
                            .then(res => {
                                let blob = new Blob([res.data], {type: "application/pdf"});
                                setPdfFile(blob);
                                let file = URL.createObjectURL(blob);
                                setPdfFileName(String(fileName));
                                setShowUploadButton(false);
                                setShowDeleteButton(true);
                                setShowFileUploadButton(false);
                                setShowDownloadButton(true);
                                setOpenBackdrop(false);
                            }).catch((e) => {
                                setOpenBackdrop(false);
                                toast.error(err.response.data.message, {
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
                        } else {
                            setOpenBackdrop(false);
                        }
                    }).catch(() => {
                        setOpenBackdrop(false);
                        toast.error(err.response.data.message, {
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
           }).catch(err => {
                setOpenBackdrop(false);
                toast.error(err.response.data.message, {
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
    }, [])

    const updateOrder = (e) => {
        e.preventDefault();
        setOpenBackdrop(true);
        LocalStorageHelper.CommitRefresh();
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

    const downloadPdf = () => {

        const aTag = document.createElement('a');
        let file = URL.createObjectURL(pdfFile);
        let fileName = pdfFileName;
        aTag.href = file;
        aTag.setAttribute('download', fileName);
        document.body.appendChild(aTag);
        aTag.click();
        window.open(file);

    }

    const deletePdf = (e) => {

        e.preventDefault();
        setOpenBackdrop(true);
        axios.get('api/users/csrf/token', {})
            .then(r => {
                axios.delete(`api/invoice/delete?path=${iden.orderIdentifier}/${pdfFileName}`, {
                    headers: {
                        'X-XSRF-TOKEN': r.data.token,
                        'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                    }
                }).then(() => {
                    setOpenBackdrop(false);
                    setPdfFile(null);
                    setShowDeleteButton(false);
                    setShowDownloadButton(false);
                    setShowFileUploadButton(true);
                    setShowUploadButton(false);
                    setPdfFileName('');
                    toast.success('Invoice deleted', {
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
                }).catch((e) => {
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

    const validatePdfForm = (e) => {

        let isValid = false;

        if (!pdfFileName
            || !/^FS[/_][A-Za-z0-9_/\-]+$/i.test(pdfFileName)) {
            setPdfFileError(true);
            setPdfFileErrorMessage('Please enter a well formed file name. It should only contain the following pattern: FS_23_02_2024_askdj-asd23-asd23-djdkls56');
            isValid = false;
        } else {
            setPdfFileError(false);
            setPdfFileErrorMessage('');
        }

        if (pdfFile.length <= 0) {
            toast.error('Pdf invoice not selected!', {
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
            isValid = false;
        }

        return isValid;

    }

    const handleFile = (e) => {
        if (e.target.files) {
            let sizeCheck = true;
            const file = e.target.files[0];
            
            if (file.size > 6 * 1000 * 1024) {
                sizeCheck = false;
            }
            
            if (sizeCheck) {
                setPdfFile(file);
                setShowDownloadButton(true);
                setShowUploadButton(true);
                setShowDeleteButton(false);
                setShowFileUploadButton(false);
                setPdfFileName(file.name);
            } else {
                toast.error('Pdf file size cannot exceed 6MB', {
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
            }
        }
    }

    const uploadPdf = (e) => {
        e.preventDefault()
        if (!validatePdfForm) {
            return;
        }
        setOpenBackdrop(true);
        LocalStorageHelper.CommitRefresh();
        const formData = new FormData();
        formData.append('file', pdfFile);
        formData.append('path', iden.orderIdentifier);
        formData.append('fileName', pdfFileName);
        axios.get('api/users/csrf/token')
            .then(res => {
                axios.post('api/invoice/upload', formData, {
                    headers: {
                        'X-XSRF-TOKEN': res.data.token,
                        'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                        'Content-Type': 'multipart/form-data',
                    }
                }).then(resp => {
                    setOpenBackdrop(false);
                    setShowDownloadButton(true);
                    setShowUploadButton(false);
                    setShowDeleteButton(true);
                    setShowFileUploadButton(false);
                    toast.success("Invoice generated.", {
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
                }).catch(e => {
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

    const generateWidth = () => {
        let width = '47%';
        showDeleteButton ? width = '47%' : width = '100%';
        return width; 
    }

    const steps1 = [
        'Order received',
        'Order sent',
        'Order collected by buyer',
    ];

    const steps2 = [
        'Order received',
        'Order canceled'
    ];

    const steps3 = [
        'Order received',
        'Order sent',
        'Order returned'
    ]

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
        <OrderUpdateContainer>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <OrderUpdateForm>
                <Typography
                    component="h1"
                    variant="h5"
                    sx={{
                        width: '100%',
                        fontSize: 'clamp(2rem, 10vw, 2.15rem)',
                        margin: '0 auto 5% auto'
                    }}
                >
                    Update order
                </Typography>
                
                <OrderInfoContainer>
                    <OrderInfoText>Order nr: <OrderInfoValue>{order.orderIdentifier}</OrderInfoValue></OrderInfoText>
                    <OrderInfoText>Date of purchase: <OrderInfoValue>{format(dateCreated, "MMMM do, yyyy")}</OrderInfoValue></OrderInfoText>
                    <OrderInfoText>Total order price: <OrderInfoValue>{order.totalPrice}$</OrderInfoValue></OrderInfoText>
                </OrderInfoContainer>

                <UpdateOrderLeft>
                    <OrderPersonalDetails>
                        <PersonalInfoText>{name} {surname}</PersonalInfoText>
                        <PersonalInfoText>{email}</PersonalInfoText>
                        <PersonalInfoText>{phone}</PersonalInfoText>
                    </OrderPersonalDetails>
                    
                    <OrderDelivery>
                        <PersonalInfoText>{country}</PersonalInfoText>
                        <PersonalInfoText>{city}</PersonalInfoText>
                        <PersonalInfoText>{streetAddress}</PersonalInfoText>
                        <PersonalInfoText>{zipCode}</PersonalInfoText>
                    </OrderDelivery>
                </UpdateOrderLeft>

                <UpdateOrderRight>
                    {[...orderItems].map(item => (
                        <AdminOrderProductItem key={item.id} item={item}/>
                    ))}
                </UpdateOrderRight>

                <Box sx={{
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
                    {parseStatus(statusArr)}
                </Box>

                <Box sx={{ marginTop: '16px', width: '100%' }}>
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
                            variant="outlined"
                        >
                            <MenuItem value="RECEIVED">Order received</MenuItem>
                            <MenuItem value="SENT">Order sent</MenuItem>
                            <MenuItem value="COMPLETED">Order completed</MenuItem>
                            <MenuItem value="CANCELED">Order canceled</MenuItem>
                            <MenuItem value="RETURNED">Order returned</MenuItem>
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
                            color: 'white',
                            backgroundColor: 'rgb(39, 99, 24)',
                            "&:hover": {backgroundColor: 'rgb(49,140,23)'}
                        }}
                    >
                        Update Order
                    </Button>
                </Box>

                <GenPdfContainer>
                    <Typography
                        component="h1"
                        variant="h5"
                        sx={{
                            width: '100%',
                            fontSize: 'clamp(2rem, 10vw, 2.15rem)',
                            margin: '0 auto 5% auto'
                        }}
                    >
                        Upload Invoice
                    </Typography>

                    <TextField
                        size="small"
                        error={pdfFileError}
                        helperText={pdfFileErrorMessage}
                        id="pdfFileName"
                        type="email"
                        name="pdfFileName"
                        placeholder="FS/23/03/2024"
                        autoComplete="pdfFileName"
                        required
                        fullWidth
                        variant="outlined"
                        color={pdfFileError ? 'error' : 'primary'}
                        label="Invoice name"
                        value={pdfFileName}
                        onChange={e => setPdfFileName(e.target.value)}
                        sx={{
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
                        }}
                    />

                    {showFileUploadButton && (
                        <Button
                            className="upload-btn"
                            component="label"
                            endIcon={<CloudUploadIcon/>}
                            fullWidth
                            variant="contained"
                            sx={{
                                width: '100%',
                                color: 'white',
                                backgroundColor: theme.palette.blueBtn.main,
                                "&:hover": {backgroundColor: theme.palette.blueBtn.light}
                            }}
                        >
                            Upload Pdf
                            <input
                                type="file"
                                accept="image/*,.pdf"
                                hidden
                                formNoValidate
                                multiple={false}
                                onChange={handleFile}
                            />
                        </Button>
                    )}

                    <Box sx={{
                        width: '100%',
                        height: 'fit-content',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '8px',
                    }}>
                        {showDeleteButton && (
                            <Button
                                className="download-btn"
                                type="button"
                                endIcon={<DeleteIcon/>}
                                fullWidth
                                variant="contained"
                                onClick={deletePdf}
                                sx={{
                                    width: '47%',
                                    color: 'white',
                                    backgroundColor: theme.palette.errorBtn.main,
                                    "&:hover": {backgroundColor: theme.palette.errorBtn.light}
                                }}
                            >
                                Delete
                            </Button>
                        )}
                        
                        {showDownloadButton && (
                            <Button
                                className="download-btn"
                                type="button"
                                endIcon={<CloudDownloadIcon/>}
                                fullWidth
                                variant="contained"
                                onClick={downloadPdf}
                                sx={{
                                    width: generateWidth(),
                                    color: 'white',
                                    backgroundColor: theme.palette.downloadBtn.main,
                                    "&:hover": {backgroundColor: theme.palette.downloadBtn.light}
                                }}
                            >
                                Download
                            </Button>
                        )}
                    </Box>

                    {showUploadButton && (
                        <Button
                            className="download-btn"
                            type="button"
                            endIcon={<CloudUploadIcon/>}
                            fullWidth
                            variant="contained"
                            onClick={uploadPdf}
                            sx={{
                                marginTop: '8px',
                                color: 'white',
                                width: '100%',
                                backgroundColor: 'rgb(17, 128, 138)',
                                "&:hover": {backgroundColor: 'rgb(18, 154, 167)'}
                            }}
                        >
                            Upload to Azure
                        </Button>
                    )}
                </GenPdfContainer>
            </OrderUpdateForm>
        </OrderUpdateContainer>
    );
}

export default UpdateOrder;