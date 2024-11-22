import '../style/Manufacturer.scss';
import {Button} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";
import ManufacturerItem from "./components/ManufacturerItem.jsx";
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";
import {Slide, toast} from "react-toastify";

function Manufacturer() {

    const [manufacturers, setManufacturers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Manufacturer management';
    }, []);

    useEffect(() => {
        if (LocalStorageHelper.IsUserLogged() === false || LocalStorageHelper.isUserAdmin() === false) {
            navigate('/');
        }
    }, []);

    const redirect = () => {
        navigate('/admin/manufacturer/add');
    }

    const removeById = (idToDelete) => {
        setManufacturers(currentManufacturers => currentManufacturers.filter(
            ({id}) => id !== idToDelete)
        );
    };

    useEffect(() => {
        if (LocalStorageHelper.IsUserLogged() === false || LocalStorageHelper.isUserAdmin() === false) {
            navigate('/');
        }
    }, []);

    useEffect(() => {
        axios.get('api/products/manufacturers/get', {})
            .then(res => {
                setManufacturers(res.data);
            }).catch(error => {
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
        <div className="manufacturer">
            <div className="page-title">
                <h5>Manufacturers</h5>
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
                    manufacturers.map((country) => (
                        <ManufacturerItem key={country.id} id={country.id} name={country.name} onDelete={removeById} { ...country}/>
                    ))
                }
            </Grid>

        </div>
    )
}

export default Manufacturer;