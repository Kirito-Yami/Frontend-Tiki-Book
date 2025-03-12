import AppHeader from "components/layout/app.header.tsx";
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
