import {useEffect, useState} from "react";
import axios from "axios";
import {Slide, toast} from "react-toastify";
import {Box, Tooltip, Typography, styled} from "@mui/material";

const OrderItemContainer = styled(Box)(({theme}) => ({
    height: 'fit-content',
    minHeight: '90px',
    minWidth: '100px',
    padding: '2% 2%',
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    boxShadow: '0 5px 15px ' + theme.palette.itemShadow.main,
    borderRadius: '1em',
    marginBottom: theme.spacing(2),
    width: '100%',
    boxSizing: 'border-box',
    color: theme.palette.text.primary,
}));

const ItemImageContainer = styled(Box)(({theme}) => ({
    maxWidth: '40%',
    maxHeight: '85px',
    aspectRatio: '16 / 9',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundSize: 'cover',
}));

const ItemImage = styled('img')(({theme}) => ({
    objectFit: 'cover',
    maxWidth: '100%',
    maxHeight: '100%',
    display: 'block',
    flexShrink: '0',
    flexGrow: '0',
}));

const ItemDetailsContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    maxWidth: '60%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    boxSizing: 'border-box',
}));

const ItemText = styled(Typography)(({theme}) => ({
    margin: '0',
    fontSize: '16px',
    maxWidth: '100%',
    overflow: 'hidden',
    textWrap: 'nowrap',
}));

const ItemDetailText = styled(Typography)(({theme}) => ({
    margin: '0 8px 0 0',
    fontSize: '14px',
    maxWidth: '100%',
    overflow: 'hidden',
    textWrap: 'nowrap',
}));

function AdminOrderProductItem(props) {
    const [img, setImg] = useState(null);

    useEffect(() => {
        axios.get(`api/azure/list?path=${props.item.productSkuId}`, {})
            .then((response) => {
                axios.get(`api/azure/read?path=${response.data[0]}`, {responseType: 'blob'})
                    .then(res => {
                        let blob = new Blob([res.data], { type: "image/*" });
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
        });
    }, [props.item])

    return (
        <OrderItemContainer>
            <ItemImageContainer>
                <ItemImage alt={'No image'} src={img} />
            </ItemImageContainer>
            
            <ItemDetailsContainer>
                <Tooltip title={`${props.item.productName}`}>
                    <ItemText>{props.item.productName}</ItemText>
                </Tooltip>
                <ItemDetailText>Price: {props.item.unitPrice}$</ItemDetailText>
                <ItemDetailText>Quantity: {props.item.quantity}</ItemDetailText>
            </ItemDetailsContainer>
        </OrderItemContainer>
    )
}

export default AdminOrderProductItem;