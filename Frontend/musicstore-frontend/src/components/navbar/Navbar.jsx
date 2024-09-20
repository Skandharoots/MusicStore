import React from 'react';
import './Navbar.scss'
import logo from '../../assets/logo.svg';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

function Navbar() {

    const [serach, setSerach] = React.useState('');

    const onSubmitSearch = () => {
        //redirect
    }

    return (
        <header>
            <div className={"top-container"}>
                <a href="/">
                    <img className="logo" src={logo} />
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
                            <SearchOutlinedIcon fontSize={"small"} />
                        </button>
                    </form>
                </div>
                <div className={"user-info-container"}>
                    <ul>
                        <li>
                            <div className={"welcome-text"}>
                                <p>
                                    Welcome<br/>User
                                </p>
                            </div>
                            <PersonOutlineOutlinedIcon fontSize={"medium"} />
                        </li>
                        <li><ShoppingCartOutlinedIcon fontSize={"medium"} /></li>
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