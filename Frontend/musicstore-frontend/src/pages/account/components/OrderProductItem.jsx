import {
    Box,
    styled,
    Tooltip,
    Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import axios from "axios";
import {Slide, toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

const OrderItemContainer = styled(Box)(({theme}) => ({
    width: '100%',
    minWidth: '300px',
    height: 'fit-content',
    minHeight: '90px',
    boxSizing: 'border-box',
    padding: '2% 2%',
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    boxShadow: '0 5px 15px ' + theme.palette.itemShadow.main,
    borderRadius: '1em',
    marginBottom: '16px',
}));

const ItemImage = styled(Box)(({theme}) => ({
    width: '100px',
    maxHeight: '85px',
    aspectRatio: "16 / 9",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundSize: 'cover',
}));

const StyledImage = styled('img')(({theme}) => ({
    objectFit: 'cover',
    maxWidth: '100%',
    maxHeight: '100%',
    display: 'block',
    flexShrink: '0',
    flexGrow: '0',
}));

const ItemDetails = styled(Box)(({theme}) => ({
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    width: '60%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
}));

const ProductName = styled(Typography)(({theme}) => ({
    margin: '0',
    fontSize: '16px',
    overflow: 'hidden',
    cursor: 'pointer',
    '&:hover': {
        color: theme.palette.primary.main,
    },
}));

const ProductInfo = styled(Typography)(({theme}) => ({
    margin: '0 8px 0 0',
    fontSize: '14px',
}));

function OrderProductItem(props) {
    const [img, setImg] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`api/azure/list?path=${props.item.productSkuId}`, {})
            .then((response) => {
                axios.get(`api/azure/read?path=${response.data[0]}`, {responseType: 'blob'})
                    .then(res => {
                        let blob = new Blob([res.data], {type: "image/*"});
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
                    });
                });
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
        });
    }, [props.item]);

    return (
        <OrderItemContainer>
            <ItemImage>
                <StyledImage alt="No image" src={img} />
            </ItemImage>

            <ItemDetails>
                <Tooltip title={props.item.productName}>
                    <ProductName 
                        onClick={() => navigate(`/product/${props.item.productSkuId}/${props.item.productName}`)}
                    >
                        {props.item.productName}
                    </ProductName>
                </Tooltip>
                <ProductInfo>Price: {props.item.unitPrice}$</ProductInfo>
                <ProductInfo>Quantity: {props.item.quantity}</ProductInfo>
            </ItemDetails>
        </OrderItemContainer>
    );
}

export default OrderProductItem;