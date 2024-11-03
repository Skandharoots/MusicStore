import './style/LeftSideRibbon.scss';
import SettingsIcon from '@mui/icons-material/Settings';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import {NavLink} from "react-router-dom";

function LeftSideRibbon() {

    return (
            <div className="left-side">
                <h4>Welcome to<br/>Your account</h4>
                <ul>
                    <li>
                        <NavLink to="/myorders">
                            <AssignmentOutlinedIcon fontSize={"medium"}/>
                            Orders
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/basket">
                            <ShoppingCartOutlinedIcon fontSize={"medium"}/>
                            Basket</NavLink>
                    </li>
                    <li>
                        <NavLink to="/account"><SettingsIcon fontSize={"medium"}/>
                            Account settings
                        </NavLink>
                    </li>
                </ul>
            </div>
    )
}

export default LeftSideRibbon;