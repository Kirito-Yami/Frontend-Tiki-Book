import AppHeader from "components/layout/app.header.tsx";
import {Outlet} from "react-router-dom";
import {useCurrentApp} from "components/context/app.context.tsx";
import {useEffect} from "react";
import {fetchAccountAPI} from "services/api.ts";

const Layout = () => {
    const { setUser, isAppLoading, setIsAppLoading } = useCurrentApp();
    useEffect(() => {
        const fetchAccount = async () => {
            const res = await fetchAccountAPI();
            if (res.data) {
                setUser(res.data.user)
            }
            setIsAppLoading(false)
        }
        fetchAccount();
    }, [])
    return (
        <div>
            <AppHeader />
            <Outlet />
        </div>
    )
}

export default Layout
