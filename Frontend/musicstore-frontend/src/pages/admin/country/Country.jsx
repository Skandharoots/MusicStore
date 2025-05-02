import {Backdrop, Button, CircularProgress, Typography, Box, styled} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";
import CountryItem from "./components/CountryItem.jsx";
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";
import {Slide, toast} from "react-toastify";

const CountryContainer = styled(Box)(({theme}) => ({
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '80dvh',
    width: '796px',
    borderLeft: `1px solid ${theme.palette.divider}`,
}));

const PageTitle = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
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

const AddButton = styled(Button)(({theme}) => ({
    width: 'fit-content',
    backgroundColor: 'rgb(39, 99, 24)',
    color: theme.palette.mybutton.colorTwo,
    "&:hover": {
        backgroundColor: 'rgb(49,140,23)'
    },
    marginBottom: theme.spacing(2),
}));

const CountriesGrid = styled(Grid)(({theme}) => ({
    paddingLeft: theme.spacing(2),
}));

function Country() {
    const [countries, setCountries] = useState([]);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Country management';
    }, []);

    useEffect(() => {
        if (LocalStorageHelper.IsUserLogged() === false || LocalStorageHelper.isUserAdmin() === false) {
            navigate('/');
        }
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
        setOpenBackdrop(true);
        axios.get('api/products/countries/get', {})
            .then(res => {
                setCountries(res.data);
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
        <CountryContainer>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            
            <PageTitle>
                <Typography variant="h5">Countries</Typography>
            </PageTitle>
            
            <ActionsContainer>
                <AddButton
                    variant="contained"
                    type="button"
                    endIcon={<AddIcon fontSize="small" />}
                    onClick={redirect}
                >
                    Add
                </AddButton>
            </ActionsContainer>

            <CountriesGrid container rowSpacing={2.7} columnSpacing={2.7}>
                {countries.map((country) => (
                    <CountryItem 
                        key={country.id} 
                        id={country.id} 
                        name={country.name} 
                        onDelete={removeById} 
                        {...country}
                    />
                ))}
            </CountriesGrid>
        </CountryContainer>
    )
}

export default Country;