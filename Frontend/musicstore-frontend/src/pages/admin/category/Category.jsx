import '../style/Category.scss';
import {Button} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {useEffect} from "react";
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";

function Category() {

    const navigate = useNavigate();

    const redirect = () => {
        navigate('/admin/category/add');
    }

    useEffect(() => {
        if (LocalStorageHelper.IsUserLogged() === false || LocalStorageHelper.isUserAdmin() === false) {
            navigate('/');
        }
    }, []);

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
                    fullWidth
                    onClick={redirect}
                    sx={{
                        width: 'fit-content',
                        backgroundColor: 'rgb(39, 99, 24)',
                        "&:hover": {backgroundColor: 'rgb(49,140,23)'}
                    }}
                >
                    Add New
                </Button>
            </div>
        </div>
    )
}

export default Category;