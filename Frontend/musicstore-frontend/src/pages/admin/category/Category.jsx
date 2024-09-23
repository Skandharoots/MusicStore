import '../style/Category.scss';
import {Box, Button} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";
import CategoryItem from "./components/CategoryItem.jsx";
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";

function Category() {

    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Category management';
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
        axios.get('api/products/categories/get', {})
            .then(res => {
                setCategories(res.data);
            }).catch(() => {
        })
    }, [])

    return (
        <div className="category">
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
                    Add New
                </Button>
            </div>
            <Box sx={{ flexGrow: 1, margin: '0 20% 0 0', padding: '8px 0 8px 16px' }}>
                <Grid container spacing={0} sx={{padding: '0'}}>
                    {
                        categories.map((category) => (
                            <Grid size={2.6} key={category.id}>
                                <CategoryItem id={category.id} name={category.name} onDelete={removeById} { ...category}/>
                            </Grid>
                        ))
                    }
                </Grid>
            </Box>
        </div>
    )
}

export default Category;