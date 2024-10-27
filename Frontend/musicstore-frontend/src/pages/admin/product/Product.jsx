import '../style/Product.scss';
import {Button} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";
import ProductItem from "./components/ProductItem.jsx";
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";
import {Bounce, toast} from "react-toastify";

function Product() {

    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Product management';
    }, []);

    const redirect = () => {
        navigate('/admin/product/add');
    }

    const removeById = (idToDelete) => {
        setProducts(currentProducts => currentProducts.filter(
            ({id}) => id !== idToDelete)
        );
    };

    useEffect(() => {
        if (LocalStorageHelper.IsUserLogged() === false || LocalStorageHelper.isUserAdmin() === false) {
            navigate('/');
        }
    }, []);

    useEffect(() => {
        axios.get('api/products/items/get', {})
            .then(res => {
                setProducts(res.data);
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
        <div className="manufacturer">
            <div className="page-title">
                <h5>Products</h5>
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
                    // products.map((country) => (
                    //     <ProductItem key={country.id} id={country.id} name={country.name} onDelete={removeById} { ...country}/>
                    // ))
                }
            </Grid>

        </div>
    )
}

export default Product;