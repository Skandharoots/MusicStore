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
import Signup from "./pages/signup/Signup.jsx";
import LeftSideAdminRibbon from "./pages/admin/LeftSideAdminRibbon.jsx";
import Category from "./pages/admin/Category.jsx";
import Country from "./pages/admin/Country.jsx";
import Manufacturer from "./pages/admin/Manufacturer.jsx";
import Product from "./pages/admin/Product.jsx";
import Subcategory from "./pages/admin/Subcategory.jsx";

axios.defaults.baseURL = "http://localhost:8222/";
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.headers["Access-Control-Allow-Origin"] = "http://localhost:3000";
axios.defaults.withCredentials = true;

const Dashboard = () => {
    return (
        <>
            <ToastContainer />
            <Navbar />
            <Outlet />
            <Footer />
        </>
    );
};

const DashboardMyAcc = () => {
    return (
        <div className={"my-acc-dash"}>
            <ToastContainer />
            <LeftSideRibbon />
            <Outlet />
        </div>
    )
}

const DashboardAdmin = () => {
    return (
        <div className={"admin-dash"}>
            <ToastContainer />
            <LeftSideAdminRibbon />
            <Outlet />
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
                path: '/',
                element: <DashboardMyAcc />,
                children: [
                    {
                        path: '/account',
                        element: <Account />,
                    },
                    {
                        path: '/myorders',
                        element: <MyOrders />
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
                        path: '/admin/country',
                        element: <Country />,
                    },
                    {
                        path: '/admin/manufacturer',
                        element: <Manufacturer />,
                    },
                    {
                        path: '/admin/product',
                        element: <Product />
                    },
                    {
                        path: '/admin/subcategory',
                        element: <Subcategory />,
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
        </div>
    );
}

export default App
