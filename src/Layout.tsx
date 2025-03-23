import AppHeader from "components/layout/app.header.tsx";
import {Outlet} from "react-router-dom";
import {useState} from "react";

const Layout = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    return (
        <div>
            <AppHeader
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />
            <Outlet context={[searchTerm, setSearchTerm]}/>
        </div>
    )
}

export default Layout;
