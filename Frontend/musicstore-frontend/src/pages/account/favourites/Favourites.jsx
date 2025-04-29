import '../style/Favourites.scss';
import React, {useEffect, useState} from "react";
import axios from "axios";
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";
import {Slide, toast} from "react-toastify";
import FavouriteItem from "./components/FavouriteItem.jsx";
import {Backdrop, CircularProgress} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import {useNavigate} from "react-router-dom";

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
                console.log(res.data.content);
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
        })
    }, [currentPage, perPage]);

    const changePage = (event, value) => {
        setCurrentPage(value);
    }

    const removeById = (idToDelete) => {
        setFavourites(currentItems => currentItems.filter(
            ({id}) => id !== idToDelete)
        );
    };

    return (
        <div className="favourites-container">
            <Backdrop
                sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
                open={openBackdrop}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            <div className="page-title">
                <h5>My favorites</h5>
            </div>
            <Grid container style={{paddingLeft: '16px', paddingBottom: '16px', paddingRight: '16px', borderBottom: '1px solid rgba(0, 0, 0, 0.1)'}} rowSpacing={2.7} columnSpacing={2.7}>
                {
                    favorites.map((fav, index) => (
                        <FavouriteItem key={fav.id} id={index} item={fav} onDelete={removeById} />
                    ))
                }
            </Grid>
            <div  style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', padding: '16px 0 16px 0'}}>
                <Stack spacing={2}>
                    <Pagination page={currentPage} count={totalPages} onChange={changePage} shape={"rounded"}
                                sx={{
                                    '& .MuiPaginationItem-rounded': {
                                        outline: 'none !important',
                                        "&:hover": {outline: 'none !important', backgroundColor: 'rgba(39, 99, 24, 0.2)'},
                                    },
                                    '& .Mui-selected': {
                                        backgroundColor: 'rgba(39, 99, 24, 0.5) !important',
                                        "&:hover": {outline: 'none !important', backgroundColor: 'rgba(39, 99, 24, 0.2) !important'},
                                    }
                                }}
                    />
                </Stack>
            </div>
        </div>
    )
}

export default Favourites;