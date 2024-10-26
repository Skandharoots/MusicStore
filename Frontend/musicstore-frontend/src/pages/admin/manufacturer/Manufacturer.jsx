import '../style/Manufacturer.scss';
import {Button} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";
import ManufacturerItem from "./components/ManufacturerItem.jsx";
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";

function Manufacturer() {

    const [manufacturers, setManufacturers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Manufacturer management';
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
            }).catch(() => {
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
                    Add New
                </Button>
            </div>

            <Grid container style={{marginRight: '20%', marginLeft: '16px'}} rowSpacing={2} columnSpacing={2}>
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