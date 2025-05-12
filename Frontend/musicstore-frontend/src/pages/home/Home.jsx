import {useEffect, useState} from 'react';
import axios from "axios";
import {
    Backdrop,
    CircularProgress,
    Box,
    Paper,
    Typography,
    styled, useTheme
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import ProductItem from "./components/ProductItem.jsx";

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
    maxWidth: '816px',
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

const HomeWrapper = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
    width: '816px',
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

const TopBoughtSection = styled(Paper)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '816px',
    height: 'fit-content',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    boxSizing: 'border-box',
    borderRadius: '1em',
    padding: '16px',
    marginTop: '32px',
    backgroundColor: theme.palette.background.paper,
}));

function Home() {
    const [newestProducts, setNewestProducts] = useState([]);
    const [topBouthProducts, setTopBouthProducts] = useState([]);
    const [openBackdrop, setOpenBackdrop] = useState(false);

    const theme = useTheme();

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

    useEffect(() => {
        setOpenBackdrop(true);
        axios.get('api/products/items/get/bought_count/top?page=0&pageSize=8', {})
        .then(res => {
            setTopBouthProducts(res.data.content);
            setOpenBackdrop(false);
        }).catch(() => {
            setOpenBackdrop(false);
        });

    }, []);

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
                        variant="h5"
                        sx={{
                            margin: 0,
                            fontStyle: 'italic',
                            fontWeight: 'normal',
                            textAlign: 'center',
                        }}
                    >
                        Welcome to Fancy Strings!<br/>Discover our products or try them out yourself in our store.
                    </Typography>
                </TopBannerHeader>
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
                    <Box
                        sx={{
                            width: '100%',
                            height: '360px',
                            padding: '8px',
                            overflow: 'hidden',
                            overflowX: 'auto',
                            scrollbarColor: theme.palette.irish.main + ' ' + theme.palette.background.paper,
                            '&::-webkit-scrollbar': {
                                width: '5px !important',
                            },
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: theme.palette.background.paper + ' !important',
                                borderRadius: '180px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: theme.palette.irish.main + ' !important',
                                borderRadius: '180px !important',
                            }
                        }}
                    >
                        <Grid
                            container
                            sx={{
                                boxSizing: 'border-box',
                                width: '2072px',
                                height: '340px',

                            }}
                            columnSpacing={2.7}
                        >
                            {newestProducts.map((product) => (
                                <ProductItem key={product.id} id={product.id} item={product} />
                            ))}
                        </Grid>
                    </Box>
                </NewestSection>
                <TopBoughtSection>
                    <SectionTitle>
                        <Typography
                            variant="h5"
                            sx={{
                                margin: '0 0 16px 0',
                                fontWeight: 'bold',
                            }}
                        >
                            Top picks
                        </Typography>
                    </SectionTitle>
                    <Box
                        sx={{
                            width: '100%',
                            height: '360px',
                            padding: '8px',
                            overflow: 'hidden',
                            overflowX: 'auto',
                            scrollbarColor: theme.palette.irish.main + ' ' + theme.palette.background.paper,
                            '&::-webkit-scrollbar': {
                                width: '5px !important',
                            },
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: theme.palette.background.paper + ' !important',
                                borderRadius: '180px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: theme.palette.irish.main + ' !important',
                                borderRadius: '180px !important',
                            }
                        }}
                    >
                        <Grid
                            container
                            sx={{
                                boxSizing: 'border-box',
                                width: '2072px',
                                height: '340px',
                            }}
                            rowSpacing={2.7}
                            columnSpacing={2.7}
                        >
                            {topBouthProducts.map((product) => (
                                <ProductItem key={product.id + 1000} id={product.id + 1000} item={product} />
                            ))}
                        </Grid>
                    </Box>
                </TopBoughtSection>
            </HomeWrapper>
        </StyledHome>
    );
}

export default Home;