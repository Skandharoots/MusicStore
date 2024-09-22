import {Button} from "@mui/material";
import {Link} from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {Bounce, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import '../../style/CategoryItem.scss';
import axios from 'axios';
import LocalStorageHelper from "../../../../helpers/LocalStorageHelper.jsx";


function CategoryItem(props) {

    const deleteCategory = (event) => {
        event.preventDefault();
        axios.get('api/users/csrf/token', {})
            .then((response) => {
                axios.delete(`api/products/categories/delete/${props.id}`, {
                    headers: {
                        'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                        'X-XSRF-TOKEN': response.data.token,
                    }
                }).then(() => {
                    toast.success("Category deleted ;)", {
                        position: "bottom-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                        progress: undefined,
                        theme: "colored",
                        transition: Bounce,
                    });
                }).catch((error) => {
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
            }).catch(() => {
            toast.error("Cannot fetch token", {
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
        });
    }

    return (
        <div className="category-item">
            <div className="category-info">
                <p><b>Id: </b>{props.id}</p>
                <p><b>Name: </b>{props.name}</p>
            </div>
            <div className="category-buttons">
                <Button
                    component={Link}
                    to={"/admin/category/update/" + props.id}
                    variant="contained"
                    type="button"
                    fullWidth
                    sx={{
                        width: 'fit-content',
                        margin: '0 0 4px 0',
                        backgroundColor: 'rgb(255, 189, 3)',
                        "&:hover": {backgroundColor: 'rgb(255,211,51)'}
                    }}
                >
                    <EditIcon fontSize="small" />
                </Button>
                <Button
                    variant="contained"
                    type="button"
                    fullWidth
                    onClick={function() {deleteCategory; props.onDelete(props.id)}}
                    sx={{
                        width: 'fit-content',
                        backgroundColor: 'rgb(106,39,39)',
                        "&:hover": {backgroundColor: 'rgb(154,57,57)'}
                    }}
                    >
                    <DeleteIcon fontSize="small" />
                </Button>
            </div>

        </div>
    )

}

export default CategoryItem;