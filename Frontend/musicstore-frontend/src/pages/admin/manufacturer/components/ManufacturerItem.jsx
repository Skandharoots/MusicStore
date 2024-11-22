import {
    Backdrop,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material";
import {Link} from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {Slide, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import LocalStorageHelper from "../../../../helpers/LocalStorageHelper.jsx";
import Grid from "@mui/material/Grid2";
import React, {useState} from "react";


function ManufacturerItem(props) {

    const [open, setOpen] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteManufacturer = (event) => {
        event.preventDefault();
        setOpenBackdrop(true);
        axios.get('api/users/csrf/token', {})
            .then((response) => {
                axios.delete(`api/products/manufacturers/delete/${props.id}`, {
                    headers: {
                        'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                        'X-XSRF-TOKEN': response.data.token,
                    }
                }).then(() => {
                    setOpenBackdrop(false);
                    toast.success("Manufacturer deleted!", {
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
    }


    return (
        <Grid sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '240px',
            height: '70px',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            paddingRight: '4px',
            color: 'black',
            fontSize: '12px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s',
            "&:hover": {
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.4)',
            },
        }}
              key={props.id}
        >
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className="manufacturer-metrics"
                 style={{width: '60%',
                     display: 'flex',
                     flexDirection: 'column',
                     justifyContent: 'center',
                     alignItems: 'flex-start',
                     height: '100%',
                     padding: '0 2%'
                 }}>
                <p style={{margin: '0', overflow: 'hidden', textWrap: 'nowrap'}}><b>Id: </b>{props.id}</p>
                <p style={{margin: '0', overflow: 'hidden', textWrap: 'nowrap'}}><b>Name: </b>{props.name}</p>
            </div>
            <div className="manufacturer-buttons"
                 style={{
                     height: '100%',
                     marginRight: '0',
                     display: 'flex',
                     flexDirection: 'column',
                     justifyContent: 'space-between',
                     alignItems: 'flex-start',
                     padding: '2% 0',
                     boxSizing: 'border-box',
                 }}
            >
                <Button
                    component={Link}
                    to={"/admin/manufacturer/update/" + props.id}
                    variant="contained"
                    size="small"
                    type="button"
                    sx={{
                        width: 'fit-content',
                        backgroundColor: 'rgb(255, 189, 3)',
                        "&:hover": {backgroundColor: 'rgb(255,211,51)'}
                    }}
                >
                    <EditIcon fontSize="small" />
                </Button>
                <React.Fragment>
                    <Button
                        variant="contained"
                        size="small"
                        type="button"
                        onClick={handleClickOpen}
                        sx={{
                            width: 'fit-content',
                            backgroundColor: 'rgb(159,20,20)',
                            "&:hover": {backgroundColor: 'rgb(193,56,56)'},
                            "&:focus": {outline: 'none !important'},

                        }}
                    >
                        <DeleteIcon fontSize="small" />
                    </Button>
                    <Dialog
                        open={open}
                        onClose={handleClose}
                    >
                        <DialogTitle>Delete manufacturer</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Do you want to delete {props.name} manufacturer?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                variant="contained"
                                onClick={handleClose}
                                sx={{
                                    backgroundColor: 'rgb(11,108,128)',
                                    "&:hover": {backgroundColor: 'rgb(16,147,177)'},
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={deleteManufacturer}
                                sx={{
                                    backgroundColor: 'rgb(159,20,20)',
                                    "&:hover": {backgroundColor: 'rgb(193,56,56)'},
                                }}
                            >
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                </React.Fragment>
            </div>

        </Grid>
    )

}

export default ManufacturerItem;