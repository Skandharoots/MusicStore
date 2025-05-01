import {useEffect, useState} from 'react';
import axios from "axios";
import {
    Backdrop,
    CircularProgress,
    Box,
    Paper,
    Typography,
    styled
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import ProductItem from "./components/ProductItem.jsx";
import banner from '../../assets/logo.svg';

const StyledHome = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: '80dvh',
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    boxSizing: 'border-box',
    padding: '32px 0',
}));

const TopBannerContainer = styled(Paper)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: '796px',
    height: 'fit-content',
    borderRadius: '1em',
    boxSizing: 'border-box',
    padding: '2%',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    backgroundColor: theme.palette.background.paper,
}));

const TopBannerHeader = styled(Box)({
    width: '60%',
    height: 'fit-content',
    fontFamily: 'Slab, serif',
    padding: 0,
    margin: 0,
    boxSizing: 'border-box',
});

const Banner = styled(Box)({
    width: '40%',
    maxHeight: '200px',
    aspectRatio: '16 / 9',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundSize: 'cover',
    boxSizing: 'border-box',
});

const HomeWrapper = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: 'fit-content',
    boxSizing: 'border-box',
    marginTop: '32px',
    width: '100%',
});

const NewestSection = styled(Paper)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '796px',
    height: 'fit-content',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    boxSizing: 'border-box',
    borderRadius: '1em',
    padding: '16px',
    backgroundColor: theme.palette.background.paper,
}));

const SectionTitle = styled(Box)({
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
});

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
        <StyledHome>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <TopBannerContainer>
                <TopBannerHeader>
                    <Typography
                        variant="h4"
                        sx={{
                            margin: 0,
                            fontStyle: 'italic',
                            fontWeight: 'normal',
                        }}
                    >
                        Welcome to Fancy Strings!<br />
                        Discover our products and<br />
                        try them out yourself!
                    </Typography>
                </TopBannerHeader>
                <Banner>
                    <Box
                        component="img"
                        alt="Banner"
                        src={banner}
                        sx={{
                            objectFit: 'cover',
                            maxWidth: '100%',
                            maxHeight: '100%',
                            display: 'block',
                            flexShrink: 0,
                            flexGrow: 0,
                        }}
                    />
                </Banner>
            </TopBannerContainer>

            <HomeWrapper>
                <NewestSection>
                    <SectionTitle>
                        <Typography
                            variant="h5"
                            sx={{
                                margin: '0 0 16px 0',
                                fontWeight: 'bold',
                            }}
                        >
                            Newest additions
                        </Typography>
                    </SectionTitle>
                    <Grid
                        container
                        sx={{
                            boxSizing: 'border-box',
                            width: '100%',
                        }}
                        rowSpacing={2.7}
                        columnSpacing={2.7}
                    >
                        {newestProducts.map((product) => (
                            <ProductItem key={product.id} id={product.id} item={product} />
                        ))}
                    </Grid>
                </NewestSection>
            </HomeWrapper>
        </StyledHome>
    );
}

export default Home;