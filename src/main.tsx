import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import Layout from './Layout.tsx';
import BookPage from "pages/client/book.tsx";
import AboutPage from "pages/client/about.tsx";
import LoginPage from "pages/client/auth/login.tsx";
import RegisterPage from "pages/client/auth/register.tsx";
import HomePage from "pages/client/home.tsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {App, ConfigProvider} from "antd";
import {AppProvider} from "components/context/app.context.tsx";
import ProtectedRoute from "components/auth";
import LayoutAdmin from "components/layout/layout.admin.tsx";
import DashBoardPage from "pages/admin/dashboard.tsx";
import ManageBookPage from "pages/admin/manage.book.tsx";
import ManageOrderPage from "pages/admin/manage.order.tsx";
import ManageUserPage from "pages/admin/manage.user.tsx";
import enUS from 'antd/locale/en_US';
import OrderPage from "pages/client/order.tsx";
import HistoryPage from "pages/client/history.tsx";
import ReturnURLPage from "components/client/order/return.url.tsx";
import 'styles/global.scss';
import {GoogleOAuthProvider} from "@react-oauth/google";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout/>,
        children: [
            {
                index: true,
                element: <HomePage/>
            },
            {
                path: "/book/:id",
                element: <BookPage/>,
            },
            {
                path: "/order",
                element: (
                    <ProtectedRoute>
                        <OrderPage/>
                    </ProtectedRoute>
                )
            },
            {
                path: "/vnpay/return-url",
                element: (
                    <ProtectedRoute>
                        <ReturnURLPage/>
                    </ProtectedRoute>
                )
            },
            {
                path: "about",
                element: <AboutPage/>,
            },
            {
                path: "history",
                element: (
                    <ProtectedRoute>
                        <HistoryPage/>
                    </ProtectedRoute>
                ),
            }
        ]
    },
    {
        path: "admin",
        element: <LayoutAdmin/>,
        children: [
            {
                index: true,
                element: (
                    <ProtectedRoute>
                        <DashBoardPage/>
                    </ProtectedRoute>
                )
            },
            {
                path: "book",
                element: (
                    <ProtectedRoute>
                        <ManageBookPage/>
                    </ProtectedRoute>
                )
            },
            {
                path: "order",
                element: (
                    <ProtectedRoute>
                        <ManageOrderPage/>
                    </ProtectedRoute>
                )
            },
            {
                path: "user",
                element: (
                    <ProtectedRoute>
                        <ManageUserPage/>
                    </ProtectedRoute>
                ),
            }
        ]
    },
    {
        path: "/login",
        element: <LoginPage/>,
    },
    {
        path: "/register",
        element: <RegisterPage/>,
    },

]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App>
            <AppProvider>
                <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                    <ConfigProvider locale={enUS}>
                        <RouterProvider router={router}/>
                    </ConfigProvider>
                </GoogleOAuthProvider>
            </AppProvider>
        </App>
    </StrictMode>
);
