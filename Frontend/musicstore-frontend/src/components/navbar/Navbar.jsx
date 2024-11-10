import React, {useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import './style/Navbar.scss';
import LocalStorageHelper from "../../helpers/LocalStorageHelper.jsx";
import logo from '../../assets/logo.svg';
import Tooltip from '@mui/material/Tooltip';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import {NavLink} from "react-router-dom";
import axios from "axios";

function Navbar() {


    const [search, setSearch] = React.useState('');
    const [userName, setUserName] = React.useState('');
    const [categories, setCategories] = React.useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        setUserName(LocalStorageHelper.getUserName());
    });

    useEffect(() => {
        axios.get('api/products/categories/get')
            .then(res => {
                setCategories(res.data);
            }).catch(() => {})
    }, []);

    const logoutUser = () => {
        LocalStorageHelper.LogoutUser();
        navigate('/');
    }

    const onSubmitSearch = () => {
        navigate(`/products/search/${search}`)
    }

    return (
        <header>
            <div className={"top-container"}>
                <NavLink to="/">
                    <img alt={""} className="logo" src={logo}/>
                </NavLink>
                <div className={"search-container"}>
                    <form className={"search-form"}>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search products"
                            required
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="search-btn"
                            onClick={onSubmitSearch}>
                            <SearchOutlinedIcon fontSize={"small"}/>
                        </button>
                    </form>
                </div>
                <div className={"user-info-container"}>
                    <ul>
                        { LocalStorageHelper.IsUserLogged() === true &&
                            <li>
                                <Tooltip title={"My account"}>
                                    <NavLink to="/account">
                                        <div className={"welcome-text"}>
                                            <p>
                                                Hi,<br/>{userName}
                                            </p>
                                        </div>
                                        <PersonOutlineOutlinedIcon
                                            fontSize={"medium"}
                                        />
                                    </NavLink>
                                </Tooltip>
                            </li>
                        }
                        { LocalStorageHelper.IsUserLogged() === false &&
                            <li>
                                <Tooltip title={"Login"}>
                                    <NavLink to="/login">
                                        <div className={"welcome-text"}>
                                            <p>
                                                Hi!<br/>Log in
                                            </p>
                                        </div>
                                        <PersonOutlineOutlinedIcon fontSize={"medium"}/>
                                    </NavLink>
                                </Tooltip>
                            </li>
                        }
                        <li>
                            <Tooltip title={"Basket"}>
                                <NavLink to="/basket">
                                    <ShoppingCartOutlinedIcon fontSize={"medium"}/>
                                </NavLink>
                            </Tooltip>
                        </li>
                        {LocalStorageHelper.isUserAdmin() === true &&
                            <li>
                                <Tooltip title={"Admin panel"}>
                                    <NavLink to="/admin/category">
                                        <div className={"admin-text"}>
                                            <p>
                                                Admin<br/>panel
                                            </p>
                                        </div>
                                        <AdminPanelSettingsOutlinedIcon fontSize={"medium"}/>
                                    </NavLink>
                                </Tooltip>
                            </li>
                        }
                        { LocalStorageHelper.IsUserLogged() === false &&
                            <li>
                                <Tooltip title={"Login"}>
                                    <NavLink to="/login">
                                        <LoginOutlinedIcon fontSize={"medium"}/>
                                    </NavLink>
                                </Tooltip>
                            </li>
                        }
                        { LocalStorageHelper.IsUserLogged() === true &&
                            <li>
                                <Tooltip title={"Logout"}>
                                    <NavLink onClick={logoutUser}>
                                        <LogoutOutlinedIcon fontSize={"medium"}/>
                                    </NavLink>
                                </Tooltip>
                            </li>
                        }
                    </ul>
                </div>
            </div>
            <nav className="bottom-container">
                <div>
                    <ul>
                        {
                            [...categories].map((cat, index) => (
                                <li key={index}><NavLink to={`/products/${cat.id}/${cat.name}`}>{cat.name}</NavLink></li>
                            ))
                        }
                    </ul>
                </div>
            </nav>
        </header>
    );

}

export default Navbar;