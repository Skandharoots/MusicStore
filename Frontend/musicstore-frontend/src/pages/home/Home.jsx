import {useEffect, useState} from 'react';
import './style/Home.scss';
import axios from "axios";
import {Backdrop, CircularProgress} from "@mui/material";
import ProductItem from "./components/ProductItem.jsx";
import Grid from "@mui/material/Grid2";
import banner from '../../assets/logo.svg';

function Home() {

    const [newestProducts, setNewestProducts] = useState([]);
    const [openBackdrop, setOpenBackdrop] = useState(false);

    useEffect(() => {
        document.title = 'Fancy Strings';
    }, []);

    useEffect(() => {
        setOpenBackdrop(true);
        axios.get('api/products/items/get?page=0&pageSize=8', {})
        .then(res => {
            setNewestProducts(res.data.content);
            setOpenBackdrop(false);
        }).catch(() => {
            setOpenBackdrop(false);
        });

    }, [])

    return (
        <div className="Home">
            <Backdrop
                sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
                open={openBackdrop}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            <div className="top-banner-container">
                <div className="top-banner-header">
                    <p style={{
                        margin: '0',
                        fontSize: '40px',
                        fontWeight: 'normal',
                        fontStyle: 'italic',
                    }}
                    >
                        Welcome to Fancy Strings!<br/>
                        Discover our products and<br/>
                        try them out yourself!
                    </p>
                </div>
                <div className="banner">
                    <img alt="Banner"
                         src={banner}
                         style={{
                             objectFit: 'cover',
                             maxWidth: '100%',
                             maxHeight: '100%',
                             display: 'block',
                             flexShrink: '0',
                             flexGrow: '0',
                         }}
                    />
                </div>
            </div>
            <div className="home-wrapper">
                <div className="newest">
                    <div style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start'
                    }}>
                        <p style={{margin: '0 0 16px 0', fontSize: '24px', fontWeight: 'bold'}}>Newest additions</p>
                    </div>
                    <Grid container
                          style={{
                              boxSizing: 'border-box',
                              width: '100%',
                          }}
                          rowSpacing={2.7}
                          columnSpacing={2.7}
                    >
                        {
                            [...newestProducts].map((product) => (
                                <ProductItem key={product.id} id={product.id} item={product}/>
                            ))
                        }
                    </Grid>
                </div>
                <div className="categories-grid">

                </div>
            </div>
        </div>
    );
}

export default Home;