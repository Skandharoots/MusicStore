import {NavLink} from "react-router-dom";
import './style/LeftSideAdminRibbon.scss';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import TurnedInNotOutlinedIcon from '@mui/icons-material/TurnedInNotOutlined';
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";


function LeftSideAdminRibbon() {

    return (
            <div className="left-side-admin">
                <h4>Welcome to<br/>Admin panel</h4>
                <ul>
                    <li>
                        <NavLink to="/admin/category">
                            <CategoryOutlinedIcon fontSize={"medium"}/>
                            Categories
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/country">
                            <LanguageOutlinedIcon fontSize={"medium"}/>
                            Countries</NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/manufacturer">
                            <WarehouseOutlinedIcon fontSize={"medium"}/>
                            Manufacturers
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/order">
                            <AssignmentOutlinedIcon fontSize={"medium"}/>
                            Orders
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/product">
                            <Inventory2OutlinedIcon fontSize={"medium"}/>
                            Products
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/subcategory">
                            <TurnedInNotOutlinedIcon fontSize={"medium"}/>
                            Subcategories
                        </NavLink>
                    </li>
                </ul>
            </div>
    )

}

export default LeftSideAdminRibbon;