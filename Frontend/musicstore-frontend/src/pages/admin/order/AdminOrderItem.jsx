import {useEffect, useState} from "react";
import axios from "axios";
import {Tooltip, Typography, Box, styled, Button} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {format} from "date-fns";
import {Link} from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";

const OrderItemContainer = styled(Grid)(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    height: 'fit-content',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minWidth: '200px',
    padding: '4px',
    color: theme.palette.text.primary,
    fontSize: '12px',
    borderRadius: '1em',
    boxShadow: '0 5px 15px ' + theme.palette.itemShadow.main,
    boxSizing: 'border-box',
    transition: 'all 0.3s',
    "&:hover": {
        boxShadow: '0 5px 15px ' + theme.palette.itemShadow.light,
    },
}));

const EditButton = styled(Button)(({theme}) => ({
    height: '100px',
    width: '40px',
    minWidth: '0',
    minHeight: '0',
    margin: '0 0 0 4%',
    color: theme.palette.mybutton.colorTwo,
    backgroundColor: 'rgb(255, 189, 3)',
    "&:hover": {
        backgroundColor: 'rgb(255,211,51)'
    }
}));

const OrderDetails = styled(Box)(({theme}) => ({
    width: '40%',
    display: 'block',
    height: '100%',
    padding: '2%',
}));

const OrderText = styled(Typography)(({theme}) => ({
    margin: '0',
    fontSize: '12px',
    fontWeight: 'bold',
    overflow: 'hidden',
    textWrap: 'nowrap',
}));

const OrderStatus = styled(Typography)(({theme, status}) => ({
    margin: '0',
    fontSize: '18px',
    fontWeight: 'bold',
    overflow: 'hidden',
    textWrap: 'nowrap',
    color: status === 'RECEIVED' ? theme.palette.text.primary :
           status === 'SENT' ? 'rgb(20,120,143)' :
           status === 'COMPLETED' ? 'rgb(39,99,24)' :
           status === 'CANCELED' ? 'rgb(218,113,24)' :
           status === 'RETURNED' ? 'rgb(159,20,20)' : theme.palette.text.primary,
}));

const ImageWrapper = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
    width: '50%',
    justifyContent: 'flex-start',
    alignItems: 'center',
}));

const ImageContainer = styled(Box)(({theme}) => ({
    maxWidth: '40%',
    height: '85px',
    aspectRatio: '16 / 9',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    display: "flex",
    overflow: "hidden",
    backgroundColor: 'white',
    borderRadius: '1em',
    marginRight: '16px',
}));

const OrderImage = styled('img')(({theme}) => ({
    objectFit: 'cover',
    maxWidth: '100%',
    maxHeight: '100%',
    display: 'block',
    flexShrink: '0',
    flexGrow: '0',
}));

function AdminOrderItem(props) {
    const [images, setImages] = useState([]);

    useEffect(() => {
        if (props.item.orderItems !== null && props.item.orderItems !== undefined) {
            const promises = [];
            [...props.item.orderItems].map((item) => {
                promises.push(axios.get(`api/azure/read?path=${item.productSkuId}/0`, {responseType: 'blob'}))
            });
            Promise.all(promises.map(p => p.catch(e => e))).then(ordered_array => {
                ordered_array.forEach(result => {
                    let blob = new Blob([result.data], {type: "image/*"});
                    let imgUrl = URL.createObjectURL(blob);
                    setImages(old => [...old, imgUrl]);
                });
            });
        }
    }, []);

    const parseStatus = (status) => {
        let last = status[status.length - 1];
        const statusText = {
            'RECEIVED': 'Received',
            'SENT': 'Sent',
            'COMPLETED': 'Order completed',
            'CANCELED': 'Order canceled',
            'RETURNED': 'Order returned'
        };
        return <OrderStatus status={last}>{statusText[last]}</OrderStatus>;
    };

    return (
        <OrderItemContainer size={12} key={props.item.id}>
            <EditButton
                component={Link}
                to={"/admin/order/update/" + props.item.orderIdentifier}
                variant="contained"
                size="large"
                type="button"
            >
                <EditIcon fontSize="small"/>
            </EditButton>
            
            <OrderDetails>
                {parseStatus(props.item.status)}
                <OrderText>{props.item.name} {props.item.surname}</OrderText>
                <OrderText>{format(props.item.dateCreated, "MMMM do, yyyy")}</OrderText>
                <OrderText>{props.item.totalPrice}$</OrderText>
                <Tooltip title={props.item.orderIdentifier}>
                    <OrderText>
                        <b>nr: </b>{props.item.orderIdentifier}
                    </OrderText>
                </Tooltip>
            </OrderDetails>
            <ImageWrapper>
            {[...images].map((image, index) => (
                    <ImageContainer key={index}>
                        <OrderImage alt={'No image'} src={image} />
                </ImageContainer>
            ))}
            </ImageWrapper>
        </OrderItemContainer>
    );
}

export default AdminOrderItem;