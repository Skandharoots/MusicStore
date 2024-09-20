import React from 'react';
import './Navbar.scss';
import LocalStorageHelper from "../../helpers/LocalStorageHelper.jsx";
import logo from '../../assets/logo.svg';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import {Link} from "react-router-dom";

function Navbar() {

    const [serach, setSerach] = React.useState('');

    const logoutUser = () => {
        //
    }

    const onSubmitSearch = () => {
        //redirect
    }

    return (
        <header>
            <div className={"top-container"}>
                <Link to="/">
                    <img alt={""} className="logo" src={logo}/>
                </Link>
                <div className={"search-container"}>
                    <form className={"search-form"}>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search products"
                            required
                            pattern="[a-zA-Z0-9][a-zA-Z0-9]*"
                            value={serach}
                            onChange={e => setSerach(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="search-btn"
                            onSubmit={onSubmitSearch}>
                            <SearchOutlinedIcon fontSize={"small"}/>
                        </button>
                    </form>
                </div>
                <div className={"user-info-container"}>
                    <ul>
                        {LocalStorageHelper.IsUserLogged() === true &&
                            <li>
                                <Link to="/account">
                                    <div className={"welcome-text"}>
                                        <p>
                                            Hi,<br/>{LocalStorageHelper.getUserName()}
                                        </p>
                                    </div>
                                    <PersonOutlineOutlinedIcon fontSize={"medium"}/>
                                </Link>
                            </li>
                        }
                        {LocalStorageHelper.IsUserLogged() === false &&
                            <li>
                                <Link to="/login">
                                    <div className={"welcome-text"}>
                                        <p>
                                            Hi,<br/>Login
                                        </p>
                                    </div>
                                    <PersonOutlineOutlinedIcon fontSize={"medium"}/>
                                </Link>
                            </li>
                        }
                        <li>
                            <Link to="/basket">
                                <ShoppingCartOutlinedIcon fontSize={"medium"}/>
                            </Link>
                        </li>

                            <li>
                                <Link to="/admin">
                                    <div className={"admin-text"}>
                                        <p>
                                            Admin<br/>panel
                                        </p>
                                    </div>
                                    <AdminPanelSettingsOutlinedIcon fontSize={"medium"}/>
                                </Link>
                            </li>

                        {LocalStorageHelper.IsUserLogged() === false &&
                            <li>
                                <Link to="/login">
                                <LoginOutlinedIcon fontSize={"medium"}/>
                                </Link>
                            </li>
                        }
                        {LocalStorageHelper.IsUserLogged() === true &&
                            <li>
                                <Link onClick={logoutUser}>
                                    <LogoutOutlinedIcon fontSize={"medium"}/>
                                </Link>
                            </li>
                        }
                    </ul>
                </div>
            </div>
            <nav className="bottom-container">
                <div>
                    <ul>
                        <li><Link to="/">Guitars</Link></li>
                        <li><Link to="/">Drums</Link></li>
                        <li><Link to="/">Sound</Link></li>
                        <li><Link to="/">Microphones</Link></li>
                        <li><Link to="/">Orchestra</Link></li>
                    </ul>
                </div>
            </nav>
        </header>
    );

}

export default Navbar;