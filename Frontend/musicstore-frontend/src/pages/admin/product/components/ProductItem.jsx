import {
    Backdrop,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Tooltip,
    Typography,
    Box,
    styled
} from "@mui/material";
import {Link} from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LocalStorageHelper from "../../../../helpers/LocalStorageHelper.jsx";
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import React, {useEffect, useState} from "react";
import {Slide, toast} from "react-toastify";

const ProductContainer = styled(Grid)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '240px',
    height: 'fit-content',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: '4px',
    color: theme.palette.text.primary,
    fontSize: '12px',
    boxShadow: '0 5px 15px ' + theme.palette.itemShadow.main,
    transition: 'all 0.3s',
    "&:hover": {
        boxShadow: '0 5px 15px ' + theme.palette.itemShadow.light,
    },
}));

const ImageContainer = styled(Box)(({theme}) => ({
    width: "100%",
    height: "150px",
    display: "flex",
    overflow: "hidden",
}));

const ProductImage = styled(Box)(({theme}) => ({
    width: '100%',
    maxHeight: '100%',
    aspectRatio: "10 / 6",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundSize: 'cover',
    backgroundColor: 'white',
    flexShrink: '0',
    flexGrow: '0',
}));

const ProductImg = styled('img')(({theme}) => ({
    objectFit: 'cover',
    maxWidth: '100%',
    maxHeight: '100%',
    display: 'block',
    flexShrink: '0',
    flexGrow: '0',
}));

const ProductMetrics = styled(Box)(({theme}) => ({
    width: '90%',
    display: 'block',
    padding: '2%',
    fontSize: '12px',
}));

const ProductText = styled(Typography)(({theme}) => ({
    margin: '0',
    overflow: 'hidden',
    textWrap: 'nowrap',
    fontSize: '12px',

}));

const ProductButtons = styled(Box)(({theme}) => ({
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '0 2%',
    boxSizing: 'border-box',
}));

const EditButton = styled(Button)(({theme}) => ({
    width: 'fit-content',
    margin: '4px 0',
    color: theme.palette.mybutton.colorTwo,
    backgroundColor: 'rgb(255, 189, 3)',
    "&:hover": {backgroundColor: 'rgb(255,211,51)'}
}));

const DeleteButton = styled(Button)(({theme}) => ({
    width: 'fit-content',
    margin: '4px 0',
    color: theme.palette.mybutton.colorTwo,
    backgroundColor: 'rgb(159,20,20)',
    "&:hover": {backgroundColor: 'rgb(193,56,56)'},
    "&:focus": {outline: 'none !important'},
}));

const DialogCancelButton = styled(Button)(({theme}) => ({
    backgroundColor: 'rgb(11,108,128)',
    color: theme.palette.mybutton.colorTwo,
    "&:hover": {backgroundColor: 'rgb(16,147,177)'},
}));

const DialogDeleteButton = styled(Button)(({theme}) => ({
    backgroundColor: 'rgb(159,20,20)',
    color: theme.palette.mybutton.colorTwo,
    "&:hover": {backgroundColor: 'rgb(193,56,56)'},
}));

function ProductItem(props) {
    const [img, setImg] = useState(null);
    const [filePaths, setFilePaths] = useState([]);
    const [open, setOpen] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        axios.get(`api/azure/list?path=${props.item.productSkuId}`, {})
            .then((response) => {
                setFilePaths(response.data);
                axios.get(`api/azure/read?path=${response.data[0]}`, {responseType: 'blob'})
                    .then(res => {
                        var blob = new Blob([res.data], {type: "image/*"});
                        setImg(URL.createObjectURL(blob));
                    }).catch((error) => {
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
            }).catch(error => {
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
    }, []);

    const deleteProduct = (event) => {
        event.preventDefault();
        setOpenBackdrop(true);
        LocalStorageHelper.CommitRefresh();
        axios.get('api/users/csrf/token', {})
            .then((response) => {
                axios.delete(`api/products/items/delete/${props.item.productSkuId}`, {
                    headers: {
                        'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                        'X-XSRF-TOKEN': response.data.token,
                    }
                }).then(() => {
                    setOpenBackdrop(false);
                    toast.success("Product deleted!", {
                        position: "bottom-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                        progress: undefined,
                        theme: "light",
                        transition: Slide,
                    });
                    props.onDelete(props.id);
                }).catch((error) => {
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
                    });
                })
            }).catch(() => {
                setOpenBackdrop(false);
                toast.error("Cannot fetch token", {
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

        axios.get('api/users/csrf/token', {})
            .then((response) => {
                [...filePaths].map((filepath, index) => {
                    axios.delete(`api/azure/delete?path=${filepath}`, {
                        headers: {
                            'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                            'X-XSRF-TOKEN': response.data.token,
                        }
                    }).then(() => {
                        toast.success("Product image nr: " + (index + 1) + " deleted", {
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
                    }).catch(error => {
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
                })
            })
    };

    return (
        <ProductContainer key={props.item.id}>
            <Backdrop
                sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
                open={openBackdrop}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            
            <ImageContainer>
                <ProductImage>
                    <ProductImg alt={'No image'} src={img} />
                </ProductImage>
            </ImageContainer>
            
            <ProductMetrics>
                <ProductText><b>Id: </b>{props.item.id}</ProductText>
                <Tooltip title={props.item.productSkuId}>
                    <ProductText><b>Sku Id: </b>{props.item.productSkuId}</ProductText>
                </Tooltip>
                <Tooltip title={props.item.productName}>
                    <ProductText><b>Name: </b>{props.item.productName}</ProductText>
                </Tooltip>
                <ProductText><b>Price: </b>{props.item.productPrice.toFixed(2)}$</ProductText>
                <ProductText><b>In stock: </b>{props.item.inStock}</ProductText>
            </ProductMetrics>
            
            <ProductButtons>
                <EditButton
                    component={Link}
                    to={"/admin/product/update/" + props.item.productSkuId}
                    variant="contained"
                    size="small"
                    type="button"
                    fullWidth
                >
                    <EditIcon fontSize="small"/>
                </EditButton>
                
                <React.Fragment>
                    <DeleteButton
                        variant="contained"
                        size="small"
                        type="button"
                        onClick={handleClickOpen}
                        fullWidth
                    >
                        <DeleteIcon fontSize="small"/>
                    </DeleteButton>
                    
                    <Dialog
                        open={open}
                        onClose={handleClose}
                    >
                        <DialogTitle>Delete product</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Do you want to delete {props.item.productName} product?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <DialogCancelButton
                                variant="contained"
                                onClick={handleClose}
                            >
                                Cancel
                            </DialogCancelButton>
                            <DialogDeleteButton
                                variant="contained"
                                onClick={deleteProduct}
                            >
                                Delete
                            </DialogDeleteButton>
                        </DialogActions>
                    </Dialog>
                </React.Fragment>
            </ProductButtons>
        </ProductContainer>
    );
}

export default ProductItem;