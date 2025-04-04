import {useCurrentApp} from "components/context/app.context.tsx";
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {logoutAPI} from "services/api.ts";
import {VscSearchFuzzy} from "react-icons/vsc";
import {Avatar, Badge, Divider, Drawer, Dropdown, Empty, Popover, Space} from "antd";
import {FiShoppingCart} from "react-icons/fi";
import {FaReact} from "react-icons/fa";
import ManageAccount from "components/client/account/manage.account.tsx";
import {isMobile} from 'react-device-detect';
import 'styles/app.header.scss';

interface IProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
}

const AppHeader = (props: IProps) => {
    const {searchTerm, setSearchTerm} = props;

    const {user, setUser, isAuthenticated, setIsAuthenticated, carts, setCarts} = useCurrentApp();

    const [openDrawer, setOpenDrawer] = useState(false);

    const [openManageAccount, setOpenManageAccount] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleLogout = async () => {
        const res = await logoutAPI();
        if (res.data) {
            setUser(null);
            setCarts([]);
            setIsAuthenticated(false);
            localStorage.removeItem("access_token");
            localStorage.removeItem('carts');
        }
    }

    const items = [
        {
            label: <label
                style={{cursor: 'pointer'}}
                onClick={() => setOpenManageAccount(true)}
            >Quản lý tài khoản</label>,
            key: 'account',
        },
        {
            label: <Link to="/history">Lịch sử mua hàng</Link>,
            key: 'history',
        },
        {
            label: <label
                style={{cursor: 'pointer'}}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'logout',
        },

    ];

    if (user?.role === 'ADMIN') {
        items.unshift({
            label: <Link to='/admin'>Trang quản trị</Link>,
            key: 'admin',
        })
    }

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`;

    const contentPopover = () => {
        return (
            <div className='pop-cart-body'>
                <div className='pop-cart-content'>
                    {carts?.map((book, index) => {
                        return (
                            <div className='book' key={`book-${index}`}>
                                <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book?.detail?.thumbnail}`}
                                     alt={book?.detail?.thumbnail}/>
                                <div>{book?.detail?.mainText}</div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }).format(book?.detail?.price ?? 0)}
                                </div>
                            </div>
                        )
                    })}
                </div>
                {carts.length > 0 ?
                    <div className='pop-cart-footer'>
                        <button onClick={() => navigate('/order')}>Xem giỏ hàng</button>
                    </div>
                    :
                    <Empty
                        description="Không có sản phẩm trong giỏ hàng"
                    />
                }
            </div>
        )
    }

    return (
        <>
            <div className='header-container'>
                <header className="page-header">
                    <div className="page-header__top">
                        <div className="page-header__toggle" onClick={() => {
                            setOpenDrawer(true)
                        }}>☰
                        </div>
                        <div className='page-header__logo'>
                             <span className='logo'>
                                 <span onClick={() => navigate('/')}> <FaReact className='rotate icon-react'/>Tik! Shop</span>

                                 <VscSearchFuzzy className='icon-search'/>
                             </span>
                            <input
                                className="input-search"
                                type={'text'}
                                placeholder="Bạn tìm gì hôm nay"
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                            />
                        </div>

                    </div>
                    <nav className="page-header__bottom">
                        <ul id="navigation" className="navigation">
                            <li className="navigation__item">
                                {!isMobile ?
                                    <Popover
                                        className="popover-carts"
                                        placement="topRight"
                                        rootClassName="popover-carts"
                                        title={"Sản phẩm mới thêm"}
                                        content={contentPopover}
                                        arrow={true}>
                                        <Badge
                                            count={carts?.length ?? 0}
                                            size={"small"}
                                            showZero
                                        >
                                            <FiShoppingCart className='icon-cart'/>
                                        </Badge>
                                    </Popover>
                                    :
                                    <Badge
                                        count={carts?.length ?? 0}
                                        size={"small"}
                                        showZero
                                        onClick={() => navigate("/order")}
                                    >
                                        <FiShoppingCart className='icon-cart'/>
                                    </Badge>
                                }
                            </li>
                            <li className="navigation__item mobile"><Divider type='vertical'/></li>
                            <li className="navigation__item mobile">
                                {!isAuthenticated ?
                                    <span onClick={() => navigate('/login')}> Tài Khoản</span>
                                    :
                                    <Dropdown menu={{items}} trigger={['click']}>
                                        <Space>
                                            <Avatar src={urlAvatar}/>
                                            {user?.fullName}
                                        </Space>
                                    </Dropdown>
                                }
                            </li>
                        </ul>
                    </nav>
                </header>
            </div>
            <Drawer
                title="Menu chức năng"
                placement="left"
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}
            >
                <p>Quản lý tài khoản</p>
                <Divider/>

                <p onClick={() => handleLogout()}>Đăng xuất</p>
                <Divider/>
            </Drawer>
            <ManageAccount
                openManageAccount={openManageAccount}
                setOpenManageAccount={setOpenManageAccount}
            />
        </>
    )
}

export default AppHeader;