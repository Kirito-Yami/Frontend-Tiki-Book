import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import Layout from './Layout.tsx';
import BookPage from "pages/client/book.tsx";
import AboutPage from "pages/client/about.tsx";
import LoginPage from "pages/client/auth/login.tsx";
import RegisterPage from "pages/client/auth/register.tsx";
import HomePage from "pages/client/home.tsx";
import 'styles/global.scss';
import {createBrowserRouter, RouterProvider} from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "book",
                element: <BookPage />,
            },
            {
                path: "about",
                element: <AboutPage />,
            },
        ],
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />,
    },
]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
