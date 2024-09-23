import './style/MyOrders.scss';
import {useEffect} from "react";

function MyOrders() {

    useEffect(() => {
        document.title = 'My orders';
    }, []);

    return (
        <div className="my-orders">
            <h1>Orders page</h1>
        </div>
    )

}

export default MyOrders;