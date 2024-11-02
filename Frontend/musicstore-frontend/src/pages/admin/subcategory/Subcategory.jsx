import '../style/Subcategory.scss';
import {Button} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";
import SubcategoryItem from "./components/SubcategoryItem.jsx";
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";
import {Bounce, toast} from "react-toastify";

function Subcategory() {

    const [subcategories, setSubcategories] = useState([]);
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
        axios.get('api/products/subcategories/get', {})
            .then(res => {
                setSubcategories(res.data);
            }).catch(error => {
            toast.error(error.response.data.message, {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
        })
    }, [])

    return (
        <div className="subcategory">
            <div className="page-title">
                <h5>Subcategories</h5>
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

            <Grid container style={{marginRight: '20%', marginLeft: '16px'}} rowSpacing={2} columnSpacing={2}>
                {
                    subcategories.map((subcategory) => (
                        <SubcategoryItem key={subcategory.id} subcategory={subcategory} onDelete={removeById} { ...subcategory}/>
                    ))
                }
            </Grid>

        </div>
    )
}

export default Subcategory;