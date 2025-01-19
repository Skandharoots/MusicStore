import './App.scss'
import {
    createBrowserRouter,
    RouterProvider,
    Outlet,
} from "react-router-dom";
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

axios.defaults.baseURL = "https://api.fancystrings.xyz";
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.headers["Access-Control-Allow-Origin"] = "https://fancystrings.xyz";
axios.defaults.withCredentials = true;

const Dashboard = () => {
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
        </>
    );
};

const DashboardMyAcc = () => {
    return (
        <div className={"my-acc-dash"}>
            <div style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "flex-start",
                width: "100%",
                backgroundColor: "white",
            }}>
                <LeftSideRibbon />
                <Outlet />
            </div>
        </div>
    )
}

const DashboardAdmin = () => {
    return (
        <div className={"admin-dash"}>
            <div style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "flex-start",
                width: "100%",
                backgroundColor: "white",
            }}>
                <LeftSideAdminRibbon />
                <Outlet />
            </div>
        </div>
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
                ]
            },
        ]
    }
])

function App() {
    return (
        <div className="App">
            <RouterProvider router={router} />
            <ToastContainer />
        </div>
    );
}

export default App
