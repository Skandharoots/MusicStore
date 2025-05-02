import {Backdrop, Button, CircularProgress, Typography, Box} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";
import CategoryItem from "./components/CategoryItem.jsx";
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";
import {Slide, toast} from "react-toastify";
import {styled} from "@mui/material/styles";

const CategoryContainer = styled(Box)(({theme}) => ({
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '80dvh',
    width: '796px',
    borderLeft: `1px solid ${theme.palette.divider}`,
    boxSizing: 'border-box',
}));

const PageTitle = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    color: theme.palette.text.primary,
    fontSize: '20px',
    padding: theme.spacing(0, 2),
    padding: '16px 0 16px 16px  ',
}));

const ActionsContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 'fit-content',
    color: theme.palette.text.primary,
    padding: theme.spacing(0, 2, 1, 2),
    marginBottom: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
}));

const AddCategoryButton = styled(Button)(({theme}) => ({
    width: 'fit-content',
    backgroundColor: 'rgb(39, 99, 24)',
    color: theme.palette.mybutton.colorTwo,
    "&:hover": {
        backgroundColor: 'rgb(49,140,23)'
    },
    marginBottom: theme.spacing(2),
}));

const CategoriesGrid = styled(Grid)(({theme}) => ({
    paddingLeft: '16px',
}));

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
        <CategoryContainer>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            
            <PageTitle>
                <Typography variant="h5">Categories</Typography>
            </PageTitle>
            
            <ActionsContainer>
                <AddCategoryButton
                    variant="contained"
                    type="button"
                    endIcon={<AddIcon fontSize="small" />}
                    fullWidth
                    onClick={redirect}
                >
                    Add
                </AddCategoryButton>
            </ActionsContainer>

            <CategoriesGrid container rowSpacing={2.7} columnSpacing={2.7}>
                {categories.map((category) => (
                    <CategoryItem 
                        key={category.id} 
                        id={category.id} 
                        name={category.name} 
                        onDelete={removeById} 
                        {...category}
                    />
                ))}
            </CategoriesGrid>
        </CategoryContainer>
    );
}

export default Category;