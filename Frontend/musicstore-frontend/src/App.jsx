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

axios.defaults.baseURL = "http://localhost:8222/";
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.headers["Access-Control-Allow-Origin"] = "http://localhost:3000";
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
            <LeftSideRibbon />
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
            }
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
