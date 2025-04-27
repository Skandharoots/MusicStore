import './style/Opinions.scss';
import {useEffect, useState} from "react";
import LocalStorageHelper from "../../helpers/LocalStorageHelper.jsx";
import {useNavigate} from "react-router-dom";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import OrderUserItem from "./components/OrderUserItem.jsx";
import axios from "axios";
import {Slide, toast} from "react-toastify";
import {Backdrop, CircularProgress} from "@mui/material";
import Opinion from './components/Opinion.jsx';

const perPage = 20;

function Opinions() {

    const [opinions, setOpinions] = useState([]);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [reload, setReload] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'My opinions';
    }, []);

    useEffect(() => {
        if (LocalStorageHelper.IsUserLogged() === false) {
            navigate('/');
        }
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [currentPage]);

    useEffect(() => {
        setOpenBackdrop(true);
        axios.get(`api/opinions/get/users/${LocalStorageHelper.GetActiveUser()}`, {
            params: {
                page: currentPage - 1,
                pageSize: perPage
            }
        })
        .then(res => {
            setOpinions(res.data.content);
            setTotalPages(res.data.totalPages);
            setOpenBackdrop(false);
        }).catch(() => {
            //
        })
    }, [currentPage, reload]);

    const changePage = (event, value) => {
        setCurrentPage(value);
    }

    const reloadOpinions = () => {
        reload ? setReload(false) : setReload(true);
    }

    const removeById = (idToDelete) => {
        setOpinions(currentOpinions => currentOpinions.filter(
            ({id}) => id !== idToDelete)
        );
        if (totalElements - 1 <= 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="my-opinions">
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
                
                    <Grid container
                          style={{
                              boxSizing: 'border-box',
                              paddingLeft: '16px',
                              paddingBottom: '16px',
                              paddingRight: '16px',
                              paddingTop: '16px',
                          }}
                          rowSpacing={2.7}
                          columnSpacing={2.7}
                    >
                        {
                            [...opinions].map((opinion) => (
                                <Opinion key={opinion.id} id={opinion.id} opinion={opinion} onDelete={removeById} onUpdate={reloadOpinions}/>
                            ))
                        }
                    </Grid>
                    <div
                        style={{
                            display: 'flex',
                            width: '100%',
                            boxSizing: 'border-box',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            padding: '16px 0 16px 0'
                            }}
                    >
                        <Stack spacing={2} sx={{boxSizing: 'border-box',}}>
                            <Pagination page={currentPage} count={totalPages} onChange={changePage} shape={"rounded"}
                                        sx={{
                                            boxSizing: 'border-box',
                                            '& .MuiPaginationItem-rounded': {
                                                outline: 'none !important',
                                                "&:hover": {
                                                    outline: 'none !important',
                                                    backgroundColor: 'rgba(39, 99, 24, 0.2)'
                                                },
                                            },
                                            '& .Mui-selected': {
                                                backgroundColor: 'rgba(39, 99, 24, 0.5) !important',
                                                "&:hover": {
                                                    outline: 'none !important',
                                                    backgroundColor: 'rgba(39, 99, 24, 0.2) !important'
                                                },
                                            }
                                        }}
                            />
                        </Stack>
                    </div>

        </div>
    )

}

export default Opinions;