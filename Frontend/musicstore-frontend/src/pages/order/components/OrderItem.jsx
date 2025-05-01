import {useEffect, useState} from "react";
import axios from "axios";
import {Slide, toast} from "react-toastify";
import Tooltip from "@mui/material/Tooltip";
import {
    FormControl,
    MenuItem,
    Select,
    Box,
    Typography,
    styled,
    useTheme
} from "@mui/material";
import {useNavigate} from "react-router-dom";

const OrderItemContainer = styled(Box)(({ theme }) => ({
    width: '95%',
    minWidth: '500px',
    maxWidth: '600px',
    height: 'fit-content',
    minHeight: '90px',
    boxSizing: 'border-box',
    padding: '2% 2%',
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: '1em',
    marginBottom: '16px',
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
        boxShadow: '0 5px 15px ' + theme.palette.itemShadow.light
    }
}));

const ProductImage = styled(Box)(({ theme }) => ({
    width: '100px',
    height: '85px',
    display: 'flex',
    overflow: 'hidden',
    '& .product-img': {
        width: '100px',
        maxHeight: '100%',
        aspectRatio: '16 / 9',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundSize: 'cover',
        '& img': {
            objectFit: 'cover',
            maxWidth: '100%',
            maxHeight: '100%',
            display: 'block',
            flexShrink: '0',
            flexGrow: '0'
        }
    }
}));

const ProductName = styled(Box)(({ theme }) => ({
    width: '40%',
    height: '90px',
    overflow: 'hidden',
    margin: '0',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    cursor: 'pointer',
    '& p': {
        margin: '0',
        fontSize: '18px'
    }
}));

const ProductQuantity = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0',
    width: 'fit-content',
    height: 'fit-content',
    '& .price': {
        width: '120px',
        '& p': {
            margin: '0 8px 0 0',
            fontSize: '14px'
        }
    }
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
    m: 1,
    margin: '0 0',
    width: 'fit-content',
    height: 'fit-content',
    "& label.Mui-focused": {
        color: 'rgb(39, 99, 24)'
    },
    "& .MuiOutlinedInput-root": {
        "&.Mui-focused fieldset": {
            borderColor: 'rgb(39, 99, 24)'
        }
    }
}));

const StyledSelect = styled(Select)(({ theme }) => ({
    height: '40px'
}));

function OrderItem(props) {
    const theme = useTheme();

    const [img, setImg] = useState(null);
    const [boxShadow, setBoxShadow] = useState('0 5px 15px ' + theme.palette.itemShadow.main);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`api/azure/list?path=${props.item.productSkuId}`, {})
            .then((response) => {
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
                        theme: "light",
                        transition: Slide,
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
                theme: "light",
                transition: Slide,
            })
            }).catch(() => {})
    }, [props.item.productSkuId]);

    useEffect(() => {
        axios.get(`api/products/items/get/${props.item.productSkuId}`)
            .then(res => {
                if (res.data.inStock === 0) {
                    toast.warning(`Product ${props.item.productName} is out of stock.`, {
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
                    props.onOutOfStock();
                    setBoxShadow('0 5px 15px rgba(159, 20, 20, 0.3)');
                }
            }).catch(() => {
            //
        });
    }, [props.item.productSkuId])

    return (
        <OrderItemContainer sx={{ boxShadow: boxShadow }}>
            <ProductImage>
                <Box className="product-img">
                    <img alt={'No image'} src={img} />
                </Box>
            </ProductImage>
            <Tooltip title={`${props.item.productName}`}>
                <ProductName onClick={() => {navigate(`/product/${props.item.productSkuId}/${props.item.productName}`)}}>
                    <Typography>{props.item.productName}</Typography>
                </ProductName>
            </Tooltip>
            <ProductQuantity>
                <Box className="price">
                    <Typography>${props.item.productPrice.toFixed(2)}</Typography>
                </Box>
                <StyledFormControl size="small" autoFocus>
                    <StyledSelect
                        id="quantity-select"
                        disabled={true}
                        value={props.item.quantity}
                        variant="outlined"
                    >
                        <MenuItem key={props.item.id} value={props.item.quantity}>{props.item.quantity}</MenuItem>
                    </StyledSelect>
                </StyledFormControl>
            </ProductQuantity>
        </OrderItemContainer>
    );
}

export default OrderItem;