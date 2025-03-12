import AppHeader from "components/layout/header.tsx";
import {Outlet} from "react-router-dom";

const Layout = () => {
    return (
        <div>
            <AppHeader />
            <Outlet />
        </div>
    )
}

export default Layout
