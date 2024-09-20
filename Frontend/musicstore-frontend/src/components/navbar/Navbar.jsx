import React from 'react';
import './Navbar.scss';
import LocalStorageHelper from "../../helpers/LocalStorageHelper.jsx";
import logo from '../../assets/logo.svg';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

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
                <a href="/">
                    <img alt={""} className="logo" src={logo}/>
                </a>
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
                        { LocalStorageHelper.IsUserLogged() === true &&
                            <li>
                                <a href="/account">
                                    <div className={"welcome-text"}>
                                            <p>
                                                Hi,<br/>{LocalStorageHelper.getUserName()}
                                            </p>
                                    </div>
                                    <PersonOutlineOutlinedIcon fontSize={"medium"}/>
                                </a>
                            </li>
                        }
                        { LocalStorageHelper.IsUserLogged() === false &&
                            <li>
                                <a href="/login">
                                    <div className={"welcome-text"}>
                                        <p>
                                            Hi,<br/>Login
                                        </p>
                                    </div>
                                    <PersonOutlineOutlinedIcon fontSize={"medium"}/>
                                </a>
                            </li>
                        }
                        <li>
                            <a href="/basket">
                                <ShoppingCartOutlinedIcon fontSize={"medium"}/>
                            </a>
                        </li>
                        { LocalStorageHelper.IsUserLogged() === false &&
                            <li>
                                <a href="/login">
                                    <LoginOutlinedIcon fontSize={"medium"}/>
                                </a>
                            </li>
                        }
                        { LocalStorageHelper.IsUserLogged() === true &&
                            <li>
                                <a onClick={logoutUser}>
                                    <LogoutOutlinedIcon fontSize={"medium"}/>
                                </a>
                            </li>
                        }
                    </ul>
                </div>
            </div>
            <nav className="bottom-container">
                <div>
                    <ul>
                        <li><a href="/">Guitars</a></li>
                        <li><a href="/">Drums</a></li>
                        <li><a href="/">Sound</a></li>
                        <li><a href="/">Microphones</a></li>
                        <li><a href="/">Orchestra</a></li>
                    </ul>
                </div>
            </nav>
        </header>
    );

}

export default Navbar;