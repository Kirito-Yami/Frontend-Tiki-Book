import React from "react";
import {useCurrentApp} from "components/context/app.context.tsx";
import {Link, useLocation} from "react-router-dom";
import {Button, Result} from "antd";

interface IProps {
    children: React.ReactNode
}

const ProtectedRoute = (props: IProps) => {
    const { isAuthenticated, user } = useCurrentApp();
    const location = useLocation();
    if (!isAuthenticated) {
        return (
            <Result
                status="404"
                title="Not Login"
                subTitle="Bạn vui lòng đăng nhập để sử dụng tính năng này."
                extra={<Button type="primary">
                    <Link to="/login">Đăng nhập</Link>
                </Button>}
            />
        )
    }

    const isAdminRoute = location.pathname.includes("admin");
    if (isAuthenticated && isAdminRoute) {
        const role = user?.role;
        if (role === "USER") {
            return (
                <Result
                    status="403"
                    title="Not Authorized"
                    subTitle="Xin lỗi, bạn không có quyền hạn để truy cập trang này."
                    extra={<Button type="primary">
                        <Link to={"/"}>Back Home</Link>
                    </Button>}
                />
            )
        }
    }

    return (
        <>
            {props.children}
        </>
    )
}

export default ProtectedRoute;