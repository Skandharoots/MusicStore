import {
    Backdrop,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography,
    Box
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {Link} from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {Slide, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import LocalStorageHelper from "../../../../helpers/LocalStorageHelper.jsx";
import React, {useState} from "react";
import {styled} from "@mui/material/styles";

const CategoryItemContainer = styled(Grid)(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    width: '240px',
    height: '80px',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingRight: theme.spacing(0.5),
    color: theme.palette.text.primary,
    fontSize: '12px',
    padding: '4px',
    borderRadius: '1em',
    boxSizing: 'border-box',
    boxShadow: '0 5px 15px ' + theme.palette.itemShadow.main,
    transition: 'all 0.3s',
    "&:hover": {
        boxShadow: '0 5px 15px ' + theme.palette.itemShadow.light,
    },
}));

const CategoryMetrics = styled(Box)(({theme}) => ({
    width: '60%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: '100%',
    padding: theme.spacing(0, 0.25),
}));

const CategoryButtons = styled(Box)(({theme}) => ({
    height: '100%',
    marginRight: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: theme.spacing(0.25, 0),
    boxSizing: 'border-box',
}));

const EditButton = styled(Button)(({theme}) => ({
    width: 'fit-content',
    backgroundColor: 'rgb(255, 189, 3)',
    color: theme.palette.mybutton.colorTwo,
    "&:hover": {
        backgroundColor: 'rgb(255,211,51)'
    }
}));

const DeleteButton = styled(Button)(({theme}) => ({
    width: 'fit-content',
    backgroundColor: 'rgb(159,20,20)',
    color: theme.palette.mybutton.colorTwo,
    "&:hover": {
        backgroundColor: 'rgb(193,56,56)'
    },
    "&:focus": {
        outline: 'none !important'
    }
}));

const CancelButton = styled(Button)(({theme}) => ({
    backgroundColor: 'rgb(11,108,128)',
    color: theme.palette.mybutton.colorTwo,
    "&:hover": {
        backgroundColor: 'rgb(16,147,177)'
    }
}));

const ConfirmDeleteButton = styled(Button)(({theme}) => ({
    backgroundColor: 'rgb(159,20,20)',
    color: theme.palette.mybutton.colorTwo,
    "&:hover": {
        backgroundColor: 'rgb(193,56,56)'
    }
}));

function CategoryItem(props) {
    const [open, setOpen] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteCategory = (event) => {
        event.preventDefault();
        setOpenBackdrop(true);
        LocalStorageHelper.CommitRefresh();
        axios.get('api/users/csrf/token', {})
            .then((response) => {
                axios.delete(`api/products/categories/delete/${props.id}`, {
                    headers: {
                        'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                        'X-XSRF-TOKEN': response.data.token,
                    }
                }).then(() => {
                    setOpenBackdrop(false);
                    window.dispatchEvent(new Event("category"));
                    toast.success("Category deleted!", {
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
        <CategoryItemContainer key={props.id}>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            
            <CategoryMetrics>
                <Typography variant="body2" sx={{ margin: 0, overflow: 'hidden', textWrap: 'nowrap' }}>
                    <b>Id: </b>{props.id}
                </Typography>
                <Typography variant="body2" sx={{ margin: 0, overflow: 'hidden', textWrap: 'nowrap' }}>
                    <b>Name: </b>{props.name}
                </Typography>
            </CategoryMetrics>

            <CategoryButtons>
                <EditButton
                    component={Link}
                    to={"/admin/category/update/" + props.id}
                    variant="contained"
                    size="small"
                    type="button"
                >
                    <EditIcon fontSize="small" />
                </EditButton>

                <DeleteButton
                    variant="contained"
                    size="small"
                    type="button"
                    onClick={handleClickOpen}
                >
                    <DeleteIcon fontSize="small" />
                </DeleteButton>

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Delete category</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Do you want to delete {props.name} category?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <CancelButton variant="contained" onClick={handleClose}>
                            Cancel
                        </CancelButton>
                        <ConfirmDeleteButton variant="contained" onClick={deleteCategory}>
                            Delete
                        </ConfirmDeleteButton>
                    </DialogActions>
                </Dialog>
            </CategoryButtons>
        </CategoryItemContainer>
    );
}

export default CategoryItem;