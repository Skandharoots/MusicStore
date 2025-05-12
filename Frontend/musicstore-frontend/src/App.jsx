import './App.scss'
import {
    createBrowserRouter,
    RouterProvider,
    Outlet,
} from "react-router-dom";
import {useState} from "react";
import Navbar from './components/navbar/Navbar.jsx';
import Footer from './components/footer/Footer.jsx';
import Home from './pages/home/Home.jsx';
import LeftSideRibbon from "./pages/account/LeftSideRibbon.jsx";
import Account from "./pages/account/Account.jsx";
import MyOrders from "./pages/account/MyOrders.jsx";
import Login from "./pages/login/Login.jsx";
import axios from "axios";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Signup from "./pages/signup/Signup.jsx";
import LeftSideAdminRibbon from "./pages/admin/LeftSideAdminRibbon.jsx";
import Category from "./pages/admin/category/Category.jsx";
import Country from "./pages/admin/country/Country.jsx";
import Manufacturer from "./pages/admin/manufacturer/Manufacturer.jsx";
import Product from "./pages/admin/product/Product.jsx";
import Subcategory from "./pages/admin/subcategory/Subcategory.jsx";
import Order from "./pages/admin/order/Order.jsx";
import AddCategory from "./pages/admin/category/AddCategory.jsx";
import UpdateCategory from "./pages/admin/category/UpdateCategory.jsx";
import UpdateCountry from "./pages/admin/country/UpdateCountry.jsx";
import AddCountry from "./pages/admin/country/AddCountry.jsx";
import UpdateManufacturer from "./pages/admin/manufacturer/UpdateManufacturer.jsx";
import AddManufacturer from "./pages/admin/manufacturer/AddManufacturer.jsx";
import AddSubcategory from "./pages/admin/subcategory/AddSubcategory.jsx";
import UpdateSubcategory from "./pages/admin/subcategory/UpdateSubcategory.jsx";
import AddProduct from "./pages/admin/product/AddProduct.jsx";
import UpdateProduct from "./pages/admin/product/UpdateProduct.jsx";
import SignupConfirm from "./pages/signup/SignupConfirm.jsx";
import ProductsPage from "./pages/products/ProductsPage.jsx";
import ProductDetailsPage from "./pages/products/ProductDetailsPage.jsx";
import Basket from "./pages/basket/Basket.jsx";
import OrderPage from "./pages/order/OrderPage.jsx";
import UpdateOrder from "./pages/admin/order/UpdateOrder.jsx";
import MyOrderPage from "./pages/account/MyOrderPage.jsx";
import ProductsSearchPage from "./pages/products/ProductsSearchPage.jsx";
import PasswordResetRequest from './pages/password/PasswordResetRequest.jsx';
import PasswordResetLanding from './pages/password/PasswordResetLanding.jsx';
import Opinions from './pages/account/Opinions.jsx';
import Favourites from './pages/account/favourites/Favourites.jsx';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Paper, Box } from '@mui/material';
import AddSubcategoryTierTwo from "./pages/admin/subcategoryTierTwo/AddSubcategoryTierTwo.jsx";
import SubcategoryTierTwo from "./pages/admin/subcategoryTierTwo/SubcategoryTierTwo.jsx";
import UpdateSubcategoryTierTwo from "./pages/admin/subcategoryTierTwo/UpdateSubcategoryTierTwo.jsx";



axios.defaults.baseURL = "http://localhost:8222/";
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.headers["Access-Control-Allow-Origin"] = "http://localhost:4000";
axios.defaults.withCredentials = true;


const Dashboard = () => {
    return (
        <Paper>
            <Navbar />
            <Outlet />
            <Footer />
        </Paper>
    );
};

const DashboardMyAcc = () => {
    return (
        <Paper className={"my-acc-dash"}>
            <Box style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "flex-start",
                width: "100%",
            }}>
                <LeftSideRibbon />
                <Outlet />
            </Box>
        </Paper>
    )
}

const DashboardAdmin = () => {
    return (
        <Paper className={"admin-dash"}>
            <Box style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "flex-start",
                width: "100%",
            }}>
                <LeftSideAdminRibbon />
                <Outlet />
            </Box>
        </Paper>
    )
}


const router = createBrowserRouter([
    {
        path: '/',
        element: <Dashboard />,
        children: [
            {
                path: '/',
                element: <Home />,
            },
            {
                path: '/login',
                element: <Login />,
            },
            {
                path: '/password',
                element: <PasswordResetRequest/>
            },
            {
                path: '/password/reset/:token',
                element: <PasswordResetLanding/>
            },
            {
                path: '/signup',
                element: <Signup />,
            },
            {
                path: '/signup/confirm/:token',
                element: <SignupConfirm />,
            },
            {
                path: '/products/:categoryId/:name',
                element: <ProductsPage />,
            },
            {
                path: '/product/:productSkuId/:productName',
                element: <ProductDetailsPage />,
            },
            {
                path: '/products/search/:searchPhrase',
                element: <ProductsSearchPage />
            },
            {
                path: '/basket',
                element: <Basket />
            },
            {
                path: '/order/place',
                element: <OrderPage />
            },
            {
                path: '/',
                element: <DashboardMyAcc />,
                children: [
                    {
                        path: '/account',
                        element: <Account />,
                    },
                    {
                        path: '/myorders',
                        element: <MyOrders />,
                    },
                    {
                        path: '/myorders/:orderId',
                        element: <MyOrderPage />
                    },
                    {
                        path: '/myratings',
                        element: <Opinions/>
                    },
                    {
                        path: '/favourites',
                        element: <Favourites/>
                    }
                ]
            },
            {
                path: '/admin',
                element: <DashboardAdmin />,
                children: [
                    {
                        path: '/admin/category',
                        element: <Category />,
                    },
                    {
                        path: '/admin/category/add',
                        element: <AddCategory />,
                    },
                    {
                        path: '/admin/category/update/:id',
                        element: <UpdateCategory />,
                    },
                    {
                        path: '/admin/country',
                        element: <Country />,
                    },
                    {
                        path: '/admin/country/add',
                        element: <AddCountry />,
                    },
                    {
                        path: '/admin/country/update/:id',
                        element: <UpdateCountry />,
                    },
                    {
                        path: '/admin/manufacturer',
                        element: <Manufacturer />,
                    },
                    {
                        path: '/admin/manufacturer/add',
                        element: <AddManufacturer />,
                    },
                    {
                        path: '/admin/manufacturer/update/:id',
                        element: <UpdateManufacturer />,
                    },
                    {
                        path: '/admin/order',
                        element: <Order />,
                    },
                    {
                        path: '/admin/order/update/:orderIdentifier',
                        element: <UpdateOrder />,
                    },
                    {
                        path: '/admin/product',
                        element: <Product />,
                    },
                    {
                        path: '/admin/product/add',
                        element: <AddProduct />,
                    },
                    {
                        path: '/admin/product/update/:skuId',
                        element: <UpdateProduct />,
                    },
                    {
                        path: '/admin/subcategory',
                        element: <Subcategory />,
                    },
                    {
                        path: '/admin/subcategory/add',
                        element: <AddSubcategory />,
                    },
                    {
                        path: '/admin/subcategory/update/:id',
                        element: <UpdateSubcategory />,
                    },
                    {
                        path: '/admin/subcategory_tier_two',
                        element: <SubcategoryTierTwo />,
                    },
                    {
                        path: '/admin/subcategory_tier_two/add',
                        element: <AddSubcategoryTierTwo />,
                    },
                    {
                        path: '/admin/subcategory_tier_two/update/:id',
                        element: <UpdateSubcategoryTierTwo />,
                    },
                ]
            },
        ]
    }
])



function App() {

    const [darkTheme, setDarkTheme] = useState(localStorage.getItem('theme') === 'dark');

    const theme = createTheme({
        palette: {
            mode: darkTheme ? 'dark' : 'light',
            background: {
                default: darkTheme ? 'rgb(35, 35, 35)' : 'rgb(255, 255, 255)',
                paper: darkTheme ? 'rgb(35, 35, 35)' : 'rgb(255, 255, 255)',
                box: darkTheme ? 'rgb(35, 35, 35)' : 'rgb(255, 255, 255)',

            },
            mybutton: {
                colorOne: darkTheme ? 'white' : 'black',
                colorTwo: 'white',
            },
            irish: {
                main: 'rgb(39, 99, 24)',
                light: 'rgb(61, 147, 40)',
                dark: 'rgb(39, 99, 24)',
                contrastText: 'rgb(255, 255, 255)',
            },
            editBtn: {
                main: 'rgb(255, 189, 3)',
                light: 'rgb(255,211,51)',
            },
            errorBtn: {
                main: 'rgb(159,20,20)',
                light: 'rgb(193,56,56)',
            },
            blueBtn: {
                main: 'rgb(11,108,128)',
                light: 'rgb(16,147,177)',
            },
            downloadBtn: {
                main: 'rgb(117,31,131)',
                light: 'rgb(174,68,189)',
            },
            account: {
                main: 'rgb(0, 0, 0)',
                dark: 'rgb(255, 255, 255)',
                light: 'rgb(0, 0, 0)',
            },
            shadowLink: {
                main: 'rgba(184, 184, 184, 0.2)',
                light: 'rgba(184, 184, 184, 0.2)',
                dark: 'rgba(255, 255, 255, 0.4)',
            },
            shadow: {
                main: 'rgba(184, 184, 184, 0.2)',
                light: 'rgba(184, 184, 184, 0.4)',
                dark: 'rgba(255, 255, 255, 0.2)',
            },
            itemShadow: {
                main: darkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.1)',
                light: darkTheme ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.4)',
            },
            formShadow: {
                main: darkTheme ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.1)',
            },
        },
        components: {
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        backgroundColor: darkTheme ? '#1e1e1e' : '#ffffff',
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundColor: darkTheme ? '#1e1e1e' : '#ffffff',
                    },
                },
            },
            MuiLink: {
                styleOverrides: {
                    root: {
                        textDecoration: 'none',
                        color: 'inherit',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        minWidth: '50px',
                        width: 'fit-content',
                        padding: '0 5px',
                        height: '50px',
                        '&:hover': {
                            borderRadius: '1em',
                            color: 'inherit',
                        },
                    },
                },
            },
            MuiTypography: {
                styleOverrides: {
                    root: {
                        color: 'inherit'
                    },
                },
            },
            MuiAlert: {
                styleOverrides: {
                    root: {
                        color: darkTheme ? 'white' : 'black',
                    },
                },
            },
        }
    });
      
      window.addEventListener('theme', () => {
        localStorage.getItem('theme') === 'dark' ? setDarkTheme(true) : setDarkTheme(false);
      });

    return (
        <div className="App">
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <RouterProvider router={router} />
                <ToastContainer />
            </ThemeProvider>
        </div>
    );
}

export default App
