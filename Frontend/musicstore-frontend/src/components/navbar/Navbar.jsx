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
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import SettingsIcon from '@mui/icons-material/Settings';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';

function Navbar() {


    const [search, setSearch] = React.useState('');
    const [userName, setUserName] = React.useState('');
    const [categories, setCategories] = React.useState([]);
    const [basketCount, setBasketCount] = React.useState(0);
    const [anchorEl, setAnchorEl] = React.useState(null);
    
    const open = Boolean(anchorEl);
    
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const navigate = useNavigate();

    useEffect(() => {
        setUserName(LocalStorageHelper.getUserName());
    }, []);

    window.addEventListener('storage', () => {
        setUserName(LocalStorageHelper.getUserName());
    });

    window.addEventListener('basket', () => {
        setBasketCount(parseInt(LocalStorageHelper.getBasketItems()))
    })

    window.addEventListener('category', () => {
        axios.get('api/products/categories/get')
            .then(res => {
                setCategories(res.data);
            }).catch(() => {})
    })

    useEffect(() => {
        setBasketCount(LocalStorageHelper.getBasketItems().toString());
    }, [])

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
                    <img alt={"Fancy Strings Logo"} className="logo" src={logo}/>
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
                            <SearchOutlinedIcon fontSize={"small"} sx={{color: "white"}}/>
                        </button>
                    </form>
                </div>
                <div className={"user-info-container"}>
                    <ul>
                        { LocalStorageHelper.IsUserLogged() === true &&
                            <li>
                                <div>
                                    <Button
                                        id="basic-button"
                                        aria-controls={open ? 'basic-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                        onClick={handleClick}
                                        endIcon={<PersonOutlineOutlinedIcon
                                            fontSize={"large"}
                                        />}
                                        sx={{
                                            height: '50px',
                                            color: 'black',
                                            backgroundColor: 'white',
                                            borderRadius: '1em',
                                            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            textAlign: 'left',
                                            '&:hover': {
                                                backgroundColor: 'rgba(184, 184, 184, 0.2)'
                                            },
                                        }}
                                    >
                                        <p style={{
                                            maxWidth: '50px',
                                            overflow: 'hidden',
                                        }}>
                                            Hi,<br/>{userName}
                                        </p>
                                    </Button>
                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        slotProps={{
                                            paper: {
                                                    style: {
                                                        borderRadius: '1em',
                                                        width: "180px",
                                                        marginTop: "2px",
                                                        padding: '4px',
                                                        backgroundColor: "white",
                                                    },
                                                },
                                        }}
                                        
                                        MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                        }}
                                    >
                                        <MenuItem onClick={() => {handleClose(); navigate("/account")}}><SettingsIcon/>{'  '} My account</MenuItem>
                                        <MenuItem onClick={() => {handleClose(); navigate("/myorders")}}><AssignmentOutlinedIcon/>{'  '} My orders</MenuItem>
                                    </Menu>
                                </div>
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
                                <Badge badgeContent={basketCount} color="secondary">
                                    <ShoppingCartOutlinedIcon color="aciton" fontSize={"medium"}/>
                                </Badge> 
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