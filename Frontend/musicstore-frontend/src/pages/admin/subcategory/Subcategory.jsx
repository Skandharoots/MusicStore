import {Backdrop, Button, CircularProgress, Typography, styled} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";
import SubcategoryItem from "./components/SubcategoryItem.jsx";
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";
import {Slide, toast} from "react-toastify";

const SubcategoryContainer = styled('div')(({theme}) => ({
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '80dvh',
    width: '796px',
    borderLeft: '1px solid ' + theme.palette.divider,
}));

const PageTitle = styled('div')(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
    alignItems: 'center',
    color: 'black',
    fontSize: '20px',
    padding: '0 16px',
    padding: '16px 0 16px 16px',
    color: theme.palette.text.primary,

}));

const ActionsContainer = styled('div')(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 'fit-content',
    color: 'black',
    padding: '0 16px 8px 16px',
    marginBottom: '16px',
    borderBottom: '1px solid ' + theme.palette.divider,
}));

const AddButton = styled(Button)(({theme}) => ({
    width: 'fit-content',
    backgroundColor: theme.palette.irish.main,
    color: theme.palette.mybutton.colorTwo,
    "&:hover": {backgroundColor: theme.palette.irish.light},
    marginBottom: '16px',
}));

const SubcategoriesGrid = styled(Grid)(({theme}) => ({
    paddingLeft: '16px',
}));

function Subcategory() {
    const [subcategories, setSubcategories] = useState([]);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Subcategory management';
    }, []);

    const redirect = () => {
        navigate('/admin/subcategory/add');
    }

    const removeById = (idToDelete) => {
        setSubcategories(currentSubcategories => currentSubcategories.filter(
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
        axios.get('api/products/subcategories/get', {})
            .then(res => {
                setSubcategories(res.data);
                setOpenBackdrop(false);
            }).catch(error => {
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
    }, [])

    return (
        <SubcategoryContainer>
            <Backdrop
                sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
                open={openBackdrop}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>

            <PageTitle>
                <Typography variant="h5">Subcategories</Typography>
            </PageTitle>

            <ActionsContainer>
                <AddButton
                    variant="contained"
                    type="button"
                    endIcon={<AddIcon fontSize="small"/>}
                    fullWidth
                    onClick={redirect}
                >
                    Add
                </AddButton>
            </ActionsContainer>

            <SubcategoriesGrid container rowSpacing={2.7} columnSpacing={2.7}>
                {subcategories.map((subcategory) => (
                    <SubcategoryItem
                        key={subcategory.id}
                        subcategory={subcategory}
                        onDelete={removeById}
                        {...subcategory}
                    />
                ))}
            </SubcategoriesGrid>
        </SubcategoryContainer>
    );
}

export default Subcategory;