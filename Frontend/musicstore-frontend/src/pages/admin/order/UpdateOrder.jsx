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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TextField from "@mui/material/TextField";


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
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfFileName, setPdfFileName] = useState('');
    const [pdfFileError, setPdfFileError] = useState(false);
    const [pdfFileErrorMessage, setPdfFileErrorMessage] = useState('');
    const [showFileUploadButton, setShowFileUploadButton] = useState(true);
    const [showDownloadButton, setShowDownloadButton] = useState(false);
    const [showUploadButton, setShowUploadButton] = useState(false);
    const [showDeleteButton, setShowDeleteButton] = useState(false);

    const iden = useParams();

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
               setStatus(res.data.status);
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
            setProductNameError(false);
            setProductNameErrorMsg('');
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
                    <p style={{margin: '0', fontSize: '14px', maxWidth: '100%', textWrap: 'wrap' , fontWeight: 'bold'}}>Order nr: <span
                        style={{margin: '0', fontSize: '14px', maxWidth: '100%', textWrap: 'wrap' , fontWeight: 'normal'}}>{order.orderIdentifier}</span></p>
                    <p style={{margin: '0', fontSize: '14px', maxWidth: '100%', textWrap: 'wrap' , fontWeight: 'bold'}}>Date of purchase: <span
                        style={{
                            margin: '0',
                            fontSize: '14px',
                            fontWeight: 'normal'
                        }}>{format(dateCreated, "MMMM do, yyyy")}</span></p>
                    <p style={{margin: '0', fontSize: '14px', maxWidth: '100%', textWrap: 'wrap' , fontWeight: 'bold'}}>Total order price: <span
                        style={{fontWeight: 'normal'}}>{order.totalPrice}$</span></p>
                </div>
                <div className="update-order-left">
                    <div className="order-personal-details">
                        <p style={{margin: '0', maxWidth: '100%', wordBreak: 'break-all', fontSize: '14px', textWrap: 'wrap'}}>{name} {surname}</p>
                        <p style={{margin: '0', maxWidth: '100%', wordBreak: 'break-all', fontSize: '14px', textWrap: 'wrap'}}>{email}</p>
                        <p style={{margin: '0', maxWidth: '100%', wordBreak: 'break-all', fontSize: '14px', textWrap: 'wrap'}}>{phone}</p>
                    </div>
                    <div className="order-delivery">
                        <p style={{margin: '0', maxWidth: '100%', wordBreak: 'break-all', fontSize: '14px', textWrap: 'wrap'}}>{country}</p>
                        <p style={{margin: '0', maxWidth: '100%', wordBreak: 'break-all', fontSize: '14px', textWrap: 'wrap'}}>{city}</p>
                        <p style={{margin: '0', maxWidth: '100%', wordBreak: 'break-all', fontSize: '14px', textWrap: 'wrap'}}>{streetAddress}</p>
                        <p style={{margin: '0', maxWidth: '100%', wordBreak: 'break-all', fontSize: '14px', textWrap: 'wrap'}}>{zipCode}</p>
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
                <div className="genPdf">
                <Typography
                    component="h1"
                    variant="h5"
                    sx={{
                        width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', color: 'black'
                        , margin: '0 auto 5% auto'
                    }}
                >Generate Invoice
                    </Typography>
                    <TextField
                        size={"small"}
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
                    {showFileUploadButton &&
                        <Button
                        className="upload-btn"
                        component="label"
                        endIcon={<CloudUploadIcon/>}
                        fullWidth
                        variant="contained"
                        sx={{
                            width: '100%',
                            backgroundColor: 'rgb(17, 128, 138)',
                            "&:hover": {backgroundColor: 'rgb(18, 154, 167)'}
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
                    }
                    <div style={{
                        width: '100%',
                        height: 'fit-content',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '8px',
                    }}>
                        {showDeleteButton && 
                            <Button
                                className="download-btn"
                                type="button"
                                endIcon={<DeleteIcon/>}
                                fullWidth
                                variant="contained"
                                onClick={deletePdf}
                                sx={{
                                    width: '47%',
                                    backgroundColor: 'rgb(159, 20, 20)',
                                    "&:hover": {backgroundColor: 'rgb(193, 56, 56)'}
                                }}
                            >
                                Delete
                            </Button>
                        }
                    
                        {showDownloadButton &&
                            <Button
                                className="download-btn"
                                type="button"
                                endIcon={<CloudDownloadIcon/>}
                                fullWidth
                                variant="contained"
                                onClick={downloadPdf}
                                sx={{
                                    width: generateWidth(),
                                    backgroundColor: 'rgb(94, 48, 89)',
                                    "&:hover": {backgroundColor: 'rgb(127, 79, 121)'}
                                }}
                            >
                                Download
                            </Button>
                        }
                    </div>
                    {showUploadButton &&
                        <Button
                            className="download-btn"
                            type="button"
                            endIcon={<CloudUploadIcon/>}
                            fullWidth
                            variant="contained"
                            onClick={uploadPdf}
                            sx={{
                                marginTop: '8px',
                                width: '100%',
                                backgroundColor: 'rgb(17, 128, 138)',
                                "&:hover": {backgroundColor: 'rgb(18, 154, 167)'}
                            }}
                        >
                            Upload to Azure
                        </Button>
                    }

                </div>
            </div>
        </div>
    )
}

export default UpdateOrder;