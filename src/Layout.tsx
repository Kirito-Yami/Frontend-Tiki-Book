import AppHeader from "components/layout/app.header.tsx";
import {Outlet} from "react-router-dom";
import {useCurrentApp} from "components/context/app.context.tsx";
import {useEffect} from "react";
import {fetchAccountAPI} from "services/api.ts";
import {PacmanLoader} from "react-spinners";

const Layout = () => {
    const {setUser, isAppLoading, setIsAppLoading, setIsAuthenticated} = useCurrentApp();
    useEffect(() => {
        const fetchAccount = async () => {
            const res = await fetchAccountAPI();
            if (res.data) {
                setUser(res.data.user);
                setIsAuthenticated(true);
            }
            setIsAppLoading(false)
        }
        fetchAccount();
    }, [])
    return (
        <>
            {!isAppLoading ?
                <div>
                    <AppHeader/>
                    <Outlet/>
                </div>
                :
                <div style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)"
                }}>
                    <PacmanLoader
                        size={30}
                        color="#36d6b4"
                    />
                </div>
            }
        </>
    )
}

export default Layout;
