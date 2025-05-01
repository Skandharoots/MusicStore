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
    Box,
    styled
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

const SubcategoryItemContainer = styled(Grid)(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    width: '240px',
    height: '70px',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingRight: '4px',
    fontSize: '12px',
    color: theme.palette.text.primary,
    boxShadow: '0 5px 15px ' + theme.palette.itemShadow.main,
    transition: 'all 0.3s',
    "&:hover": {
        boxShadow: '0 5px 15px ' + theme.palette.itemShadow.light,
    },
}));

const MetricsContainer = styled(Box)(({theme}) => ({
    width: '60%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: '100%',
    padding: '0 2%'
}));

const ButtonsContainer = styled(Box)(({theme}) => ({
    height: '100%',
    marginRight: '0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '2% 0',
    boxSizing: 'border-box',
}));

const EditButton = styled(Button)(({theme}) => ({
    width: 'fit-content',
    color: theme.palette.mybutton.colorTwo,
    backgroundColor: theme.palette.editBtn.main,
    "&:hover": {backgroundColor: theme.palette.editBtn.light}
}));

const DeleteButton = styled(Button)(({theme}) => ({
    width: 'fit-content',
    backgroundColor: theme.palette.errorBtn.main,
    color: theme.palette.mybutton.colorTwo,
    "&:hover": {backgroundColor: theme.palette.errorBtn.light},
    "&:focus": {outline: 'none !important'},
}));

const CancelButton = styled(Button)(({theme}) => ({
    backgroundColor: theme.palette.blueBtn.main,
    color: theme.palette.mybutton.colorTwo,
    "&:hover": {backgroundColor: theme.palette.blueBtn.light},
}));

const ConfirmDeleteButton = styled(Button)(({theme}) => ({
    backgroundColor: theme.palette.errorBtn.main,
    color: theme.palette.mybutton.colorTwo,
    "&:hover": {backgroundColor: theme.palette.errorBtn.light},
}));

function SubcategoryItem(props) {
    const [open, setOpen] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteSubcategory = (event) => {
        event.preventDefault();
        setOpenBackdrop(true);
        LocalStorageHelper.CommitRefresh();
        axios.get('api/users/csrf/token', {})
            .then((response) => {
                axios.delete(`api/products/subcategories/delete/${props.subcategory.id}`, {
                    headers: {
                        'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                        'X-XSRF-TOKEN': response.data.token,
                    }
                }).then(() => {
                    setOpenBackdrop(false);
                    toast.success("Subcategory deleted!", {
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
        <SubcategoryItemContainer key={props.id}>
            <Backdrop
                sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
                open={openBackdrop}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>

            <MetricsContainer>
                <Typography variant="body2" sx={{margin: '0', overflow: 'hidden', textWrap: 'nowrap'}}>
                    <b>Id: </b>{props.subcategory.id}
                </Typography>
                <Typography variant="body2" sx={{margin: '0', overflow: 'hidden', textWrap: 'nowrap'}}>
                    <b>Name: </b>{props.subcategory.name}
                </Typography>
                <Typography variant="body2" sx={{margin: '0', overflow: 'hidden', textWrap: 'nowrap'}}>
                    <b>Category: </b>{props.subcategory.category.name}
                </Typography>
            </MetricsContainer>

            <ButtonsContainer>
                <EditButton
                    component={Link}
                    to={"/admin/subcategory/update/" + props.id}
                    variant="contained"
                    size="small"
                    type="button"
                >
                    <EditIcon fontSize="small"/>
                </EditButton>

                <React.Fragment>
                    <DeleteButton
                        variant="contained"
                        size="small"
                        type="button"
                        onClick={handleClickOpen}
                    >
                        <DeleteIcon fontSize="small"/>
                    </DeleteButton>

                    <Dialog
                        open={open}
                        onClose={handleClose}
                    >
                        <DialogTitle>Delete subcategory</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Do you want to delete {props.subcategory.name} subcategory?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <CancelButton
                                variant="contained"
                                onClick={handleClose}
                            >
                                Cancel
                            </CancelButton>
                            <ConfirmDeleteButton
                                variant="contained"
                                onClick={deleteSubcategory}
                            >
                                Delete
                            </ConfirmDeleteButton>
                        </DialogActions>
                    </Dialog>
                </React.Fragment>
            </ButtonsContainer>
        </SubcategoryItemContainer>
    );
}

export default SubcategoryItem;