import React, {useState} from "react";
import {useCurrentApp} from "components/context/app.context.tsx";
import {logoutAPI} from "services/api.ts";
import {Link, Outlet} from "react-router-dom";
import {
    AppstoreOutlined,
    DollarCircleOutlined,
    ExceptionOutlined, HeartTwoTone, MenuFoldOutlined,
    MenuUnfoldOutlined,
    TeamOutlined
} from "@ant-design/icons";
import {Avatar, Dropdown, Layout, Menu, MenuProps, Space} from "antd";

type MenuItem = Required<MenuProps>['items'][number];

const {Content, Footer, Sider} = Layout;

const LayoutAdmin = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const {user, setUser, setIsAuthenticated, isAuthenticated} = useCurrentApp();

    const handleLogout = async () => {
        const res = await logoutAPI();
        if (res.data) {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem("access_token");
        }
    }

    const items: MenuItem[] = [
        {
            label: <Link to='/admin'>Dashboard</Link>,
            key: 'dashboard',
            icon: <AppstoreOutlined/>
        },
        {
            label: <Link to='/admin/user'>Manage User</Link>,
            key: 'user',
            icon: <TeamOutlined/>,
        },
        {
            label: <Link to='/admin/book'>Manage Books</Link>,
            key: 'book',
            icon: <ExceptionOutlined/>
        },
        {
            label: <Link to='/admin/order'>Manage Orders</Link>,
            key: 'order',
            icon: <DollarCircleOutlined/>
        },

    ];

    const itemsDropdown = [
        {
            label: <label
                style={{cursor: 'pointer'}}
                onClick={() => alert("me")}
            >Quản lý tài khoản</label>,
            key: 'account',
        },
        {
            label: <Link to={'/'}>Trang chủ</Link>,
            key: 'home',
        },
        {
            label: <label
                style={{cursor: 'pointer'}}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'logout',
        },

    ];
    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`;
    if (!isAuthenticated) {
        return (
            <Outlet/>
        )
    }
    const isAdminRoute = location.pathname.includes("admin");
    if (isAuthenticated && isAdminRoute) {
        const role = user?.role;
        if (role === "USER") {
            return (
                <Outlet/>
            )
        }
    }
    return (
        <>
            <Layout
                style={{minHeight: '100vh'}}
                className="layout-admin"
            >
                <Sider
                    theme='light'
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}>
                    <div style={{height: 32, margin: 16, textAlign: 'center'}}>
                        Admin
                    </div>
                    <Menu
                        defaultSelectedKeys={[activeMenu]}
                        mode="inline"
                        items={items}
                        onClick={(e) => setActiveMenu(e.key)}
                    />
                </Sider>
                <Layout>
                    <div className='admin-header' style={{
                        height: "50px",
                        borderBottom: "1px solid #ebebeb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0 15px",

                    }}>
                         <span>
                             {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                 className: 'trigger',
                                 onClick: () => setCollapsed(!collapsed),
                             })}
                         </span>
                        <Dropdown menu={{items: itemsDropdown}} trigger={['click']}>
                            <Space style={{cursor: "pointer"}}>
                                <Avatar src={urlAvatar}/>
                                {user?.fullName}
                            </Space>
                        </Dropdown>
                    </div>
                    <Content style={{padding: '15px'}}>
                        <Outlet/>
                    </Content>
                    <Footer style={{padding: 0, textAlign: "center"}}>
                        Tiki Book &copy; Kirito Nguyễn - Made with <HeartTwoTone/>
                    </Footer>
                </Layout>
            </Layout>
        </>
    );
}

export default LayoutAdmin;