import '../style/Favourites.scss';
import React, {useEffect, useState} from "react";
import axios from "axios";
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";
import {Slide, toast} from "react-toastify";
import FavouriteItem from "./components/FavouriteItem.jsx";
import {
    Backdrop,
    Box,
    CircularProgress,
    Grid,
    Pagination,
    Stack,
    styled,
    Typography
} from "@mui/material";
import {useNavigate} from "react-router-dom";

const FavouritesContainer = styled(Box)(({theme}) => ({
    height: 'fit-content',
    minHeight: '80dvh',
    maxWidth: '780px',
    width: '100%',
    color: theme.palette.text.primary,
    borderLeft: `1px solid ${theme.palette.divider}`,
}));

const PageTitle = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
    alignItems: 'center',
    color: theme.palette.text.primary,
    fontSize: '20px',
    padding: '0 16px',
    borderBottom: `1px solid ${theme.palette.divider}`,
    marginBottom: '16px',
}));

const FavouritesGrid = styled(Grid)(({theme}) => ({
    padding: '16px',
    borderBottom: `1px solid ${theme.palette.divider}`,
    rowSpacing: 2.7,
    columnSpacing: 2.7,
}));

const PaginationContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: '16px 0',
}));

const StyledPagination = styled(Pagination)(({theme}) => ({
    '& .MuiPaginationItem-rounded': {
        outline: 'none !important',
        '&:hover': {
            outline: 'none !important',
            backgroundColor: theme.palette.primary.light + '33',
        },
    },
    '& .Mui-selected': {
        backgroundColor: theme.palette.primary.main + '80 !important',
        '&:hover': {
            outline: 'none !important',
            backgroundColor: theme.palette.primary.light + '33 !important',
        },
    },
}));

function Favourites() {
    const [favorites, setFavourites] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [openBackdrop, setOpenBackdrop] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (LocalStorageHelper.IsUserLogged() === false) {
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        setOpenBackdrop(true);
        axios.get(`api/favorites/get/${LocalStorageHelper.GetActiveUser()}`, {
            params: {
                page: currentPage - 1,
                pageSize: perPage,
            }
        }).then((res) => {
            setOpenBackdrop(false);
            setTotalPages(res.data.totalPages);
            setFavourites(res.data.content);
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
            });
        });
    }, [currentPage, perPage]);

    const changePage = (event, value) => {
        setCurrentPage(value);
    };

    const removeById = (idToDelete) => {
        setFavourites(currentItems => currentItems.filter(
            ({id}) => id !== idToDelete)
        );
    };

    return (
        <FavouritesContainer>
            <Backdrop
                sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
                open={openBackdrop}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>

            <PageTitle>
                <Typography variant="h5">My favorites</Typography>
            </PageTitle>

            <FavouritesGrid container>
                {favorites.map((fav, index) => (
                    <FavouriteItem key={fav.id} id={index} item={fav} onDelete={removeById} />
                ))}
            </FavouritesGrid>

            <PaginationContainer>
                <Stack spacing={2}>
                    <StyledPagination 
                        page={currentPage} 
                        count={totalPages} 
                        onChange={changePage} 
                        shape="rounded"
                    />
                </Stack>
            </PaginationContainer>
        </FavouritesContainer>
    );
}

export default Favourites;