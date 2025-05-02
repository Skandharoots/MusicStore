import {
    Box,
    styled,
    Tooltip,
    Typography
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {useEffect, useState} from "react";
import axios from "axios";
import {format} from "date-fns";
import {useNavigate} from "react-router-dom";

const OrderItemContainer = styled(Grid)(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    height: 'fit-content',
    minWidth: '100px',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '4px',
    color: theme.palette.text.primary,
    fontSize: '12px',
    borderRadius: '1em',
    boxShadow: '0 5px 15px ' + theme.palette.itemShadow.main,
    boxSizing: 'border-box',
    '&:hover': {
        boxShadow: '0 5px 15px ' + theme.palette.itemShadow.light,
        cursor: 'pointer',
    },
}));

const OrderDetails = styled(Box)(({theme}) => ({
    width: '50%',
    display: 'block',
    padding: '2%',
}));

const StatusText = styled(Typography)(({theme, status}) => ({
    margin: '0',
    fontSize: '18px',
    fontWeight: 'bold',
    overflow: 'hidden',
    textWrap: 'nowrap',
    color: status === 'RECEIVED' ? theme.palette.text.primary :
           status === 'SENT' ? theme.palette.info.main :
           status === 'COMPLETED' ? theme.palette.success.main :
           status === 'CANCELED' ? theme.palette.warning.main :
           status === 'RETURNED' ? theme.palette.error.main : theme.palette.text.primary,
}));

const DateText = styled(Typography)(({theme}) => ({
    margin: '0',
    fontSize: '12px',
    fontWeight: 'bold',
    overflow: 'hidden',
    textWrap: 'nowrap',
}));

const PriceText = styled(Typography)(({theme}) => ({
    margin: '0',
    fontSize: '12px',
    fontWeight: 'bold',
    overflow: 'hidden',
    textWrap: 'nowrap',
}));

const OrderIdText = styled(Typography)(({theme}) => ({
    margin: '0',
    overflow: 'hidden',
    fontSize: '12px',
}));

const ImagesContainer = styled(Box)(({theme}) => ({
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

const StyledImage = styled('img')(({theme}) => ({
    objectFit: 'cover',
    maxWidth: '100%',
    maxHeight: '100%',
    display: 'block',
    flexShrink: '0',
    flexGrow: '0',
}));

function OrderUserItem(props) {
    const [images, setImages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (props.item.orderItems !== null && props.item.orderItems !== undefined) {
            const promises = [];
            [...props.item.orderItems].map((item) => {
                promises.push(axios.get(`api/azure/read?path=${item.productSkuId}/0`, {responseType: 'blob'}));
            });
            Promise.all(promises.map(p => p.catch(e => e))).then(ordered_array => {
                ordered_array.forEach(result => {
                    let blob = new Blob([result.data], {type: "image/*"});
                    let imgUrl = URL.createObjectURL(blob);
                    setImages(old => [...old, imgUrl]);
                });
            });
        }
    }, [props.item]);

    const parseStatus = (status) => {
        const lastStatus = status[status.length - 1];
        return (
            <StatusText status={lastStatus}>
                {lastStatus === 'RECEIVED' ? 'Received' :
                 lastStatus === 'SENT' ? 'Sent' :
                 lastStatus === 'COMPLETED' ? 'Completed' :
                 lastStatus === 'CANCELED' ? 'Canceled' :
                 lastStatus === 'RETURNED' ? 'Order returned' : lastStatus}
            </StatusText>
        );
    };

    return (
        <OrderItemContainer
            size={12}
            key={props.item.id}
            onClick={() => navigate(`/myorders/${props.item.orderIdentifier}`)}
        >
            <OrderDetails>
                {parseStatus(props.item.status)}
                <DateText>
                    {format(props.item.dateCreated, "MMMM do, yyyy")}
                </DateText>
                <PriceText>
                    {props.item.totalPrice}$
                </PriceText>
                <Tooltip title={props.item.orderIdentifier}>
                    <OrderIdText>
                        <b>nr: </b>{props.item.orderIdentifier}
                    </OrderIdText>
                </Tooltip>
            </OrderDetails>

            <ImagesContainer>
                {images.map((image, index) => (
                    <ImageContainer key={index}>
                        <StyledImage alt="No image" src={image} />
                    </ImageContainer>
                ))}
            </ImagesContainer>
        </OrderItemContainer>
    );
}

export default OrderUserItem;