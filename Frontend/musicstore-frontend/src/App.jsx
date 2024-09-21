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
                path: '/user',
                element: <DashboardMyAcc />,
                children: [
                    {
                        path: '/user/account',
                        element: <Account />,
                    },
                    {
                        path: '/user/orders',
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
