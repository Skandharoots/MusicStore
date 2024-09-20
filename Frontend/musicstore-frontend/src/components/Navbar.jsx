import React from 'react';

function Navbar() {

    return (
        <header className="navbar">
            <nav className="nav">
                <div className="top-container">
                    <b>Top content</b>
                </div>
                <div className="bottom-container">
                    <ul>
                        <li>Guitars</li>
                        <li>Drums</li>
                        <li>Sound</li>
                        <li>Microphones</li>
                        <li>Orchestra</li>
                    </ul>
                </div>
            </nav>
        </header>
    );

}

export default Navbar;