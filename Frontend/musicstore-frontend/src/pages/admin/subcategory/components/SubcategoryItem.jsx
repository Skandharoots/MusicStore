import {Button} from "@mui/material";
import {Link} from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {Bounce, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import LocalStorageHelper from "../../../../helpers/LocalStorageHelper.jsx";
import Grid from "@mui/material/Grid2";


function SubcategoryItem(props) {

    const deleteSubcategory = (event) => {
        event.preventDefault();
        axios.get('api/users/csrf/token', {})
            .then((response) => {
                axios.delete(`api/products/subcategories/delete/${props.id}`, {
                    headers: {
                        'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                        'X-XSRF-TOKEN': response.data.token,
                    }
                }).then(() => {
                    toast.success("Subcategory deleted!", {
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
                    props.onDelete(props.id);
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
        <Grid sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '200px',
            height: '70px',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            color: 'black',
            fontSize: '12px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s',
            "&:hover": {
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.4)',
            },
        }}
              key={props.id}
        >
            <div className="subcategory-metrics"
                 style={{
                     width: '60%', display: 'block',
                     padding: '2%'
                 }}>
                <p style={{margin: '0', overflow: 'hidden', textWrap: 'nowrap'}}><b>Id: </b>{props.id}</p>
                <p style={{margin: '0', overflow: 'hidden', textWrap: 'nowrap'}}><b>Name: </b>{props.name}</p>
                <p style={{margin: '0', overflow: 'hidden', textWrap: 'nowrap'}}><b>Category: </b>{props.category}</p>

            </div>
            <div className="subcategory-buttons"
                 style={{
                     height: '100%',
                     marginRight: '0',
                     display: 'flex',
                     flexDirection: 'column',
                     justifyContent: 'space-between',
                     alignItems: 'flex-start',
                     padding: '2% 0',
                     boxSizing: 'border-box',
                 }}
            >
                <Button
                    component={Link}
                    to={"/admin/subcategory/update/" + props.id}
                    variant="contained"
                    size="small"
                    type="button"
                    sx={{
                        width: 'fit-content',
                        backgroundColor: 'rgb(255, 189, 3)',
                        "&:hover": {backgroundColor: 'rgb(255,211,51)'}
                    }}
                >
                    <EditIcon fontSize="small" />
                </Button>
                <Button
                    variant="contained"
                    size="small"
                    type="button"
                    onClick={deleteSubcategory}
                    sx={{
                        width: 'fit-content',
                        backgroundColor: 'rgb(159,20,20)',
                        "&:hover": {backgroundColor: 'rgb(193,56,56)'},
                    }}
                >
                    <DeleteIcon fontSize="small" />
                </Button>
            </div>

        </Grid>
    )

}

export default SubcategoryItem;