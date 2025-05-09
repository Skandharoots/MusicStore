import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Rating,
    TextField,
    styled,
    Typography
} from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import React, {useEffect, useState} from "react";
import axios from "axios";
import LocalStorageHelper from "../../../helpers/LocalStorageHelper";
import {Slide, toast} from "react-toastify";

const OpinionContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    boxShadow: '0 5px 15px 0 ' + theme.palette.formShadow.main,
    color: theme.palette.text.primary,
    borderRadius: '1em',
    padding: '8px',
}));

const ItemImage = styled(Box)(({theme}) => ({
    maxWidth: '30%',
    minWidth: '30%',
    height: '85px',
    aspectRatio: '16 / 9',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    display: "flex",
    overflow: "hidden",
    backgroundColor: 'white',
    borderRadius: '1em',
    marginRight: '16px',
}));

const Image = styled('img')(({theme}) => ({
    objectFit: 'cover',
    maxWidth: '100%',
    maxHeight: '100%',
    display: 'block',
    flexShrink: '0',
    flexGrow: '0',
}));

const ProductInfo = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: 'fit-content',
    height: 'fit-content',
}));

const CommentContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
}));

const CommentText = styled('p')(({theme}) => ({
    margin: '0',
    padding: '8px',
    fontSize: '16px',
    fontWeight: 'normal',
    textWrap: 'wrap',
    overflow: 'hidden',
}));

const ButtonContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: 'fit-content',
    marginTop: '8px',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
}));

const ActionButtons = styled(Box)(({theme}) => ({
    height: '100%',
    width: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
}));

const StyledRating = styled(Rating)(({theme}) => ({
    '& .MuiRating-iconFilled': {
        color: '#ff6d75',
    },
    '& .MuiRating-iconHover': {
        color: '#ff3d47',
    },
}));

const ShowMoreButton = styled(Button)(({theme}) => ({
    fontSize: '10px',
    fontWeight: 'bold',
    height: '36px',
    borderColor: theme.palette.irish.main,
    color: theme.palette.irish.main,
    marginRight: '8px',
    outline: 'none !important',
    '&:focus': {
        borderColor: theme.palette.irish.light,
        outline: 'none !important',
    },
    '&:hover': {
        borderColor: theme.palette.irish.light,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: theme.palette.irish.light,
        outline: 'none !important',
    },
}));

const EditButton = styled(Button)(({theme}) => ({
    width: 'fit-content',
    margin: '4px 0',
    color: theme.palette.mybutton.colorTwo,
    backgroundColor: theme.palette.editBtn.main,
    '&:hover': {
        backgroundColor: theme.palette.editBtn.light,
    },
}));

const DeleteButton = styled(Button)(({theme}) => ({
    width: 'fit-content',
    margin: '4px 0',
    color: theme.palette.mybutton.colorTwo,
    backgroundColor: theme.palette.errorBtn.main,
    '&:hover': {
        backgroundColor: theme.palette.errorBtn.light,
    },
    '&:focus': {
        outline: 'none !important',
    },
}));

const StyledTextField = styled(TextField)(({theme}) => ({
    width: '500px',
    margin: '16px 0',
    '& label.Mui-focused': {
        color: theme.palette.primary.main,
    },
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
        },
    },
}));

function Opinion(props) {
    const [myHeight, setMyHeight] = useState('36px');
    const [editText, setEditText] = useState('');
    const [productOpinionError, setProductOpinionError] = useState(false);
    const [productOpinionErrorMsg, setProductOpinionErrorMsg] = useState('');
    const [userRating, setUserRating] = useState(1);
    const [image, setImage] = useState(null);
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [productName, setProductName] = useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickOpenEdit = () => {
        setOpenEdit(true);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
    };

    useEffect(() => {
        setUserRating(generateRating(props.opinion.rating));
    }, [props.opinion]);

    useEffect(() => {
        axios.get(`api/products/items/get/${props.opinion.productUuid}`, {})
        .then(response => {
            setProductName(response.data.productName);
        }).catch((e) => {
            toast.error(e.response.data.message, {
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
        });
    }, [props.opinion]);
    
    useEffect(() => {
        axios.get(`api/azure/list?path=${props.opinion.productUuid}`, {})
        .then(response => {
            axios.get(`api/azure/read?path=${response.data[0]}`, {responseType: 'blob'})
            .then(res => {
                let blob = new Blob([res.data], { type: "image/*" });
                setImage(URL.createObjectURL(blob));
                setEditText(props.opinion.comment);
            }).catch(() => {
                //
            });
        }).catch(() => {
            //
        });
    }, [props.opinion]);

    const changeHeight = () => {
        setMyHeight(myHeight === '36px' ? 'fit-content' : '36px');
    };

    const generateRating = (rating) => {
        if (rating === 'ONE') {
            return 1;
        } else if (rating === 'TWO') {
            return 2;
        } else if (rating === 'THREE') {
            return 3;
        } else if (rating === 'FOUR') {
            return 4;
        } else if (rating === 'FIVE') {
            return 5;
        }
    };

    const validateOpinion = () => {
        let isValid = true;

        if (editText.length < 10 || editText.length > 500) {
            setProductOpinionError(true);
            setProductOpinionErrorMsg('Opinion must be at least 10 and at max 500 characters long');
            isValid = false;
        } else if (!/^[ -~]*$/gm.test(editText)) {
            setProductOpinionError(true);
            setProductOpinionErrorMsg('Opinion can only contain printable characters');
            isValid = false;
        } else {
            setProductOpinionError(false);
            setProductOpinionErrorMsg('');
        }

        return isValid;
    };

    const updateOpinion = (event) => {
        event.preventDefault();
        if (!validateOpinion()) {
            return;
        }
        setOpenBackdrop(true);
        LocalStorageHelper.CommitRefresh();
        axios.get('api/users/csrf/token', {})
            .then((response) => {
                let rating = "";
                if (userRating === 1) {
                    rating = "ONE";
                } else if (userRating === 2) {
                    rating = "TWO";
                } else if (userRating === 3) {
                    rating = "THREE";
                } else if (userRating === 4) {
                    rating = "FOUR";
                } else if (userRating === 5) {
                    rating = "FIVE";
                }
                axios.put(`api/opinions/update/${props.opinion.id}`, {
                    productUuid: props.opinion.productUuid,
                    userId: LocalStorageHelper.GetActiveUser(),
                    username: LocalStorageHelper.getUserName(),
                    rating: rating,
                    comment: editText
                }, {
                    headers: {
                        'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                        'X-XSRF-TOKEN': response.data.token,
                    }
                }).then(() => {
                    setOpenBackdrop(false);
                    handleCloseEdit();
                    toast.success("Opinion updated!", {
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
                    props.onUpdate();
                }).catch((error) => {
                    setOpenBackdrop(false);
                    handleCloseEdit();
                    toast.error(error.response.data.message, {
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
                });
            }).catch(() => {
                setOpenBackdrop(false);
                handleCloseEdit();
                toast.error("Cannot fetch token", {
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
            });
    };

    const deleteOpinion = (event) => {
        event.preventDefault();
        setOpenBackdrop(true);
        LocalStorageHelper.CommitRefresh();
        axios.get('api/users/csrf/token', {})
            .then((response) => {
                axios.delete(`api/opinions/delete/${props.id}`, {
                    headers: {
                        'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                        'X-XSRF-TOKEN': response.data.token,
                    }
                }).then(() => {
                    setOpenBackdrop(false);
                    handleClose();
                    toast.success("Opinion deleted!", {
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
                });
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
    };

    return (
        <OpinionContainer>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            
            <ItemImage>
                <Image alt="No image" src={image} />
            </ItemImage>

            <ProductInfo>
                <Box sx={{ '& > legend': { mt: 2 } }}>
                    <StyledRating
                        name="customized-color"
                        value={generateRating(props.opinion.rating)}
                        getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
                        precision={0.5}
                        icon={<FavoriteIcon fontSize="inherit" />}
                        emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                        readOnly
                        size="small"
                    />
                </Box>
                <Typography variant="body1">{productName}</Typography>
            </ProductInfo>

            <CommentContainer>
                <CommentText sx={{ height: myHeight }}>{props.opinion.comment}</CommentText>
                <ButtonContainer>
                    {myHeight === '36px' && 
                        <ShowMoreButton
                            variant="text"
                            onClick={changeHeight}
                        >
                            Show more
                        </ShowMoreButton>
                    }
                    {myHeight === 'fit-content' && 
                        <ShowMoreButton
                            variant="text"
                            onClick={changeHeight}
                        >
                            Hide
                        </ShowMoreButton>
                    }
                </ButtonContainer>
            </CommentContainer>

            <ActionButtons>
                <EditButton
                    variant="contained"
                    size="small"
                    type="button"
                    fullWidth
                    onClick={handleClickOpenEdit}
                >
                    <EditIcon fontSize="small"/>
                </EditButton>

                <DeleteButton
                    variant="contained"
                    size="small"
                    type="button"
                    onClick={handleClickOpen}
                    fullWidth
                >
                    <DeleteIcon fontSize="small"/>
                </DeleteButton>
            </ActionButtons>

            <Dialog
                open={openEdit}
                onClose={handleCloseEdit}
            >
                <DialogTitle>Edit opinion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Change your opinion
                    </DialogContentText>
                    <Typography variant="body1" sx={{ margin: '16px 0 4px 0' }}>
                        Rate product
                    </Typography>
                    <Box sx={{ '& > legend': { mt: 2 }, marginBottom: '16px' }}>
                        <StyledRating
                            name="customized-color"
                            value={userRating}
                            getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
                            precision={1}
                            onChange={(e, nv) => {
                                setUserRating(nv);
                            }}
                            icon={<FavoriteIcon fontSize="inherit" />}
                            emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                        />
                    </Box>
                    <StyledTextField
                        size="large"
                        id="opinion"
                        label="Your opinion"
                        multiline
                        rows={4}
                        required
                        error={productOpinionError}
                        helperText={productOpinionErrorMsg}
                        color={productOpinionError ? 'error' : 'primary'}
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={handleCloseEdit}
                        sx={{
                            color: theme => theme.palette.mybutton.colorTwo,
                            backgroundColor: 'rgb(11,108,128)',
                            '&:hover': {backgroundColor: 'rgb(16,147,177)'},
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={updateOpinion}
                        sx={{
                            color: theme => theme.palette.mybutton.colorTwo,
                            backgroundColor: 'rgb(255, 189, 3)',
                            '&:hover': {backgroundColor: 'rgb(255,211,51)'}
                        }}
                    >
                        Update
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>Delete opinion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Do you want to delete opinion for product?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={handleClose}
                        sx={{
                            backgroundColor: 'rgb(11,108,128)',
                            '&:hover': {backgroundColor: 'rgb(16,147,177)'},
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={deleteOpinion}
                        sx={{
                            backgroundColor: 'rgb(159,20,20)',
                            '&:hover': {backgroundColor: 'rgb(193,56,56)'},
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </OpinionContainer>
    );
}

export default Opinion;