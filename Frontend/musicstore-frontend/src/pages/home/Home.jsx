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
import {Gallery} from "./components/Gallery.jsx";
import banner from "../../assets/shure_100_years.webp";

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
    marginBottom: '32px',
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
    const [images, setImages] = useState([]);

    const theme = useTheme();

    useEffect(() => {
        document.title = 'Fancy Strings';
    }, []);

    useEffect(() => {
        let imgs = [];
        imgs.push("https://thumbs.static-thomann.de/thumb//txteaser1000--56ff9b8b88b7dcea9b0f8bfcaff252d7/pics/cms/image/teasertool/en/14073/best_of_lighting_equipment.webp?d=ODRDS2RHVml0RU5send1YlB6T0hFZk1abkRXRFlzd0VxSUdLMjZQUi8vVlpNNFppV2lPOGNIbVRoUzZ6aDlSNCswZllhT3ZlY1FNUDNQOUc4eDBKZ2hUNXJhMHpXaHI5QW1UVkM0S2RSUkN2QWQxK2lSV3VpOW5uMjlMUHNPOXlnUnAxdkVBNFpLL3VMTEFoMjBYb1ZxUEsyZE9lRnVrQysraTFuQURobDJmOXk3bEZjY083aXliTlEyQUpZZExjVEUrbG5RQWlXVGF5UnRrSStrR1hNY3k0YmhKa3BXNGJzNEhCTkJyaDdUZWdYdTllWEVPRTJJelJrcVpOTVlxMzIybnBnakltZ3BNNFU3WWlwV2s2NlpaU0hPTVhaM210WWdvT2hqYzdiMDZiYjB5cXNlVEx6czVIRUZvd2pubmtURGtuTFdHK0paZz0%3D");
        imgs.push("https://thumbs.static-thomann.de/thumb//txteaser1000--ae7b16f7d68b76d9d1207677c7fd7e95/pics/cms/image/teasertool/en/14073/shure_100_years.webp?d=OWpURE1BSndueFZJMUlOOHJ5VUhEUE1abkRXRFlzd0VuQVowVEpWazNJR0hZN3pqS0Iya2ZIbVRoUzZ6aDlSNCswZllhT3ZlY1FNUDNQOUc4eDBKZ2hUNXJhMHpXaHI5QW1UVkM0S2RSUkFGU3FHR0hWTlR1ZG5uMjlMUHNPOXlnUnAxdkVBNFpLL3VMTEFoMjBYb1ZxUEsyZE9lRnVrQ0l3Y24rWjhyaXFjY3J5ZVMyLzdleW03UGxrbHNpeUl5YUlaY2tseThVOTIvR1I0bUw0RXhpd2FZQ1F1bXZzM0R3TDdRNDZuTldDOEV4ejVyOHVVNS95TzA5UTBsZWE0WHcvbHVlNXFpVk1xVEFpZWJCQU55WnJBemJvZWdDdkR0VzU0QURrbmFKMWZLTWhxZVo0VFpTSElrM21zd2tRNlg%3D");
        imgs.push("https://thumbs.static-thomann.de/thumb//txteaser1000--8cf6819b7ed5339a6189bfd13baa02c1/pics/cms/image/teasertool/en/14073/best_of_pa_speakers.webp?d=V3E5ZVBpdnVHRCttTjVLTlMwQitmR2d0bGE1WVNzTUVZT1NZMEJZRVNKTHpHWncxZzJMTUJNU1pWSlpQK1JHVXNvbHdLV3o2cHhaNWs0VXVzNGZVZVB0SDJHanIzbkVERDl6L1J2TWRDWUlVK2EydE0xb2EvUUprMVF1Q25VVVFyd0hkZm9rVnJvdlo1OXZTejdEdmNvRWFkYnhBT0dTdjdpeXdJZHRGNkZic1Y4aXRKdDdYN21CMk9kYllrMHhnTitXZXNtMkxCTkc2VkwwL2g4MGp4VlNPa2twZkN5djFWYjJMN0ZSZk02Rm1UNWdaQlJINm02L21CbDVPMEtuWnNnR25wSU5xUjJiL2JYd2VNM3Faa3FpQml0dWowZi8xWVpLcFJSRTM0NmZYQXBLc2FUbW8rNEZLb3lQYXdwWXRBdDFoN1NVQ3VpND0%3D");
        imgs.push("https://thumbs.static-thomann.de/thumb/thumb1000x/pics/cms/image/teasertool/en/14073/synth_days_2025_en.webp");
        setImages(imgs);
    }, [])

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
            <TopBannerContainer>
                <Box
                    sx={{
                        maxWidth: '100%',
                        width: 'fit-content',
                        maxHeight: '300px',
                        aspectRatio: '21/9',
                        flexGrow: 0,
                        flexShrink: 0,
                    }}
                >
                    <Gallery imageBinaries={images} />
                </Box>
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
                                display: 'flex',
                                flexDirection: 'row',
                                flexWrap: 'nowrap',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                width: 'fit-content',
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
                                display: 'flex',
                                flexDirection: 'row',
                                flexWrap: 'nowrap',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                width: 'fit-content',
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