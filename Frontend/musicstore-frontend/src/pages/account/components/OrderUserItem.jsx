import Tooltip from "@mui/material/Tooltip";
import {useEffect, useState} from "react";
import Grid from "@mui/material/Grid2";
import axios from "axios";
import { format } from "date-fns";


function OrderUserItem(props) {

    const [images, setImages] = useState([]);

    useEffect(() => {
        if (props.item.orderItems !== null && props.item.orderItems !== undefined) {
            const promises = [];
            [...props.item.orderItems].map((item) => {
                promises.push(axios.get(`api/azure/read?path=${item.productSkuId}/0`, {responseType: 'blob'}))

            })
            Promise.all(promises).then(ordered_array => {
                ordered_array.forEach( result => {
                    let blob = new Blob([result.data], {type: "image/*"});
                    let imgUrl = URL.createObjectURL(blob);
                    setImages(old => [...old, imgUrl]);
                } );
            });
        }
    }, [props.item]);

    const parseStatus = (status) => {

        if (status === 'IN_PROGRESS') {
            return <p style={{
                margin: '0',
                fontSize: '18px',
                fontWeight: 'bold',
                overflow: 'hidden',
                textWrap: 'nowrap',
                color: 'black',
            }}>Received</p>
        } else if (status === 'SENT') {
            return <p style={{
                margin: '0',
                fontSize: '18px',
                fontWeight: 'bold',
                overflow: 'hidden',
                textWrap: 'nowrap',
                color: 'rgb(20,120,143)'
            }}>Sent</p>
        } else if (status === 'COMPLETED') {
            return <p style={{
                margin: '0',
                fontSize: '18px',
                fontWeight: 'bold',
                overflow: 'hidden',
                textWrap: 'nowrap',
                color: 'rgb(39,99,24)'
            }}>Completed</p>
        } else if (status === 'CANCELLED') {
            return <p style={{
                margin: '0',
                fontSize: '18px',
                fontWeight: 'bold',
                overflow: 'hidden',
                textWrap: 'nowrap',
                color: 'rgb(218,113,24)'
            }}>Cancelled</p>
        } else if (status === 'FAILED') {
            return <p style={{
                margin: '0',
                fontSize: '18px',
                fontWeight: 'bold',
                overflow: 'hidden',
                textWrap: 'nowrap',
                color: 'rgb(159,20,20)'
            }}>Order failed</p>
        }
    }

    return (
        <Grid
            size={12}
            sx={{
                display: 'flex',
                flexDirection: 'row',
                height: 'fit-content',
                alignItems: 'center',
                justifyContent: 'flex-start',
                minWidth: '760px',
                padding: '4px',
                color: 'black',
                fontSize: '12px',
                borderRadius: '1em',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                boxSizing: 'border-box',
                transition: 'all 0.3s',
                "&:hover": {
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.4)',
                },
            }}
            key={props.item.id}
        >
            <div className="order-details"
                 style={{
                     width: '400px', display: 'block',
                     padding: '2%',
                 }}>
                {parseStatus(props.item.status)}
                <p style={{
                    margin: '0',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    overflow: 'hidden',
                    textWrap: 'nowrap'
                }}>{format(props.item.dateCreated, "MMMM do, yyyy H:mma")}</p>
                <p style={{
                    margin: '0',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    overflow: 'hidden',
                    textWrap: 'nowrap'
                }}>{props.item.totalPrice}$</p>
                <Tooltip title={props.item.orderIdentifier}>
                    <p style={{margin: '0', overflow: 'hidden', fontSize: '12px'}}><b>nr: </b>{props.item.orderIdentifier}</p>
                </Tooltip>
            </div>
            {
                [...images].map((image, index) => (
                    <div
                        className="order-item-img"
                        key={index}
                        style={{
                            maxHeight: '70px', aspectRatio: "10 / 6",
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            backgroundSize: 'cover',
                        }}
                    >
                        <img alt={'Order item photo'} src={image}
                             style={{
                                 objectFit: 'cover',
                                 maxWidth: '100%',
                                 maxHeight: '100%',
                                 display: 'block',
                                 flexShrink: '0',
                                 flexGrow: '0',
                             }}
                        />
                    </div>
                ))
            }

        </Grid>
    )
}

export default OrderUserItem;