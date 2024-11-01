import './style/MyOrders.scss';
import {useEffect} from "react";
import LocalStorageHelper from "../../helpers/LocalStorageHelper.jsx";
import {useNavigate} from "react-router-dom";

function MyOrders() {

    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'My orders';
    }, []);

    useEffect(() => {
        if (LocalStorageHelper.IsUserLogged() === false) {
            navigate('/');
        }
    }, []);

    return (
        <div className="my-orders">
            <h1>Orders page</h1>
        </div>
    )

}

export default MyOrders;