import '../style/Category.scss';
import {Backdrop, Button, CircularProgress} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";
import CategoryItem from "./components/CategoryItem.jsx";
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";
import {Slide, toast} from "react-toastify";

function Category() {

    const [categories, setCategories] = useState([]);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Category management';
    }, []);

    useEffect(() => {
        if (LocalStorageHelper.IsUserLogged() === false || LocalStorageHelper.isUserAdmin() === false) {
            navigate('/');
        }
    }, []);

    const redirect = () => {
        navigate('/admin/category/add');
    }

    const removeById = (idToDelete) => {
        setCategories(currentCategories => currentCategories.filter(
            ({id}) => id !== idToDelete)
        );
    };

    useEffect(() => {
        if (LocalStorageHelper.IsUserLogged() === false || LocalStorageHelper.isUserAdmin() === false) {
            navigate('/');
        }
    }, []);

    useEffect(() => {
        setOpenBackdrop(true);
        axios.get('api/products/categories/get', {})
            .then(res => {
                setCategories(res.data);
                setOpenBackdrop(false);
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
    }, [])

    return (
        <div className="category">
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className="page-title">
                <h5>Categories</h5>
            </div>
            <div className="actions">
                <Button
                    className="add-button"
                    variant="contained"
                    type="button"
                    endIcon={<AddIcon fontSize="small" />}
                    fullWidth
                    onClick={redirect}
                    sx={{
                        width: 'fit-content',
                        backgroundColor: 'rgb(39, 99, 24)',
                        "&:hover": {backgroundColor: 'rgb(49,140,23)'},
                        marginBottom: '16px',
                    }}
                >
                    Add
                </Button>
            </div>

            <Grid container style={{paddingLeft: '16px'}} rowSpacing={2.7} columnSpacing={2.7}>
                {
                    categories.map((category) => (
                        <CategoryItem key={category.id} id={category.id} name={category.name} onDelete={removeById} { ...category}/>
                    ))
                }
            </Grid>
        </div>
    )
}

export default Category;