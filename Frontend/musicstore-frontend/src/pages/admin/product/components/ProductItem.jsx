import {Button} from "@mui/material";
import {Link} from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LocalStorageHelper from "../../../../helpers/LocalStorageHelper.jsx";
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Grid from "@mui/material/Grid2";
import {useEffect, useState} from "react";
import {Bounce, toast} from "react-toastify";


function ProductItem(props) {

    const [img, setImg] = useState(null);
    const [filePaths, setFilePaths] = useState([]);

    useEffect(() => {
        axios.get(`api/azure/list?path=${props.item.productSkuId}`, {})
            .then((response) => {
                    setFilePaths(response.data);
                    axios.get(`api/azure/read?path=${response.data[0]}`, {responseType: 'blob'})
                        .then(res => {
                            var blob = new Blob([res.data], { type: "image/*" });
                            setImg(URL.createObjectURL(blob));
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
                            })
                    })
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
            })
        })
    }, [])


    const deleteProduct = (event) => {
        event.preventDefault();
        axios.get('api/users/csrf/token', {})
            .then((response) => {
                axios.delete(`api/products/items/delete/${props.item.productSkuId}`, {
                    headers: {
                        'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                        'X-XSRF-TOKEN': response.data.token,
                    }
                }).then(() => {
                    toast.success("Product deleted!", {
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

        axios.get('api/users/csrf/token', {})
            .then((response) => {
                [...filePaths].map((filepath, index) => {
                    axios.delete(`api/azure/delete?path=${filepath}`, {
                        headers: {
                            'Authorization': 'Bearer ' + LocalStorageHelper.getJwtToken(),
                            'X-XSRF-TOKEN': response.data.token,
                        }
                    }).then(() => {
                            toast.success("Product image nr: " + (index + 1) + "deleted", {
                                position: "bottom-center",
                                autoClose: 3000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: false,
                                progress: undefined,
                                theme: "colored",
                                transition: Bounce,
                            })
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
                            })
                        })

                })
            })
    }




    return (
        <Grid sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '240px',
            height: 'fit-content',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            padding: '4px',
            color: 'black',
            fontSize: '12px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s',
            "&:hover": {
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.4)',
            },
        }}
              key={props.item.id}
        >
            <div className="product-img"
                    style={{width: '100%', maxHeight: '200px', aspectRatio: "10 / 6",
                    display: 'flex', justifyContent: 'center', alignItems: 'center'}}>


                <img alt={`${props.item.productName} photo`} height={"200px"} src={img} />
            </div>
            <div className="product-metrics"
                 style={{
                     width: '90%', display: 'block',
                     padding: '2%'
                 }}>
                <p style={{margin: '0', overflow: 'hidden', textWrap: 'nowrap'}}><b>Id: </b>{props.item.id}</p>
                <p style={{margin: '0', overflow: 'hidden'}}><b>Sku Id: </b>{props.item.productSkuId}</p>
                <p style={{margin: '0', overflow: 'hidden', textWrap: 'nowrap'}}><b>Name: </b>{props.item.productName}</p>
                <p style={{margin: '0', overflow: 'hidden', textWrap: 'nowrap'}}><b>Price: </b>{props.item.productPrice}$</p>
                <p style={{margin: '0', overflow: 'hidden', textWrap: 'nowrap'}}><b>In stock: </b>{props.item.inStock}</p>
            </div>
            <div className="product-buttons"
                 style={{
                     width: '100%',
                     display: 'flex',
                     flexDirection: 'row',
                     justifyContent: 'space-between',
                     alignItems: 'flex-start',
                     padding: '0 2%',
                     boxSizing: 'border-box',
                 }}
            >
                <Button
                    component={Link}
                    to={"/admin/manufacturer/update/" + props.id}
                    variant="contained"
                    size="small"
                    type="button"
                    fullWidth
                    sx={{
                        width: 'fit-content',
                        margin: '4px 0',
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
                    onClick={deleteProduct}
                    fullWidth
                    sx={{
                        width: 'fit-content',
                        margin: '4px 0',
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

export default ProductItem;