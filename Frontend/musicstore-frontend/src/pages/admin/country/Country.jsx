import '../style/Country.scss';
import {Button} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";
import CountryItem from "./components/CountryItem.jsx";
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";

function Country() {

    const [countries, setCountries] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Country management';
    }, []);

    const redirect = () => {
        navigate('/admin/country/add');
    }

    const removeById = (idToDelete) => {
        setCountries(currentCountries => currentCountries.filter(
            ({id}) => id !== idToDelete)
        );
    };

    useEffect(() => {
        if (LocalStorageHelper.IsUserLogged() === false || LocalStorageHelper.isUserAdmin() === false) {
            navigate('/');
        }
    }, []);

    useEffect(() => {
        axios.get('api/products/countries/get', {})
            .then(res => {
                setCountries(res.data);
            }).catch(() => {
        })
    }, [])

    return (
        <div className="country">
            <div className="page-title">
                <h5>Countries</h5>
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
                    countries.map((country) => (
                        <CountryItem key={country.id} id={country.id} name={country.name} onDelete={removeById} { ...country}/>
                    ))
                }
            </Grid>

        </div>
    )
}

export default Country;